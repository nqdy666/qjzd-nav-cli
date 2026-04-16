import { afterEach, describe, expect, test, vi } from "vitest";

import {
  printAuthLoginSuccess,
  printProfileList,
  printStoredProfile,
  printProfileUseSuccess,
  printProfileDeleteSuccess,
  printProfileDoctorReport,
} from "../format.js";

describe("auth format", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("printAuthLoginSuccess", () => {
    test("prints login success message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const profile = {
        name: "local",
        baseUrl: "https://nav.qjzd.online",
        auth: { type: "bearer" as const },
      } as any;
      printAuthLoginSuccess(profile, false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Logged in to https://nav.qjzd.online using profile local.\n",
      );
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const profile = {
        name: "local",
        baseUrl: "https://nav.qjzd.online",
        auth: { type: "bearer" as const },
      } as any;
      printAuthLoginSuccess(profile, true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.profile).toBe("local");
      expect(parsed.baseUrl).toBe("https://nav.qjzd.online");
    });
  });

  describe("printProfileList", () => {
    test("prints empty message when no profiles", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printProfileList(undefined, [], false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "No QJZD Nav profiles configured. Run `qjzd-nav auth login` first.\n",
      );
    });

    test("prints profiles table", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const profiles = [
        {
          name: "local",
          baseUrl: "https://nav.qjzd.online",
          auth: { type: "bearer" as const },
        },
        {
          name: "production",
          baseUrl: "https://nav.example.com",
          auth: { type: "bearer" as const },
        },
      ] as any;
      printProfileList("local", profiles, false);
      expect(consoleSpy.mock.calls.join("")).toContain("local");
      expect(consoleSpy.mock.calls.join("")).toContain("production");
      expect(consoleSpy.mock.calls.join("")).toContain("*");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const profiles = [{ name: "local", baseUrl: "https://nav.qjzd.online" }] as any;
      printProfileList("local", profiles, true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.activeProfile).toBe("local");
      expect(parsed.profiles).toHaveLength(1);
    });
  });

  describe("printStoredProfile", () => {
    test("prints profile details", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const profile = {
        name: "local",
        baseUrl: "https://nav.qjzd.online",
        auth: { type: "bearer" },
      } as any;
      printStoredProfile(profile, false);
      expect(consoleSpy).toHaveBeenCalled();
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const profile = { name: "local", baseUrl: "https://nav.qjzd.online" } as any;
      printStoredProfile(profile, true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.name).toBe("local");
    });
  });

  describe("printProfileUseSuccess", () => {
    test("prints success message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const profile = { name: "production" } as any;
      printProfileUseSuccess(profile, false);
      expect(consoleSpy).toHaveBeenCalledWith("Active profile set to production.\n");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const profile = { name: "production" } as any;
      printProfileUseSuccess(profile, true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.activeProfile).toBe("production");
    });
  });

  describe("printProfileDeleteSuccess", () => {
    test("prints delete success with active profile remaining", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printProfileDeleteSuccess("local", "production", false);
      const output = consoleSpy.mock.calls.join("");
      expect(output).toContain("Deleted profile local");
      expect(output).toContain("Active profile remains production");
    });

    test("prints delete success with no active profile", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printProfileDeleteSuccess("local", undefined, false);
      const output = consoleSpy.mock.calls.join("");
      expect(output).toContain("Deleted profile local");
      expect(output).toContain("No active profile is selected now");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printProfileDeleteSuccess("local", "production", true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.deleted).toBe(true);
      expect(parsed.name).toBe("local");
      expect(parsed.activeProfile).toBe("production");
    });
  });

  describe("printProfileDoctorReport", () => {
    test("prints empty message when no profiles", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printProfileDoctorReport({ ok: true, profiles: [], activeProfile: undefined }, false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "No QJZD Nav profiles configured. Run `qjzd-nav auth login` first.\n",
      );
    });

    test("prints report when no issues", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const report = {
        ok: true,
        activeProfile: "local",
        profiles: [
          {
            name: "local",
            baseUrl: "https://nav.qjzd.online",
            authType: "bearer" as const,
            status: "ok" as const,
          },
        ],
      };
      printProfileDoctorReport(report as any, false);
      const output = consoleSpy.mock.calls.join("");
      expect(output).toContain("local");
      expect(output).toContain("Profile credential check passed");
    });

    test("prints report when issues detected", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const report = {
        ok: false,
        activeProfile: "local",
        profiles: [
          {
            name: "local",
            baseUrl: "https://nav.qjzd.online",
            authType: "bearer" as const,
            status: "missing-credentials" as const,
          },
        ],
      };
      printProfileDoctorReport(report as any, false);
      const output = consoleSpy.mock.calls.join("");
      expect(output).toContain("missing credentials");
      expect(output).toContain("Profile credential issues detected");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const report = {
        ok: true,
        activeProfile: "local",
        profiles: [],
      };
      printProfileDoctorReport(report, true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.ok).toBe(true);
    });
  });
});
