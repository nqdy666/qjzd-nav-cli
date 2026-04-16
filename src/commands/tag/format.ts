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

function getTagListWidths(): number[] {
  const width = resolveTerminalWidth();
  const nameWidth = Math.min(Math.max(15, Math.floor(width * 0.2)), 30);
  return [nameWidth, 12, 10];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  _linkCount?: number;
}

export interface TagListResponse {
  items: Tag[];
  total: number;
  page: number;
  pageSize: number;
}

export function printTagList(response: TagListResponse, json = false): void {
  if (json) {
    printJson(response);
    return;
  }

  if (response.items.length === 0) {
    process.stdout.write("No tags found.\n");
    return;
  }

  const widths = getTagListWidths();
  const rows = response.items.map((tag) => [
    truncateDisplayText(tag.name, widths[0]!),
    tag.color,
    tag._linkCount ? String(tag._linkCount) : "0",
  ]);

  printTable(["NAME", "COLOR", "LINKS"], rows, widths, false);
  process.stdout.write(`\nTotal: ${response.total} tags\n`);
}

export function printTagCreated(tag: Tag, json = false): void {
  if (json) {
    printJson(tag);
    return;
  }

  process.stdout.write(`Tag created: ${tag.name}\n`);
  process.stdout.write(`ID: ${tag.id}\n`);
}

export function printTagUpdated(tag: Tag, json = false): void {
  if (json) {
    printJson(tag);
    return;
  }

  process.stdout.write(`Tag updated: ${tag.name}\n`);
  process.stdout.write(`ID: ${tag.id}\n`);
}

export function printTagDeleted(result: { deleted: boolean }, json = false): void {
  if (json) {
    printJson(result);
    return;
  }

  process.stdout.write("Tag deleted.\n");
}
