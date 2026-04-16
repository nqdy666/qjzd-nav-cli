import { printJson } from "../../utils/output.js";

export interface BackupItem {
  filename: string;
  size: number;
  createdAt: number;
  type: "json" | "zip";
}

export function printBackupList(items: BackupItem[], json = false): void {
  if (json) {
    printJson(items);
    return;
  }

  if (items.length === 0) {
    process.stdout.write("No backups found.\n");
    return;
  }

  for (const backup of items) {
    const date = new Date(backup.createdAt).toLocaleString("zh-CN");
    const size = formatSize(backup.size);
    process.stdout.write(`${backup.type === "zip" ? "[ZIP]" : "[JSON]"} ${backup.filename}\n`);
    process.stdout.write(`  Size: ${size}, Created: ${date}\n\n`);
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function printBackupCreated(filename: string, json = false): void {
  if (json) {
    printJson({ success: true, filename });
    return;
  }
  process.stdout.write(`Backup created: ${filename}\n`);
}

export function printBackupDeleted(filename: string, json = false): void {
  if (json) {
    printJson({ success: true, filename });
    return;
  }
  process.stdout.write(`Backup deleted: ${filename}\n`);
}
