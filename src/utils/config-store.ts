import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

import type { QjzdNavConfig, QjzdNavProfile, StoredQjzdNavProfile } from "../shared/profile.js";
import { toStoredQjzdNavProfile } from "../shared/profile.js";
import { KeyringCredentialStore, type CredentialStore } from "./credential-store.js";
import { CliError } from "./errors.js";

const DEFAULT_CONFIG: QjzdNavConfig = {
  profiles: {},
};

function createEmptyConfig(): QjzdNavConfig {
  return {
    activeProfile: DEFAULT_CONFIG.activeProfile,
    profiles: {},
  };
}

export type ProfileCredentialHealthStatus = "ok" | "missing-credentials" | "auth-type-mismatch";

export interface ProfileCredentialHealth {
  name: string;
  baseUrl: string;
  authType: StoredQjzdNavProfile["auth"]["type"];
  status: ProfileCredentialHealthStatus;
}

export interface ProfileCredentialDoctorReport {
  activeProfile?: string;
  ok: boolean;
  profiles: ProfileCredentialHealth[];
}

interface ConfigFileStoredProfile {
  name?: string;
  baseUrl?: string;
  auth?: {
    type?: unknown;
    token?: unknown;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface ConfigFileContents {
  activeProfile?: string;
  profiles?: Record<string, ConfigFileStoredProfile>;
}

function resolveConfigRoot(): string {
  if (process.env.QJZD_NAV_CLI_CONFIG_DIR) {
    return process.env.QJZD_NAV_CLI_CONFIG_DIR;
  }

  const xdgConfigHome = process.env.XDG_CONFIG_HOME;
  if (xdgConfigHome) {
    return join(xdgConfigHome, "qjzd-nav");
  }

  return join(homedir(), ".config", "qjzd-nav");
}

export class ConfigStore {
  readonly configPath: string;
  readonly credentialStore: CredentialStore;

  constructor(
    configPath = join(resolveConfigRoot(), "config.json"),
    credentialStore: CredentialStore = new KeyringCredentialStore(),
  ) {
    this.configPath = configPath;
    this.credentialStore = credentialStore;
  }

  async load(): Promise<QjzdNavConfig> {
    try {
      const raw = await readFile(this.configPath, "utf8");
      const parsed = JSON.parse(raw) as ConfigFileContents;
      return {
        activeProfile: parsed.activeProfile,
        profiles: this.validateStoredProfiles(parsed.profiles ?? {}),
      };
    } catch (error) {
      const maybeNodeError = error as NodeJS.ErrnoException;
      if (maybeNodeError.code === "ENOENT") {
        return createEmptyConfig();
      }

      throw new CliError(`Failed to read CLI config: ${maybeNodeError.message}`);
    }
  }

  async save(config: QjzdNavConfig): Promise<void> {
    await mkdir(dirname(this.configPath), { recursive: true });
    await writeFile(this.configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  }

  async upsertProfile(profile: QjzdNavProfile, setActive = true): Promise<QjzdNavConfig> {
    const config = await this.load();
    await this.credentialStore.setProfileCredentials(profile.name, profile.auth);
    config.profiles[profile.name] = toStoredQjzdNavProfile(profile);
    if (setActive) {
      config.activeProfile = profile.name;
    }
    await this.save(config);
    return config;
  }

  async getResolvedProfile(name: string): Promise<QjzdNavProfile | undefined> {
    const config = await this.load();
    const storedProfile = config.profiles[name];
    if (!storedProfile) {
      return undefined;
    }

    return this.resolveProfile(storedProfile);
  }

  async getStoredProfile(name: string): Promise<StoredQjzdNavProfile | undefined> {
    const config = await this.load();
    return config.profiles[name];
  }

  async listProfiles(): Promise<{ activeProfile?: string; profiles: StoredQjzdNavProfile[] }> {
    const config = await this.load();
    const profiles = Object.values(config.profiles).sort((left, right) =>
      left.name.localeCompare(right.name),
    );

    return {
      activeProfile: config.activeProfile,
      profiles,
    };
  }

  async setActiveProfile(name: string): Promise<StoredQjzdNavProfile> {
    const config = await this.load();
    const profile = config.profiles[name];

    if (!profile) {
      throw new CliError(`QJZD Nav profile "${name}" does not exist.`);
    }

    config.activeProfile = name;
    await this.save(config);
    return profile;
  }

  async deleteProfile(
    name: string,
  ): Promise<{ profile: StoredQjzdNavProfile; activeProfile?: string }> {
    const config = await this.load();
    const profile = config.profiles[name];

    if (!profile) {
      throw new CliError(`QJZD Nav profile "${name}" does not exist.`);
    }

    delete config.profiles[name];
    if (config.activeProfile === name) {
      delete config.activeProfile;
    }

    await this.save(config);

    try {
      await this.credentialStore.deleteProfileCredentials(name);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown keyring error.";
      throw new CliError(
        `Profile "${name}" was removed from config, but deleting its saved credentials failed: ${message}`,
      );
    }

    return {
      profile,
      activeProfile: config.activeProfile,
    };
  }

  async getActiveStoredProfile(explicitName?: string): Promise<StoredQjzdNavProfile> {
    const config = await this.load();
    const profileName = explicitName ?? config.activeProfile;

    if (!profileName) {
      throw new CliError("No active QJZD Nav profile found. Run `qjzd-nav auth login` first.");
    }

    const profile = config.profiles[profileName];
    if (!profile) {
      throw new CliError(`QJZD Nav profile "${profileName}" does not exist.`);
    }

    return profile;
  }

  async getActiveResolvedProfile(explicitName?: string): Promise<QjzdNavProfile> {
    return this.resolveProfile(await this.getActiveStoredProfile(explicitName));
  }

  async inspectProfileCredentials(): Promise<ProfileCredentialDoctorReport> {
    const { activeProfile, profiles } = await this.listProfiles();
    const reportProfiles = await Promise.all(
      profiles.map(async (profile) => {
        const credentials = await this.credentialStore.getProfileCredentials(profile.name);

        let status: ProfileCredentialHealthStatus = "ok";
        if (!credentials) {
          status = "missing-credentials";
        } else if (credentials.type !== profile.auth.type) {
          status = "auth-type-mismatch";
        }

        return {
          name: profile.name,
          baseUrl: profile.baseUrl,
          authType: profile.auth.type,
          status,
        } satisfies ProfileCredentialHealth;
      }),
    );

    return {
      activeProfile,
      ok: reportProfiles.every((profile) => profile.status === "ok"),
      profiles: reportProfiles,
    };
  }

  private validateStoredProfiles(
    profiles: Record<string, ConfigFileStoredProfile>,
  ): Record<string, StoredQjzdNavProfile> {
    const validatedProfiles: Record<string, StoredQjzdNavProfile> = {};

    for (const [profileName, profile] of Object.entries(profiles)) {
      const name =
        typeof profile.name === "string" && profile.name.trim() ? profile.name : profileName;
      const baseUrl = profile.baseUrl?.trim();
      const createdAt = profile.createdAt?.trim();
      const updatedAt = profile.updatedAt?.trim();

      if (!baseUrl || !createdAt || !updatedAt) {
        throw new CliError(`QJZD Nav profile "${profileName}" is invalid in config.json.`);
      }

      if (profile.auth && typeof profile.auth.token === "string") {
        throw new CliError(
          `QJZD Nav profile "${profileName}" uses an unsupported legacy credential format in config.json. Run \`qjzd-nav auth login --profile ${name}\` again to recreate it securely.`,
        );
      }

      const authType = profile.auth?.type;
      if (authType !== "bearer") {
        throw new CliError(`QJZD Nav profile "${profileName}" is missing auth type information.`);
      }

      validatedProfiles[name] = {
        name,
        baseUrl,
        auth: {
          type: authType,
        },
        createdAt,
        updatedAt,
      };
    }

    return validatedProfiles;
  }

  private async resolveProfile(storedProfile: StoredQjzdNavProfile): Promise<QjzdNavProfile> {
    const credentials = await this.credentialStore.getProfileCredentials(storedProfile.name);

    if (!credentials || credentials.type !== storedProfile.auth.type) {
      throw new CliError(
        `Credentials for profile "${storedProfile.name}" are missing from the system keyring. Run \`qjzd-nav auth login --profile ${storedProfile.name}\` again to restore them.`,
      );
    }

    return {
      ...storedProfile,
      auth: credentials,
    };
  }
}
