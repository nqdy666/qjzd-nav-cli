import cac, { type CAC } from "cac";

import { tryRunCommandCliRoute } from "../../utils/command-router.js";
import { CliError } from "../../utils/errors.js";
import { printJson } from "../../utils/output.js";
import { RuntimeContext } from "../../utils/runtime.js";
import { printCategoryList, type CategoryListResponse } from "./format.js";
import { printCategoryCreated } from "./format.js";
import { printCategoryUpdated } from "./format.js";
import { printCategoryDeleted } from "./format.js";

interface CategoryListOptions {
  keyword?: string;
  page?: number;
  pageSize?: number;
  json?: boolean;
}

interface CategoryCreateOptions {
  name?: string;
  description?: string;
  icon?: string;
  order?: string;
  parentId?: string;
  json?: boolean;
}

interface CategoryUpdateOptions {
  id?: string;
  name?: string;
  description?: string;
  icon?: string;
  order?: string;
  parentId?: string;
  json?: boolean;
}

interface CategoryDeleteOptions {
  id?: string;
  mode?: string;
  subAction?: string;
  json?: boolean;
}

function buildCategoryCli(runtime: RuntimeContext): CAC {
  const categoryCli = cac("qjzd-nav category");

  categoryCli
    .command("list", "List all categories")
    .option("--keyword <keyword>", "Search keyword")
    .option("--page <page>", "Page number")
    .option("--page-size <size>", "Page size")
    .option("--json", "Output JSON")
    .action(async (options: CategoryListOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      const params: Record<string, unknown> = {};
      if (options.keyword) params.keyword = options.keyword;
      if (options.page) params.page = options.page;
      if (options.pageSize) params.pageSize = options.pageSize;

      const response = await clients.axios.get<CategoryListResponse>("/api/categories", { params });
      printCategoryList(response.data, options.json);
    });

  categoryCli
    .command("create", "Create a new category")
    .option("--name <name>", "Category name")
    .option("--description <desc>", "Category description")
    .option("--icon <icon>", "Category icon")
    .option("--order <order>", "Display order")
    .option("--parent-id <id>", "Parent category ID")
    .option("--json", "Output JSON")
    .action(async (options: CategoryCreateOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      if (!options.name) {
        throw new CliError(" --name is required");
      }

      const data: Record<string, unknown> = {
        name: options.name,
      };

      if (options.description) data.description = options.description;
      if (options.icon) data.icon = options.icon;
      if (options.order) data.order = parseInt(options.order, 10);
      if (options.parentId) data.parentId = options.parentId;

      const response = await clients.axios.post("/api/categories", data);
      const responseData = response.data;
      if (responseData.success !== false && responseData.data) {
        printCategoryCreated(responseData.data, options.json);
      } else {
        printCategoryCreated(responseData, options.json);
      }
    });

  categoryCli
    .command("update", "Update a category")
    .option("--id <id>", "Category ID")
    .option("--name <name>", "Category name")
    .option("--description <desc>", "Category description")
    .option("--icon <icon>", "Category icon")
    .option("--order <order>", "Display order")
    .option("--parent-id <id>", "Parent category ID (use empty to clear)")
    .option("--json", "Output JSON")
    .action(async (options: CategoryUpdateOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      if (!options.id) {
        throw new CliError(" --id is required");
      }

      const data: Record<string, unknown> = {};
      if (options.name) data.name = options.name;
      if (options.description !== undefined) data.description = options.description;
      if (options.icon !== undefined) data.icon = options.icon;
      if (options.order !== undefined) data.order = parseInt(options.order, 10);
      if (options.parentId !== undefined) data.parentId = options.parentId || null;

      const response = await clients.axios.put(`/api/categories/${options.id}`, data);
      const responseData = response.data;
      if (responseData.success !== false && responseData.data) {
        printCategoryUpdated(responseData.data, options.json);
      } else {
        printCategoryUpdated(responseData, options.json);
      }
    });

  categoryCli
    .command("delete", "Delete a category")
    .option("--id <id>", "Category ID")
    .option("--mode <mode>", "Delete mode: only")
    .option("--sub-action <action>", "Sub action when mode=only: promote or delete")
    .option("--json", "Output JSON")
    .action(async (options: CategoryDeleteOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      if (!options.id) {
        throw new CliError(" --id is required");
      }

      const params: Record<string, unknown> = {};
      if (options.mode) params.mode = options.mode;
      if (options.subAction) params.subAction = options.subAction;

      const response = await clients.axios.delete(`/api/categories/${options.id}`, { params });
      const responseData = response.data;
      if (responseData.success !== false && responseData.data) {
        printCategoryDeleted(responseData.data, options.json);
      } else {
        printCategoryDeleted(responseData, options.json);
      }
    });

  categoryCli
    .command("reorder", "Reorder categories")
    .option("--items <items>", 'Items as JSON array: [{"id":"xxx","order":1}]')
    .option("--json", "Output JSON")
    .action(async (options: { items?: string; json?: boolean }) => {
      const { clients } = await runtime.getClientsForOptions(options);

      if (!options.items) {
        throw new CliError(" --items is required");
      }

      let items: { id: string; order: number }[];
      try {
        items = JSON.parse(options.items);
      } catch {
        throw new CliError(" --items must be a valid JSON array");
      }

      await clients.axios.put("/api/categories/reorder", items);
      if (options.json) {
        printJson({ success: true });
      } else {
        process.stdout.write("Categories reordered.\n");
      }
    });

  categoryCli.usage("<command> [flags]");
  categoryCli.example((bin) => `${bin} list`);
  categoryCli.example((bin) => `${bin} create --name "Programming" --icon "i-code"`);
  categoryCli.example((bin) => `${bin} update --id <id> --name "New Name"`);
  categoryCli.example((bin) => `${bin} delete --id <id>`);
  categoryCli.example((bin) => `${bin} reorder --items '[{"id":"xxx","order":1}]'`);
  categoryCli.help();

  return categoryCli;
}

export async function tryRunCategoryCommand(
  args: string[],
  runtime: RuntimeContext,
): Promise<boolean> {
  if (args[0] !== "category") {
    return false;
  }

  return tryRunCommandCliRoute({
    command: "category",
    cliName: "qjzd-nav category",
    args,
    buildCli: () => buildCategoryCli(runtime),
  });
}

export function registerCategoryCommands(cli: CAC): void {
  cli.command("category", "Category management commands");
}
