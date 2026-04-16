import { printJson } from "../../utils/output.js";

export interface Settings {
  siteTitle: string;
  siteSubtitle: string;
  logoIcon: string;
  logoImage: string;
  favicon: string;
  backgroundImage: string;
  backgroundOverlay: number;
  showShortcutHints: boolean;
  sidebarCollapsed: boolean;
  showEditButton: boolean;
  showSettingsButton: boolean;
}

export function printSettings(settings: Settings, json = false): void {
  if (json) {
    printJson(settings);
    return;
  }

  process.stdout.write("Current Settings:\n\n");
  process.stdout.write(`Site Title: ${settings.siteTitle}\n`);
  process.stdout.write(`Site Subtitle: ${settings.siteSubtitle}\n`);
  process.stdout.write(`Logo Icon: ${settings.logoIcon}\n`);
  process.stdout.write(`Logo Image: ${settings.logoImage || "(not set)"}\n`);
  process.stdout.write(`Favicon: ${settings.favicon || "(not set)"}\n`);
  process.stdout.write(`Background Image: ${settings.backgroundImage || "(not set)"}\n`);
  process.stdout.write(`Background Overlay: ${settings.backgroundOverlay}%\n`);
  process.stdout.write(`Show Shortcut Hints: ${settings.showShortcutHints}\n`);
  process.stdout.write(`Sidebar Collapsed: ${settings.sidebarCollapsed}\n`);
  process.stdout.write(`Show Edit Button: ${settings.showEditButton}\n`);
  process.stdout.write(`Show Settings Button: ${settings.showSettingsButton}\n`);
}

export function printSettingsUpdated(json = false): void {
  if (json) {
    printJson({ success: true });
    return;
  }
  process.stdout.write("Settings updated successfully.\n");
}
