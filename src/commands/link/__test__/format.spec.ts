import { expect, test, vi } from "vitest";
import { afterEach, describe } from "vitest";

import { printLinkList, printLinkCreated, printLinkUpdated, printLinkDeleted } from "../format.js";

describe("link format", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("printLinkList", () => {
    test("prints empty message when no links", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printLinkList({ items: [], total: 0, page: 1, pageSize: 20 }, false);
      expect(consoleSpy).toHaveBeenCalledWith("No links found.\n");
    });

    test("prints links table", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const mockResponse = {
        items: [
          {
            id: "1",
            title: "Google",
            url: "https://google.com",
            categoryId: "cat1",
            tags: ["tag1", "tag2"],
            order: 1,
            clicks: 10,
            createdAt: 1704067200000,
            updatedAt: 1704067200000,
          },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
      };
      printLinkList(mockResponse, false);
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls.join("")).toContain("Google");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const mockResponse = {
        items: [
          {
            id: "1",
            title: "Google",
            url: "https://google.com",
            categoryId: "cat1",
            tags: [],
            order: 1,
            clicks: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
      };
      printLinkList(mockResponse, true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.items).toHaveLength(1);
      expect(parsed.items[0].title).toBe("Google");
    });
  });

  describe("printLinkCreated", () => {
    test("prints link created message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const link = { id: "123", title: "Test Link", url: "https://test.com" } as any;
      printLinkCreated(link, false);
      expect(consoleSpy).toHaveBeenCalledWith("Link created: Test Link\n");
      expect(consoleSpy).toHaveBeenCalledWith("ID: 123\n");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const link = { id: "123", title: "Test Link" } as any;
      printLinkCreated(link, true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.title).toBe("Test Link");
    });
  });

  describe("printLinkUpdated", () => {
    test("prints link updated message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const link = { id: "456", title: "Updated Link" } as any;
      printLinkUpdated(link, false);
      expect(consoleSpy).toHaveBeenCalledWith("Link updated: Updated Link\n");
      expect(consoleSpy).toHaveBeenCalledWith("ID: 456\n");
    });
  });

  describe("printLinkDeleted", () => {
    test("prints link deleted message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printLinkDeleted("789", false);
      expect(consoleSpy).toHaveBeenCalledWith("Link deleted: 789\n");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printLinkDeleted("789", true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.deleted).toBe(true);
      expect(parsed.id).toBe("789");
    });
  });
});
