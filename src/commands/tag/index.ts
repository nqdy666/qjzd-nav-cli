import cac, { type CAC } from "cac";

import { tryRunCommandCliRoute } from "../../utils/command-router.js";
import { CliError } from "../../utils/errors.js";
import { RuntimeContext } from "../../utils/runtime.js";
import { printTagList, type TagListResponse } from "./format.js";
import { printTagCreated } from "./format.js";
import { printTagUpdated } from "./format.js";
import { printTagDeleted } from "./format.js";

interface TagListOptions {
  keyword?: string;
  page?: number;
  pageSize?: number;
  json?: boolean;
}

interface TagCreateOptions {
  name?: string;
  color?: string;
  json?: boolean;
}

interface TagUpdateOptions {
  id?: string;
  name?: string;
  color?: string;
  json?: boolean;
}

interface TagDeleteOptions {
  id?: string;
  json?: boolean;
}

function buildTagCli(runtime: RuntimeContext): CAC {
  const tagCli = cac("qjzd-nav tag");

  tagCli
    .command("list", "List all tags")
    .option("--keyword <keyword>", "Search keyword")
    .option("--page <page>", "Page number")
    .option("--page-size <size>", "Page size")
    .option("--json", "Output JSON")
    .action(async (options: TagListOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      const params: Record<string, unknown> = {};
      if (options.keyword) params.keyword = options.keyword;
      if (options.page) params.page = options.page;
      if (options.pageSize) params.pageSize = options.pageSize;

      const response = await clients.axios.get<TagListResponse>("/api/tags", { params });
      printTagList(response.data, options.json);
    });

  tagCli
    .command("create", "Create a new tag")
    .option("--name <name>", "Tag name")
    .option("--color <color>", "Tag color (hex)")
    .option("--json", "Output JSON")
    .action(async (options: TagCreateOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      if (!options.name) {
        throw new CliError(" --name is required");
      }

      const data: Record<string, unknown> = {
        name: options.name,
      };

      if (options.color) data.color = options.color;

      const response = await clients.axios.post("/api/tags", data);
      const responseData = response.data;
      if (responseData.success !== false && responseData.data) {
        printTagCreated(responseData.data, options.json);
      } else {
        printTagCreated(responseData, options.json);
      }
    });

  tagCli
    .command("update", "Update a tag")
    .option("--id <id>", "Tag ID")
    .option("--name <name>", "Tag name")
    .option("--color <color>", "Tag color (hex)")
    .option("--json", "Output JSON")
    .action(async (options: TagUpdateOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      if (!options.id) {
        throw new CliError(" --id is required");
      }

      const data: Record<string, unknown> = {};
      if (options.name) data.name = options.name;
      if (options.color) data.color = options.color;

      const response = await clients.axios.put(`/api/tags/${options.id}`, data);
      const responseData = response.data;
      if (responseData.success !== false && responseData.data) {
        printTagUpdated(responseData.data, options.json);
      } else {
        printTagUpdated(responseData, options.json);
      }
    });

  tagCli
    .command("delete", "Delete a tag")
    .option("--id <id>", "Tag ID")
    .option("--json", "Output JSON")
    .action(async (options: TagDeleteOptions) => {
      const { clients } = await runtime.getClientsForOptions(options);

      if (!options.id) {
        throw new CliError(" --id is required");
      }

      const response = await clients.axios.delete(`/api/tags/${options.id}`);
      const responseData = response.data;
      if (responseData.success !== false && responseData.data) {
        printTagDeleted(responseData.data, options.json);
      } else {
        printTagDeleted(responseData, options.json);
      }
    });

  tagCli.usage("<command> [flags]");
  tagCli.example((bin) => `${bin} list`);
  tagCli.example((bin) => `${bin} create --name "JavaScript" --color "#F7DF1E"`);
  tagCli.example((bin) => `${bin} update --id <id> --color "#FF5733"`);
  tagCli.example((bin) => `${bin} delete --id <id>`);
  tagCli.help();

  return tagCli;
}

export async function tryRunTagCommand(args: string[], runtime: RuntimeContext): Promise<boolean> {
  if (args[0] !== "tag") {
    return false;
  }

  return tryRunCommandCliRoute({
    command: "tag",
    cliName: "qjzd-nav tag",
    args,
    buildCli: () => buildTagCli(runtime),
  });
}

export function registerTagCommands(cli: CAC): void {
  cli.command("tag", "Tag management commands");
}
