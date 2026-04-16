import { expect, test, vi } from "vitest";
import { afterEach, describe } from "vitest";

import { printSettings, printSettingsUpdated } from "../format.js";

describe("settings format", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("printSettings", () => {
    const mockSettings = {
      siteTitle: "My Nav",
      siteSubtitle: "Links",
      logoIcon: "i-lucide-compass",
      logoImage: "",
      favicon: "",
      backgroundImage: "",
      backgroundOverlay: 60,
      showShortcutHints: true,
      sidebarCollapsed: false,
      showEditButton: true,
      showSettingsButton: true,
    };

    test("prints settings", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printSettings(mockSettings, false);
      const output = consoleSpy.mock.calls.join("");
      expect(output).toContain("Site Title: My Nav");
      expect(output).toContain("Site Subtitle: Links");
      expect(output).toContain("Background Overlay: 60%");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printSettings(mockSettings, true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.siteTitle).toBe("My Nav");
    });

    test("shows (not set) for empty image fields", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printSettings(mockSettings, false);
      const output = consoleSpy.mock.calls.join("");
      expect(output).toContain("(not set)");
    });
  });

  describe("printSettingsUpdated", () => {
    test("prints success message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printSettingsUpdated(false);
      expect(consoleSpy).toHaveBeenCalledWith("Settings updated successfully.\n");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printSettingsUpdated(true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.success).toBe(true);
    });
  });
});
