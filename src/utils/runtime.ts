import axios, { type AxiosInstance } from "axios";

import type { QjzdNavProfile } from "../shared/profile.js";
import { ConfigStore } from "./config-store.js";
import { printExecutionTarget } from "./output.js";
import { normalizeBaseUrl } from "./url.js";

export interface QjzdNavClients {
  axios: AxiosInstance;
}

export interface ProfileSelectionOptions {
  profile?: string;
  json?: boolean;
}

export function buildAuthHeader(profile: QjzdNavProfile): string {
  return `Bearer ${profile.auth.token}`;
}

function createAxiosClient(profile: QjzdNavProfile): AxiosInstance {
  return axios.create({
    baseURL: normalizeBaseUrl(profile.baseUrl),
    timeout: 30_000,
    maxBodyLength: Infinity,
    headers: {
      Accept: "application/json",
      Authorization: buildAuthHeader(profile),
    },
  });
}

export class RuntimeContext {
  readonly configStore: ConfigStore;

  constructor(configStore = new ConfigStore()) {
    this.configStore = configStore;
  }

  async getResolvedProfile(options?: ProfileSelectionOptions): Promise<QjzdNavProfile> {
    return this.configStore.getActiveResolvedProfile(options?.profile);
  }

  getClientsForResolvedProfile(profile: QjzdNavProfile): QjzdNavClients {
    const axiosInstance = createAxiosClient(profile);
    return {
      axios: axiosInstance,
    };
  }

  async getClientsForOptions(
    options?: ProfileSelectionOptions,
  ): Promise<{ profile: QjzdNavProfile; clients: QjzdNavClients }> {
    const profile = await this.getResolvedProfile(options);
    printExecutionTarget(
      {
        profileName: profile.name,
        baseUrl: profile.baseUrl,
      },
      options?.json,
    );
    return {
      profile,
      clients: this.getClientsForResolvedProfile(profile),
    };
  }
}
