import { expect, test, vi } from "vitest";
import { afterEach, describe } from "vitest";

import {
  printCategoryList,
  printCategoryCreated,
  printCategoryUpdated,
  printCategoryDeleted,
} from "../format.js";

describe("category format", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("printCategoryList", () => {
    test("prints empty message when no categories", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      printCategoryList({ items: [], total: 0, page: 1, pageSize: 20 }, false);
      expect(consoleSpy).toHaveBeenCalledWith("No categories found.\n");
    });

    test("prints categories table", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const mockResponse = {
        items: [
          {
            id: "1",
            name: "Programming",
            description: "Programming links",
            icon: "i-code",
            order: 1,
            _count: 5,
            createdAt: 1704067200000,
            updatedAt: 1704067200000,
          },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
      };
      printCategoryList(mockResponse, false);
      expect(consoleSpy.mock.calls.join("")).toContain("Programming");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const mockResponse = {
        items: [
          { id: "1", name: "Test", order: 1, createdAt: 1704067200000, updatedAt: 1704067200000 },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
      };
      printCategoryList(mockResponse, true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.items).toHaveLength(1);
    });
  });

  describe("printCategoryCreated", () => {
    test("prints category created message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const category = { id: "123", name: "New Category" } as any;
      printCategoryCreated(category, false);
      expect(consoleSpy).toHaveBeenCalledWith("Category created: New Category\n");
      expect(consoleSpy).toHaveBeenCalledWith("ID: 123\n");
    });
  });

  describe("printCategoryUpdated", () => {
    test("prints category updated message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const category = { id: "456", name: "Updated Category" } as any;
      printCategoryUpdated(category, false);
      expect(consoleSpy).toHaveBeenCalledWith("Category updated: Updated Category\n");
      expect(consoleSpy).toHaveBeenCalledWith("ID: 456\n");
    });
  });

  describe("printCategoryDeleted", () => {
    test("prints category deleted message", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const result = { deleted: true, deletedLinks: 3, deletedChildren: 1 };
      printCategoryDeleted(result, false);
      expect(consoleSpy).toHaveBeenCalledWith("Category deleted.\n");
      expect(consoleSpy.mock.calls.join("")).toContain("Deleted 3 links");
      expect(consoleSpy.mock.calls.join("")).toContain("Deleted 1 child categories");
    });

    test("outputs JSON when json=true", () => {
      const consoleSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const result = { deleted: true, deletedLinks: 0, deletedChildren: 0 };
      printCategoryDeleted(result, true);
      const output = consoleSpy.mock.calls.join("");
      const parsed = JSON.parse(output);
      expect(parsed.deleted).toBe(true);
    });
  });
});
