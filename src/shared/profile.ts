export interface BearerCredentials {
  type: "bearer";
  token: string;
}

export type QjzdNavCredentials = BearerCredentials;

export interface StoredQjzdNavAuth {
  type: AuthType;
}

export interface StoredQjzdNavProfile {
  name: string;
  baseUrl: string;
  auth: StoredQjzdNavAuth;
  createdAt: string;
  updatedAt: string;
}

export interface QjzdNavProfile extends Omit<StoredQjzdNavProfile, "auth"> {
  auth: QjzdNavCredentials;
}

export interface QjzdNavConfig {
  activeProfile?: string;
  profiles: Record<string, StoredQjzdNavProfile>;
}

export type AuthType = "bearer";

export function toStoredQjzdNavProfile(profile: QjzdNavProfile): StoredQjzdNavProfile {
  return {
    name: profile.name,
    baseUrl: profile.baseUrl,
    auth: {
      type: profile.auth.type,
    },
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}
