import cac, { type CAC } from "cac";

import { tryRunCommandCliRoute } from "../../utils/command-router.js";
import { CliError } from "../../utils/errors.js";
import { RuntimeContext } from "../../utils/runtime.js";
import { printLinkList, type LinkListResponse } from "./format.js";
import { printLinkCreated } from "./format.js";
import { printLinkUpdated } from "./format.js";
import { printLinkDeleted } from "./format.js";

interface LinkListOptions {
  categoryId?: string;
  tagIds?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
  json?: boolean;
}

interface LinkCreateOptions {
  title?: string;
  url?: string;
  description?: string;
  icon?: string;
  categoryId?: string;
  tags?: string;
  order?: string;
  json?: boolean;
}

interface LinkUpdateOptions {
  id?: string;
  title?: string;
  url?: string;
  description?: string;
  icon?: string;
  categoryId?: string;
  tags?: string;
  order?: string;
  json?: boolean;
}

interface LinkDeleteOptions {
  id?: string;
  json?: boolean;
}

function buildLinkCli(runtime: RuntimeContext): CAC {
  const linkCli = cac("qjzd-nav link");

  linkCli
    .command("list", "List all links")
    .option("--category-id <id>", "Filter by category ID")
    .option("--tag-ids <ids>", "Filter by tag IDs (comma-separated)")
    .option("--keyword <keyword>", "Search keyword")
    .option("--page <page>", "Page number")
    .option("--page-size <size>", "Page size")
    .option("--json", "Output JSON")
    .action(async (options: LinkListOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      const params: Record<string, unknown> = {};
      if (options.categoryId) params.categoryId = options.categoryId;
      if (options.tagIds) params.tagIds = options.tagIds;
      if (options.keyword) params.keyword = options.keyword;
      if (options.page) params.page = options.page;
      if (options.pageSize) params.pageSize = options.pageSize;

      const response = await clients.axios.get<LinkListResponse>("/api/links", { params });
      printLinkList(response.data, options.json);
    });

  linkCli
    .command("create", "Create a new link")
    .option("--title <title>", "Link title")
    .option("--url <url>", "Link URL")
    .option("--category-id <id>", "Category ID")
    .option("--description <desc>", "Link description")
    .option("--icon <icon>", "Link icon")
    .option("--tags <tags>", "Tag IDs (comma-separated)")
    .option("--order <order>", "Display order")
    .option("--json", "Output JSON")
    .action(async (options: LinkCreateOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      if (!options.title || !options.url || !options.categoryId) {
        throw new CliError(" --title, --url, and --category-id are required");
      }

      const data: Record<string, unknown> = {
        title: options.title,
        url: options.url,
        categoryId: options.categoryId,
      };

      if (options.description) data.description = options.description;
      if (options.icon) data.icon = options.icon;
      if (options.tags) data.tags = options.tags.split(",").map((t: string) => t.trim());
      if (options.order) data.order = parseInt(options.order, 10);

      const response = await clients.axios.post("/api/links", data);
      const responseData = response.data;
      if (responseData.success !== false && responseData.data) {
        printLinkCreated(responseData.data, options.json);
      } else {
        printLinkCreated(responseData, options.json);
      }
    });

  linkCli
    .command("update", "Update a link")
    .option("--id <id>", "Link ID")
    .option("--title <title>", "Link title")
    .option("--url <url>", "Link URL")
    .option("--category-id <id>", "Category ID")
    .option("--description <desc>", "Link description")
    .option("--icon <icon>", "Link icon")
    .option("--tags <tags>", "Tag IDs (comma-separated)")
    .option("--order <order>", "Display order")
    .option("--json", "Output JSON")
    .action(async (options: LinkUpdateOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      if (!options.id) {
        throw new CliError(" --id is required");
      }

      const data: Record<string, unknown> = {};
      if (options.title) data.title = options.title;
      if (options.url) data.url = options.url;
      if (options.categoryId) data.categoryId = options.categoryId;
      if (options.description !== undefined) data.description = options.description;
      if (options.icon !== undefined) data.icon = options.icon;
      if (options.tags) data.tags = options.tags.split(",").map((t: string) => t.trim());
      if (options.order !== undefined) data.order = parseInt(options.order, 10);

      const response = await clients.axios.put(`/api/links/${options.id}`, data);
      const responseData = response.data;
      if (responseData.success !== false && responseData.data) {
        printLinkUpdated(responseData.data, options.json);
      } else {
        printLinkUpdated(responseData, options.json);
      }
    });

  linkCli
    .command("delete", "Delete a link")
    .option("--id <id>", "Link ID")
    .option("--json", "Output JSON")
    .action(async (options: LinkDeleteOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      if (!options.id) {
        throw new CliError(" --id is required");
      }

      await clients.axios.delete(`/api/links/${options.id}`);
      printLinkDeleted(options.id, options.json);
    });

  linkCli.usage("<command> [flags]");
  linkCli.example((bin) => `${bin} list`);
  linkCli.example((bin) => `${bin} list --category-id <id>`);
  linkCli.example(
    (bin) => `${bin} create --title "Google" --url "https://google.com" --category-id <id>`,
  );
  linkCli.example((bin) => `${bin} update --id <id> --title "New Title"`);
  linkCli.example((bin) => `${bin} delete --id <id>`);
  linkCli.help();

  return linkCli;
}

export async function tryRunLinkCommand(args: string[], runtime: RuntimeContext): Promise<boolean> {
  if (args[0] !== "link") {
    return false;
  }

  return tryRunCommandCliRoute({
    command: "link",
    cliName: "qjzd-nav link",
    args,
    buildCli: () => buildLinkCli(runtime),
  });
}

export function registerLinkCommands(cli: CAC): void {
  cli.command("link", "Link management commands");
}
