import { readFile } from "node:fs/promises";

import cac, { type CAC } from "cac";

import { tryRunCommandCliRoute } from "../../utils/command-router.js";
import { CliError } from "../../utils/errors.js";
import { RuntimeContext } from "../../utils/runtime.js";
import { printSettings, type Settings } from "./format.js";
import { printSettingsUpdated } from "./format.js";

interface SettingsGetOptions {
  json?: boolean;
}

interface SettingsUpdateOptions {
  siteTitle?: string;
  siteSubtitle?: string;
  logoIcon?: string;
  logoImage?: string;
  favicon?: string;
  backgroundImage?: string;
  backgroundOverlay?: number;
  showShortcutHints?: boolean;
  sidebarCollapsed?: boolean;
  showEditButton?: boolean;
  showSettingsButton?: boolean;
  json?: boolean;
}

interface SettingsUploadOptions {
  type?: "background" | "logo" | "favicon";
  file?: string;
  json?: boolean;
}

function buildSettingsCli(runtime: RuntimeContext): CAC {
  const settingsCli = cac("qjzd-nav settings");

  settingsCli
    .command("get", "Get current settings")
    .option("--json", "Output JSON")
    .action(async (options: SettingsGetOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);
      const response = await clients.axios.get<Settings>("/api/settings");
      printSettings(response.data, options.json);
    });

  settingsCli
    .command("update", "Update settings")
    .option("--site-title <title>", "Site title")
    .option("--site-subtitle <subtitle>", "Site subtitle")
    .option("--logo-icon <icon>", "Logo icon (icon class)")
    .option("--logo-image <url>", "Logo image URL")
    .option("--favicon <url>", "Favicon URL")
    .option("--background-image <url>", "Background image URL")
    .option("--background-overlay <number>", "Background overlay (0-100)")
    .option("--show-shortcut-hints", "Show shortcut hints (true/false)")
    .option("--no-show-shortcut-hints", "Hide shortcut hints")
    .option("--sidebar-collapsed", "Collapse sidebar by default")
    .option("--no-sidebar-collapsed", "Expand sidebar by default")
    .option("--show-edit-button", "Show edit button (true/false)")
    .option("--no-show-edit-button", "Hide edit button")
    .option("--show-settings-button", "Show settings button (true/false)")
    .option("--no-show-settings-button", "Hide settings button")
    .option("--json", "Output JSON")
    .action(async (options: SettingsUpdateOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      const data: Record<string, unknown> = {};

      if (options.siteTitle !== undefined) data.siteTitle = options.siteTitle;
      if (options.siteSubtitle !== undefined) data.siteSubtitle = options.siteSubtitle;
      if (options.logoIcon !== undefined) data.logoIcon = options.logoIcon;
      if (options.logoImage !== undefined) data.logoImage = options.logoImage;
      if (options.favicon !== undefined) data.favicon = options.favicon;
      if (options.backgroundImage !== undefined) data.backgroundImage = options.backgroundImage;
      if (options.backgroundOverlay !== undefined)
        data.backgroundOverlay = parseInt(options.backgroundOverlay as unknown as string, 10);
      if (options.showShortcutHints !== undefined)
        data.showShortcutHints = options.showShortcutHints;
      if (options.sidebarCollapsed !== undefined) data.sidebarCollapsed = options.sidebarCollapsed;
      if (options.showEditButton !== undefined) data.showEditButton = options.showEditButton;
      if (options.showSettingsButton !== undefined)
        data.showSettingsButton = options.showSettingsButton;

      await clients.axios.put("/api/settings", data);
      printSettingsUpdated(options.json);
    });

  settingsCli
    .command("upload", "Upload a file (background, logo, or favicon)")
    .option("--type <type>", "Upload type: background, logo, or favicon")
    .option("--file <path>", "Local file path to upload")
    .option("--json", "Output JSON")
    .action(async (options: SettingsUploadOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      if (!options.type) {
        throw new CliError(" --type is required (background, logo, or favicon)");
      }

      if (!options.file) {
        throw new CliError(" --file is required");
      }

      const validTypes = ["background", "logo", "favicon"];
      if (!validTypes.includes(options.type)) {
        throw new CliError(` --type must be one of: ${validTypes.join(", ")}`);
      }

      // Read the file
      const fileBuffer = await readFile(options.file);

      // Create multipart form data
      const boundary = `----FormBoundary${Date.now()}`;
      const filename = options.file.split(/[/\\]/).pop() || "file";

      // Determine content type based on file extension
      let contentType = "application/octet-stream";
      if (filename.endsWith(".png")) contentType = "image/png";
      else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) contentType = "image/jpeg";
      else if (filename.endsWith(".webp")) contentType = "image/webp";
      else if (filename.endsWith(".svg")) contentType = "image/svg+xml";
      else if (filename.endsWith(".ico")) contentType = "image/x-icon";

      const formDataBuffer = Buffer.concat([
        Buffer.from(`--${boundary}\r\n`),
        Buffer.from(`Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`),
        Buffer.from(`Content-Type: ${contentType}\r\n\r\n`),
        fileBuffer,
        Buffer.from(`\r\n--${boundary}--\r\n`),
      ]);

      // Upload the file
      const uploadResponse = await clients.axios.post(
        `/api/uploads/${options.type}`,
        formDataBuffer,
        {
          headers: {
            "Content-Type": `multipart/form-data; boundary=${boundary}`,
          },
        },
      );

      const uploadedPath = uploadResponse.data.path;

      // Update settings with the uploaded path
      const updateData: Record<string, unknown> = {};
      if (options.type === "background") {
        updateData.backgroundImage = uploadedPath;
        updateData.backgroundOverlay = 20; // Default overlay for background
      } else if (options.type === "logo") {
        updateData.logoImage = uploadedPath;
      } else if (options.type === "favicon") {
        updateData.favicon = uploadedPath;
      }

      await clients.axios.put("/api/settings", updateData);

      if (options.json) {
        process.stdout.write(JSON.stringify({ success: true, path: uploadedPath }, null, 2) + "\n");
      } else {
        process.stdout.write(`File uploaded and set as ${options.type}: ${uploadedPath}\n`);
      }
    });

  settingsCli.usage("<command> [flags]");
  settingsCli.example((bin) => `${bin} get`);
  settingsCli.example((bin) => `${bin} get --json`);
  settingsCli.example((bin) => `${bin} update --site-title "My Nav" --site-subtitle "Links"`);
  settingsCli.example((bin) => `${bin} update --logo-icon "i-lucide-star" --background-overlay 50`);
  settingsCli.help();

  return settingsCli;
}

export async function tryRunSettingsCommand(
  args: string[],
  runtime: RuntimeContext,
): Promise<boolean> {
  if (args[0] !== "settings") {
    return false;
  }

  return tryRunCommandCliRoute({
    command: "settings",
    cliName: "qjzd-nav settings",
    args,
    buildCli: () => buildSettingsCli(runtime),
  });
}

export function registerSettingsCommands(cli: CAC): void {
  cli.command("settings", "Settings management commands");
}
