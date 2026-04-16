import { writeFile } from "node:fs/promises";

import cac, { type CAC } from "cac";

import { tryRunCommandCliRoute } from "../../utils/command-router.js";
import { CliError } from "../../utils/errors.js";
import { RuntimeContext } from "../../utils/runtime.js";
import { printBackupList, type BackupItem } from "./format.js";
import { printBackupDeleted } from "./format.js";

interface BackupListOptions {
  json?: boolean;
}

function buildBackupCli(runtime: RuntimeContext): CAC {
  const backupCli = cac("qjzd-nav backup");

  backupCli
    .command("list", "List all backups")
    .option("--json", "Output JSON")
    .action(async (options: BackupListOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);
      const response = await clients.axios.get<BackupItem[]>("/api/backup/list");
      printBackupList(response.data, options.json);
    });

  backupCli
    .command("export", "Export backup as JSON")
    .option("--output <file>", "Output file path")
    .option("--json", "Output JSON")
    .action(async (options: { output?: string; json?: boolean }) => {
      const { clients } = await runtime.getClientsForOptions(options);
      const response = await clients.axios.get<{ filename: string; data: any }>(
        "/api/backup/export",
      );

      if (options.output) {
        await writeFile(options.output, JSON.stringify(response.data.data, null, 2), "utf8");
        if (options.json) {
          printJson({ success: true, filename: options.output });
        } else {
          process.stdout.write(`Backup exported to: ${options.output}\n`);
        }
      } else {
        if (options.json) {
          printJson(response.data);
        } else {
          process.stdout.write(JSON.stringify(response.data.data, null, 2) + "\n");
        }
      }
    });

  backupCli
    .command("export-zip", "Export backup as ZIP (includes assets)")
    .option("--output <file>", "Output file path")
    .option("--json", "Output JSON")
    .action(async (options: { output?: string; json?: boolean }) => {
      const { clients } = await runtime.getClientsForOptions(options);

      const response = await clients.axios.get("/api/backup/export-zip", {
        responseType: "arraybuffer",
      });

      // Get filename from Content-Disposition header or generate one
      let filename = `qjzd-nav-backup-${new Date().toISOString().slice(0, 10)}.zip`;
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      const outputPath = options.output || filename;
      await writeFile(outputPath, Buffer.from(response.data), "binary");

      if (options.json) {
        printJson({ success: true, filename: outputPath });
      } else {
        process.stdout.write(`ZIP backup exported to: ${outputPath}\n`);
      }
    });

  backupCli
    .command("download", "Download a backup file")
    .option("--filename <filename>", "Backup filename")
    .option("--output <file>", "Output file path")
    .option("--json", "Output JSON")
    .action(async (options: { filename?: string; output?: string; json?: boolean }) => {
      if (!options.filename) {
        throw new CliError(" --filename is required");
      }

      const { clients } = await runtime.getClientsForOptions(options);
      const encodedFilename = encodeURIComponent(options.filename);
      const response = await clients.axios.get(`/api/backup/download?file=${encodedFilename}`, {
        responseType: "arraybuffer",
      });

      const outputPath = options.output || options.filename;
      await writeFile(outputPath, Buffer.from(response.data), "binary");

      if (options.json) {
        printJson({ success: true, filename: outputPath });
      } else {
        process.stdout.write(`Backup downloaded to: ${outputPath}\n`);
      }
    });

  backupCli
    .command("delete", "Delete a backup")
    .option("--filename <filename>", "Backup filename")
    .option("--json", "Output JSON")
    .action(async (options: { filename?: string; json?: boolean }) => {
      if (!options.filename) {
        throw new CliError(" --filename is required");
      }

      const { clients } = await runtime.getClientsForOptions(options);
      const encodedFilename = encodeURIComponent(options.filename);
      await clients.axios.delete(`/api/backup/${encodedFilename}`);
      printBackupDeleted(options.filename, options.json);
    });

  backupCli
    .command("import", "Import a backup file (JSON only)")
    .option("--file <path>", "Backup file path (JSON)")
    .option("--json", "Output JSON")
    .action(async (options: { file?: string; json?: boolean }) => {
      if (!options.file) {
        throw new CliError(" --file is required");
      }

      const { clients } = await runtime.getClientsForOptions(options);
      const fs = await import("node:fs/promises");
      const fileContent = await fs.readFile(options.file);
      const data = JSON.parse(fileContent.toString("utf8"));

      const result = await clients.axios.post("/api/backup/import", data);

      if (options.json) {
        printJson(result.data || result);
      } else {
        if (result.data) {
          process.stdout.write(
            `Import successful: ${result.data.categories} categories, ${result.data.links} links, ${result.data.tags} tags\n`,
          );
        } else {
          process.stdout.write("Import successful\n");
        }
      }
    });

  backupCli.usage("<command> [flags]");
  backupCli.example((bin) => `${bin} list`);
  backupCli.example((bin) => `${bin} export --output backup.json`);
  backupCli.example((bin) => `${bin} export-zip --output backup.zip`);
  backupCli.example(
    (bin) =>
      `${bin} download --filename "qjzd-nav-backup-2024-01-01.json" --output local-backup.json`,
  );
  backupCli.example((bin) => `${bin} delete --filename "qjzd-nav-backup-2024-01-01.json"`);
  backupCli.example((bin) => `${bin} import --file backup.json`);
  backupCli.help();

  return backupCli;
}

function printJson(data: any): void {
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

export async function tryRunBackupCommand(
  args: string[],
  runtime: RuntimeContext,
): Promise<boolean> {
  if (args[0] !== "backup") {
    return false;
  }

  return tryRunCommandCliRoute({
    command: "backup",
    cliName: "qjzd-nav backup",
    args,
    buildCli: () => buildBackupCli(runtime),
  });
}

export function registerBackupCommands(cli: CAC): void {
  cli.command("backup", "Backup management commands");
}
