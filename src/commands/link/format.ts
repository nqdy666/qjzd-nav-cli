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

function getLinkListWidths(): number[] {
  const width = resolveTerminalWidth();
  const titleWidth = Math.min(Math.max(20, Math.floor(width * 0.25)), 40);
  const urlWidth = Math.min(Math.max(30, Math.floor(width * 0.35)), 50);
  return [4, titleWidth, urlWidth, 8, 8];
}

export interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  categoryId: string;
  tags: string[];
  order: number;
  clicks: number;
  createdAt: number;
  updatedAt: number;
}

export interface LinkListResponse {
  items: Link[];
  total: number;
  page: number;
  pageSize: number;
}

export function printLinkList(response: LinkListResponse, json = false): void {
  if (json) {
    printJson(response);
    return;
  }

  if (response.items.length === 0) {
    process.stdout.write("No links found.\n");
    return;
  }

  const widths = getLinkListWidths();
  const rows = response.items.map((link) => [
    String(link.order),
    truncateDisplayText(link.title, widths[1]!),
    truncateDisplayText(link.url, widths[2]!),
    String(link.clicks),
    link.tags.length > 0 ? link.tags.join(", ") : "",
  ]);

  printTable(["#", "TITLE", "URL", "CLICKS", "TAGS"], rows, widths, false);
  process.stdout.write(`\nTotal: ${response.total} links\n`);
}

export function printLinkCreated(link: Link, json = false): void {
  if (json) {
    printJson(link);
    return;
  }

  process.stdout.write(`Link created: ${link.title}\n`);
  process.stdout.write(`ID: ${link.id}\n`);
}

export function printLinkUpdated(link: Link, json = false): void {
  if (json) {
    printJson(link);
    return;
  }

  process.stdout.write(`Link updated: ${link.title}\n`);
  process.stdout.write(`ID: ${link.id}\n`);
}

export function printLinkDeleted(id: string, json = false): void {
  if (json) {
    printJson({ deleted: true, id });
    return;
  }

  process.stdout.write(`Link deleted: ${id}\n`);
}
