import crypto from "node:crypto";

import { input, password } from "@inquirer/prompts";
import axios from "axios";
import cac, { type CAC } from "cac";

import type { QjzdNavProfile, StoredQjzdNavProfile } from "../../shared/profile.js";
import { toStoredQjzdNavProfile } from "../../shared/profile.js";
import { tryRunCommandCliRoute, tryRunNestedCliRoute } from "../../utils/command-router.js";
import { confirmDangerousAction } from "../../utils/confirmation.js";
import { CliError } from "../../utils/errors.js";
import { isInteractive } from "../../utils/options.js";
import { printExecutionTarget, printJson } from "../../utils/output.js";
import { RuntimeContext } from "../../utils/runtime.js";
import { normalizeBaseUrl } from "../../utils/url.js";
import {
  printAuthLoginSuccess,
  printProfileDeleteSuccess,
  printProfileDoctorReport,
  printProfileList,
  printStoredProfile,
  printProfileUseSuccess,
} from "./format.js";

interface AuthLoginOptions {
  profile?: string;
  url?: string;
  password?: string;
  tokenExpiry?: string;
  json?: boolean;
}

interface AuthCurrentOptions {
  profile?: string;
  json?: boolean;
}

interface AuthProfileUseOptions {
  profile?: string;
  json?: boolean;
}

interface AuthProfileGetOptions {
  profile?: string;
  json?: boolean;
}

interface AuthProfileDeleteOptions {
  profile?: string;
  json?: boolean;
  force?: boolean;
}

interface AuthProfileDoctorOptions {
  json?: boolean;
}

export function createProfileTimestamp(existing?: Pick<StoredQjzdNavProfile, "createdAt">): {
  createdAt: string;
  updatedAt: string;
} {
  const now = new Date().toISOString();
  return {
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

async function validateProfile(profile: QjzdNavProfile, runtime: RuntimeContext, json = false) {
  printExecutionTarget(
    {
      profileName: profile.name,
      baseUrl: profile.baseUrl,
    },
    json,
  );
  const clients = runtime.getClientsForResolvedProfile(profile);
  // Test the connection by fetching categories
  await clients.axios.get("/api/categories");
  return true;
}

export function resolveAuthProfileUseName(
  name: string | undefined,
  profile: string | undefined,
): string {
  return resolveAuthProfileName(name, profile, "qjzd-nav auth profile use");
}

export function resolveAuthProfileName(
  name: string | undefined,
  profile: string | undefined,
  commandPath: string,
): string {
  const profileName = name ?? profile;
  if (!profileName) {
    throw new CliError(
      `\`${commandPath}\` requires a profile name, for example: \`${commandPath} local\`. You can also use --profile <name>.`,
    );
  }

  return profileName;
}

export function validateResolvedLoginInput(
  options: AuthLoginOptions,
  profile: string | undefined,
  url: string | undefined,
): Required<Pick<AuthLoginOptions, "profile" | "url">> & AuthLoginOptions {
  if (!profile || !url) {
    throw new CliError(
      "`qjzd-nav auth login` requires --profile and --url in non-interactive mode.",
    );
  }

  if (!options.password) {
    throw new CliError("Login requires --password.");
  }

  return {
    ...options,
    profile,
    url,
  };
}

async function encryptPasswordWithPublicKey(password: string, publicKey: string): Promise<string> {
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(password, "utf8"),
  );
  return encrypted.toString("base64");
}

function buildAuthCli(runtime: RuntimeContext): CAC {
  const authCli = cac("qjzd-nav auth");

  authCli
    .command("login", "Login and save a QJZD Nav profile")
    .option("--profile <name>", "Profile name to save")
    .option("--url <url>", "QJZD Nav base URL")
    .option("--password <password>", "Login password")
    .option("--token-expiry <expiry>", "Token expiry: 1d, 1w, 1M, 3M, 6M, 1y, forever")
    .option("--json", "Output JSON")
    .action(async (options: AuthLoginOptions) => {
      const resolved = await resolveLoginInput(options);
      const existing = await runtime.configStore.getStoredProfile(resolved.profile);
      const timestamps = createProfileTimestamp(existing);

      // Check if auth is enabled
      const enabledResponse = await axios.get(`${normalizeBaseUrl(resolved.url)}/api/auth/enabled`);
      if (!enabledResponse.data.enabled) {
        throw new CliError("Authentication is not enabled on this QJZD Nav instance.");
      }

      // Get public key
      const publicKeyResponse = await axios.get(
        `${normalizeBaseUrl(resolved.url)}/api/auth/public-key`,
      );
      const publicKey = publicKeyResponse.data.publicKey;

      // Encrypt password
      const encryptedPassword = await encryptPasswordWithPublicKey(resolved.password!, publicKey);

      // Verify and get token
      const verifyResponse = await axios.post(`${normalizeBaseUrl(resolved.url)}/api/auth/verify`, {
        password: encryptedPassword,
        encrypted: true,
        tokenExpiry: resolved.tokenExpiry,
      });

      const { token } = verifyResponse.data;

      const profile: QjzdNavProfile = {
        name: resolved.profile,
        baseUrl: normalizeBaseUrl(resolved.url),
        auth: {
          type: "bearer",
          token: token,
        },
        ...timestamps,
      };

      await validateProfile(profile, runtime, options.json);
      await runtime.configStore.upsertProfile(profile, true);
      const storedProfile = toStoredQjzdNavProfile(profile);

      if (options.json) {
        printJson({
          profile: storedProfile,
        });
        return;
      }

      printAuthLoginSuccess(storedProfile, false);
    });

  authCli
    .command("current", "Show the current active profile")
    .option("--profile <name>", "Inspect a specific profile by name")
    .option("--json", "Output JSON")
    .action(async (options: AuthCurrentOptions) => {
      const profile = await runtime.configStore.getActiveStoredProfile(options.profile);
      printStoredProfile(profile, options.json);
    });

  authCli.command("profile", "Manage saved profiles");

  authCli.usage("<command> [flags]");
  authCli.example(
    (bin) => `${bin} login --profile local --url http://127.0.0.1:3000 --password <password>`,
  );
  authCli.example((bin) => `${bin} current`);
  authCli.example((bin) => `${bin} profile list`);
  authCli.example((bin) => `${bin} profile get local`);
  authCli.example((bin) => `${bin} profile use local`);
  authCli.example((bin) => `${bin} profile delete local --force`);
  authCli.example((bin) => `${bin} profile doctor`);
  authCli.help();

  return authCli;
}

function buildAuthProfileCli(runtime: RuntimeContext): CAC {
  const profileCli = cac("qjzd-nav auth profile");

  profileCli
    .command("list", "List saved profiles")
    .option("--json", "Output JSON")
    .action(async (options: { json?: boolean }) => {
      const { activeProfile, profiles } = await runtime.configStore.listProfiles();
      printProfileList(activeProfile, profiles, options.json);
    });

  profileCli
    .command("current", "Show the active saved profile")
    .option("--json", "Output JSON")
    .action(async (options: { json?: boolean }) => {
      const profile = await runtime.configStore.getActiveStoredProfile();
      printStoredProfile(profile, options.json);
    });

  profileCli
    .command("get [name]", "Show a saved profile")
    .option("--profile <name>", "Profile name to inspect")
    .option("--json", "Output JSON")
    .action(async (name: string | undefined, options: AuthProfileGetOptions) => {
      const profileName = resolveAuthProfileName(
        name,
        options.profile,
        "qjzd-nav auth profile get",
      );
      const profile = await runtime.configStore.getStoredProfile(profileName);

      if (!profile) {
        throw new CliError(`QJZD Nav profile "${profileName}" does not exist.`);
      }

      printStoredProfile(profile, options.json);
    });

  profileCli
    .command("use [name]", "Switch the active profile")
    .option("--profile <name>", "Profile name to activate")
    .option("--json", "Output JSON")
    .action(async (name: string | undefined, options: AuthProfileUseOptions) => {
      const profileName = resolveAuthProfileUseName(name, options.profile);
      const profile = await runtime.configStore.setActiveProfile(profileName);
      printProfileUseSuccess(profile, options.json);
    });

  profileCli
    .command("delete [name]", "Delete a saved profile and its stored credentials")
    .option("--profile <name>", "Profile name to delete")
    .option("--json", "Output JSON")
    .option("--force", "Delete without confirmation")
    .action(async (name: string | undefined, options: AuthProfileDeleteOptions) => {
      const profileName = resolveAuthProfileName(
        name,
        options.profile,
        "qjzd-nav auth profile delete",
      );

      if (
        !(await confirmDangerousAction(
          {
            commandPath: "qjzd-nav auth profile delete",
            actionLabel: "Delete",
            resourceLabel: "profile",
            resourceName: profileName,
            cancellationVerb: "deleting",
          },
          options,
        ))
      ) {
        return;
      }

      const result = await runtime.configStore.deleteProfile(profileName);
      printProfileDeleteSuccess(result.profile.name, result.activeProfile, options.json);
    });

  profileCli
    .command("doctor", "Check saved profiles against stored credentials")
    .option("--json", "Output JSON")
    .action(async (options: AuthProfileDoctorOptions) => {
      const report = await runtime.configStore.inspectProfileCredentials();
      printProfileDoctorReport(report, options.json);
      if (!report.ok) {
        process.exitCode = 1;
      }
    });

  profileCli.usage("<command> [flags]");
  profileCli.example((bin) => `${bin} list`);
  profileCli.example((bin) => `${bin} current`);
  profileCli.example((bin) => `${bin} get local`);
  profileCli.example((bin) => `${bin} use local`);
  profileCli.example((bin) => `${bin} delete local --force`);
  profileCli.example((bin) => `${bin} doctor`);
  profileCli.help();

  return profileCli;
}

export async function tryRunAuthCommand(args: string[], runtime: RuntimeContext): Promise<boolean> {
  if (args[0] !== "auth") {
    return false;
  }

  if (
    await tryRunNestedCliRoute({
      branch: "profile",
      cliName: "qjzd-nav auth profile",
      args,
      buildCli: () => buildAuthProfileCli(runtime),
    })
  ) {
    return true;
  }

  return tryRunCommandCliRoute({
    command: "auth",
    cliName: "qjzd-nav auth",
    args,
    buildCli: () => buildAuthCli(runtime),
  });
}

async function resolveLoginInput(
  options: AuthLoginOptions,
): Promise<Required<Pick<AuthLoginOptions, "profile" | "url">> & AuthLoginOptions> {
  const interactive = isInteractive();

  const profile =
    options.profile ??
    (interactive ? await input({ message: "Profile name", default: "default" }) : undefined);
  const url =
    options.url ??
    (interactive
      ? await input({
          message: "QJZD Nav base URL",
          validate: (value) => (value.trim().length > 0 ? true : "Base URL is required."),
        })
      : undefined);

  if (!options.password && interactive) {
    options.password = await password({ message: "Password" });
  }

  return validateResolvedLoginInput(options, profile, url);
}

export function registerAuthCommands(cli: CAC): void {
  cli.command("auth", "Authentication commands");
}
