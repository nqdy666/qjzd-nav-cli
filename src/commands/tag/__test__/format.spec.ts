import { expect, test, vi } from "vitest";
import { afterEach, describe } from "vitest";

import { printTagList, printTagCreated, printTagUpdated, printTagDeleted } from "../format.js";

describe("tag format", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("printTagList", () => {
    test("prints empty message when no tags", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printTagList({ items: [], total: 0, page: 1, pageSize: 20 }, false);
      expect(consoleSpy).toHaveBeenCalledWith("No tags found.\n");
    });

    test("prints tags table", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const mockResponse = {
        items: [
          {
            id: "1",
            name: "JavaScript",
            color: "#F7DF1E",
            _linkCount: 10,
            createdAt: 1704067200000,
          },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
      };
      printTagList(mockResponse, false);
      expect(consoleSpy.mock.calls.join("")).toContain("JavaScript");
      expect(consoleSpy.mock.calls.join("")).toContain("#F7DF1E");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const mockResponse = {
        items: [{ id: "1", name: "Test", color: "#000000", createdAt: 1704067200000 }],
        total: 1,
        page: 1,
        pageSize: 20,
      };
      printTagList(mockResponse, true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.items).toHaveLength(1);
    });
  });

  describe("printTagCreated", () => {
    test("prints tag created message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const tag = { id: "123", name: "New Tag", color: "#FF0000" } as any;
      printTagCreated(tag, false);
      expect(consoleSpy).toHaveBeenCalledWith("Tag created: New Tag\n");
      expect(consoleSpy).toHaveBeenCalledWith("ID: 123\n");
    });
  });

  describe("printTagUpdated", () => {
    test("prints tag updated message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const tag = { id: "456", name: "Updated Tag" } as any;
      printTagUpdated(tag, false);
      expect(consoleSpy).toHaveBeenCalledWith("Tag updated: Updated Tag\n");
      expect(consoleSpy).toHaveBeenCalledWith("ID: 456\n");
    });
  });

  describe("printTagDeleted", () => {
    test("prints tag deleted message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printTagDeleted({ deleted: true }, false);
      expect(consoleSpy).toHaveBeenCalledWith("Tag deleted.\n");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printTagDeleted({ deleted: true }, true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.deleted).toBe(true);
    });
  });
});
