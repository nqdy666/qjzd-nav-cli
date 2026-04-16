import cac from "cac";

import packageJson from "../package.json";
import { registerAuthCommands, tryRunAuthCommand } from "./commands/auth/index.js";
import { registerBackupCommands, tryRunBackupCommand } from "./commands/backup/index.js";
import { registerCategoryCommands, tryRunCategoryCommand } from "./commands/category/index.js";
import { registerLinkCommands, tryRunLinkCommand } from "./commands/link/index.js";
import { registerSettingsCommands, tryRunSettingsCommand } from "./commands/settings/index.js";
import { registerTagCommands, tryRunTagCommand } from "./commands/tag/index.js";
import { getCompletionCandidates, renderCompletionScript } from "./utils/completion.js";
import { formatError } from "./utils/errors.js";
import { RuntimeContext } from "./utils/runtime.js";

const cli = cac("qjzd-nav");
const runtime = new RuntimeContext();

const commandModules = [
  {
    register: registerAuthCommands,
    tryRun: tryRunAuthCommand,
  },
  {
    register: registerLinkCommands,
    tryRun: tryRunLinkCommand,
  },
  {
    register: registerCategoryCommands,
    tryRun: tryRunCategoryCommand,
  },
  {
    register: registerTagCommands,
    tryRun: tryRunTagCommand,
  },
  {
    register: registerBackupCommands,
    tryRun: tryRunBackupCommand,
  },
  {
    register: registerSettingsCommands,
    tryRun: tryRunSettingsCommand,
  },
] as const;

for (const commandModule of commandModules) {
  commandModule.register(cli);
}

cli.command("completion <shell>", "Generate shell completion script").action((shell: string) => {
  process.stdout.write(renderCompletionScript(shell));
});

cli.help();
cli.version(packageJson.version);

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    cli.outputHelp();
    return;
  }

  if (args[0] === "__complete") {
    const current = process.env.QJZD_NAV_COMP_CUR ?? "";
    process.stdout.write(`${getCompletionCandidates(args.slice(1), current).join("\n")}\n`);
    return;
  }

  for (const commandModule of commandModules) {
    if (await commandModule.tryRun(args, runtime)) {
      return;
    }
  }

  cli.parse(process.argv, { run: false });
  await cli.runMatchedCommand();
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${formatError(error)}\n`);
  process.exitCode = 1;
}
