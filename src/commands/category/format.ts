import Table from "cli-table3";
import stringWidth from "string-width";

import { printJson } from "../../utils/output.js";

function resolveTerminalWidth(): number {
  return process.stdout.columns && process.stdout.columns > 0 ? process.stdout.columns : 120;
}

function normalizeCell(value: string | undefined): string {
  return value ?? "";
}

function printTable(
  headers: string[],
  rows: Array<Array<string>>,
  colWidths?: number[],
  truncate = true,
): void {
  const table = new Table({
    head: headers,
    colWidths,
    truncate: truncate ? "..." : undefined,
    colAligns: headers.map(() => "left"),
    style: {
      compact: true,
      head: [],
      border: [],
      "padding-left": 0,
      "padding-right": 0,
    },
    wordWrap: false,
    chars: {
      top: "",
      "top-mid": "",
      "top-left": "",
      "top-right": "",
      bottom: "",
      "bottom-mid": "",
      "bottom-left": "",
      "bottom-right": "",
      left: "",
      "left-mid": "",
      mid: "",
      "mid-mid": "",
      right: "",
      "right-mid": "",
      middle: "  ",
    },
  });

  for (const row of rows) {
    table.push(row.map(normalizeCell));
  }

  process.stdout.write(`${table.toString()}\n`);
}

function truncateDisplayText(value: string, maxWidth: number): string {
  if (maxWidth <= 0) {
    return "";
  }

  if (stringWidth(value) <= maxWidth) {
    return value;
  }

  if (maxWidth <= 3) {
    return ".".repeat(maxWidth);
  }

  let result = "";
  let width = 0;
  for (const character of value) {
    const nextWidth = stringWidth(character);
    if (width + nextWidth > maxWidth - 3) {
      break;
    }

    result += character;
    width += nextWidth;
  }

  return `${result}...`;
}

function getCategoryListWidths(): number[] {
  const width = resolveTerminalWidth();
  const nameWidth = Math.min(Math.max(20, Math.floor(width * 0.3)), 45);
  return [4, nameWidth, 30, 8];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  parentId?: string | null;
  createdAt: number;
  updatedAt: number;
  _count?: number;
}

export interface CategoryListResponse {
  items: Category[];
  total: number;
  page: number;
  pageSize: number;
}

export function printCategoryList(response: CategoryListResponse, json = false): void {
  if (json) {
    printJson(response);
    return;
  }

  if (response.items.length === 0) {
    process.stdout.write("No categories found.\n");
    return;
  }

  const widths = getCategoryListWidths();
  const rows = response.items.map((cat) => [
    String(cat.order),
    truncateDisplayText(cat.name, widths[1]!),
    truncateDisplayText(cat.description || "", widths[2]!),
    cat._count ? String(cat._count) : "0",
  ]);

  printTable(["#", "NAME", "DESCRIPTION", "LINKS"], rows, widths, false);
  process.stdout.write(`\nTotal: ${response.total} categories\n`);
}

export function printCategoryCreated(category: Category, json = false): void {
  if (json) {
    printJson(category);
    return;
  }

  process.stdout.write(`Category created: ${category.name}\n`);
  process.stdout.write(`ID: ${category.id}\n`);
}

export function printCategoryUpdated(category: Category, json = false): void {
  if (json) {
    printJson(category);
    return;
  }

  process.stdout.write(`Category updated: ${category.name}\n`);
  process.stdout.write(`ID: ${category.id}\n`);
}

export function printCategoryDeleted(
  result: { deleted: boolean; deletedLinks: number; deletedChildren: number },
  json = false,
): void {
  if (json) {
    printJson(result);
    return;
  }

  process.stdout.write(`Category deleted.\n`);
  if (result.deletedLinks > 0) {
    process.stdout.write(`Deleted ${result.deletedLinks} links.\n`);
  }
  if (result.deletedChildren > 0) {
    process.stdout.write(`Deleted ${result.deletedChildren} child categories.\n`);
  }
}
