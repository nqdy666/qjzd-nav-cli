import { expect, test, vi } from "vitest";
import { afterEach, describe } from "vitest";

import { printBackupList, printBackupCreated, printBackupDeleted } from "../format.js";

describe("backup format", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("printBackupList", () => {
    test("prints empty message when no backups", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printBackupList([], false);
      expect(consoleSpy).toHaveBeenCalledWith("No backups found.\n");
    });

    test("prints backup items", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const backups = [
        {
          filename: "qjzd-nav-backup-2024-01-01.json",
          size: 1024 * 50,
          createdAt: 1704067200000,
          type: "json" as const,
        },
        {
          filename: "qjzd-nav-backup-2024-01-02.zip",
          size: 1024 * 1024 * 2,
          createdAt: 1704153600000,
          type: "zip" as const,
        },
      ];
      printBackupList(backups, false);
      const output = consoleSpy.mock.calls.join("");
      expect(output).toContain("qjzd-nav-backup-2024-01-01.json");
      expect(output).toContain("[ZIP]");
      expect(output).toContain("[JSON]");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const backups = [
        { filename: "test.json", size: 1000, createdAt: 1704067200000, type: "json" as const },
      ];
      printBackupList(backups, true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].filename).toBe("test.json");
    });
  });

  describe("printBackupCreated", () => {
    test("prints backup created message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printBackupCreated("backup-2024.json", false);
      expect(consoleSpy).toHaveBeenCalledWith("Backup created: backup-2024.json\n");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printBackupCreated("backup-2024.json", true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.success).toBe(true);
      expect(parsed.filename).toBe("backup-2024.json");
    });
  });

  describe("printBackupDeleted", () => {
    test("prints backup deleted message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printBackupDeleted("old-backup.json", false);
      expect(consoleSpy).toHaveBeenCalledWith("Backup deleted: old-backup.json\n");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printBackupDeleted("old-backup.json", true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.success).toBe(true);
      expect(parsed.filename).toBe("old-backup.json");
    });
  });
});
