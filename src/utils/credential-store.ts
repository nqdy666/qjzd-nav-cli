import { Entry } from "@napi-rs/keyring";

import type { QjzdNavCredentials } from "../shared/profile.js";
import { CliError } from "./errors.js";

const QJZD_NAV_CLI_KEYRING_SERVICE = "@qjzd-nav/cli";

function formatProfileLabel(profileName: string): string {
  return `"${profileName}"`;
}

export interface CredentialStore {
  setProfileCredentials(profileName: string, credentials: QjzdNavCredentials): Promise<void>;
  getProfileCredentials(profileName: string): Promise<QjzdNavCredentials | undefined>;
  deleteProfileCredentials(profileName: string): Promise<void>;
}

function getProfileKeyringEntry(profileName: string): Entry {
  return new Entry(QJZD_NAV_CLI_KEYRING_SERVICE, `profile:${profileName}`);
}

function isQjzdNavCredentials(value: unknown): value is QjzdNavCredentials {
  if (!value || typeof value !== "object") {
    return false;
  }

  const auth = value as Partial<QjzdNavCredentials> & Record<string, unknown>;
  if (auth.type === "bearer") {
    return typeof auth.token === "string";
  }

  return false;
}

export class KeyringCredentialStore implements CredentialStore {
  async setProfileCredentials(profileName: string, credentials: QjzdNavCredentials): Promise<void> {
    try {
      getProfileKeyringEntry(profileName).setPassword(JSON.stringify(credentials));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown keyring error.";
      throw new CliError(
        `Failed to store credentials for profile ${formatProfileLabel(profileName)}: ${message}`,
      );
    }
  }

  async getProfileCredentials(profileName: string): Promise<QjzdNavCredentials | undefined> {
    let raw: string | null;

    try {
      raw = getProfileKeyringEntry(profileName).getPassword();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown keyring error.";
      throw new CliError(
        `Failed to read credentials for profile ${formatProfileLabel(profileName)}: ${message}`,
      );
    }

    if (!raw) {
      return undefined;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new CliError(
        `Stored credentials for profile ${formatProfileLabel(profileName)} are invalid.`,
      );
    }

    if (!isQjzdNavCredentials(parsed)) {
      throw new CliError(
        `Stored credentials for profile ${formatProfileLabel(profileName)} are invalid.`,
      );
    }

    return parsed;
  }

  async deleteProfileCredentials(profileName: string): Promise<void> {
    try {
      getProfileKeyringEntry(profileName).deletePassword();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown keyring error.";
      throw new CliError(
        `Failed to delete credentials for profile ${formatProfileLabel(profileName)}: ${message}`,
      );
    }
  }
}
