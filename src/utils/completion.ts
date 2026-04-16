import { CliError } from "./errors.js";

interface CompletionNode {
  flags?: string[];
  subcommands?: Record<string, CompletionNode>;
}

const HELP_FLAGS = ["-h", "--help"];
const ROOT_FLAGS = [...HELP_FLAGS, "-v", "--version"];

const COMPLETION_TREE: CompletionNode = {
  flags: ROOT_FLAGS,
  subcommands: {
    auth: {
      flags: HELP_FLAGS,
      subcommands: {
        login: {
          flags: ["--profile", "--url", "--password", "--token-expiry", "--json", ...HELP_FLAGS],
        },
        current: {
          flags: ["--profile", "--json", ...HELP_FLAGS],
        },
        profile: {
          flags: HELP_FLAGS,
          subcommands: {
            list: {
              flags: ["--json", ...HELP_FLAGS],
            },
            current: {
              flags: ["--json", ...HELP_FLAGS],
            },
            get: {
              flags: ["--profile", "--json", ...HELP_FLAGS],
            },
            use: {
              flags: ["--profile", "--json", ...HELP_FLAGS],
            },
            delete: {
              flags: ["--profile", "--json", "--force", ...HELP_FLAGS],
            },
            doctor: {
              flags: ["--json", ...HELP_FLAGS],
            },
          },
        },
      },
    },
    link: {
      flags: HELP_FLAGS,
      subcommands: {
        list: {
          flags: [
            "--category-id",
            "--tag-ids",
            "--keyword",
            "--page",
            "--page-size",
            "--json",
            ...HELP_FLAGS,
          ],
        },
        create: {
          flags: [
            "--title",
            "--url",
            "--category-id",
            "--description",
            "--icon",
            "--tags",
            "--order",
            "--json",
            ...HELP_FLAGS,
          ],
        },
        update: {
          flags: [
            "--id",
            "--title",
            "--url",
            "--category-id",
            "--description",
            "--icon",
            "--tags",
            "--order",
            "--json",
            ...HELP_FLAGS,
          ],
        },
        delete: {
          flags: ["--id", "--json", ...HELP_FLAGS],
        },
      },
    },
    category: {
      flags: HELP_FLAGS,
      subcommands: {
        list: {
          flags: ["--keyword", "--page", "--page-size", "--json", ...HELP_FLAGS],
        },
        create: {
          flags: [
            "--name",
            "--description",
            "--icon",
            "--order",
            "--parent-id",
            "--json",
            ...HELP_FLAGS,
          ],
        },
        update: {
          flags: [
            "--id",
            "--name",
            "--description",
            "--icon",
            "--order",
            "--parent-id",
            "--json",
            ...HELP_FLAGS,
          ],
        },
        delete: {
          flags: ["--id", "--mode", "--sub-action", "--json", ...HELP_FLAGS],
        },
        reorder: {
          flags: ["--items", "--json", ...HELP_FLAGS],
        },
      },
    },
    tag: {
      flags: HELP_FLAGS,
      subcommands: {
        list: {
          flags: ["--keyword", "--page", "--page-size", "--json", ...HELP_FLAGS],
        },
        create: {
          flags: ["--name", "--color", "--json", ...HELP_FLAGS],
        },
        update: {
          flags: ["--id", "--name", "--color", "--json", ...HELP_FLAGS],
        },
        delete: {
          flags: ["--id", "--json", ...HELP_FLAGS],
        },
      },
    },
    backup: {
      flags: HELP_FLAGS,
      subcommands: {
        list: {
          flags: ["--json", ...HELP_FLAGS],
        },
        export: {
          flags: ["--output", "--json", ...HELP_FLAGS],
        },
        "export-zip": {
          flags: ["--output", "--json", ...HELP_FLAGS],
        },
        download: {
          flags: ["--filename", "--output", "--json", ...HELP_FLAGS],
        },
        delete: {
          flags: ["--filename", "--json", ...HELP_FLAGS],
        },
        import: {
          flags: ["--file", "--json", ...HELP_FLAGS],
        },
      },
    },
    settings: {
      flags: HELP_FLAGS,
      subcommands: {
        get: {
          flags: ["--json", ...HELP_FLAGS],
        },
        update: {
          flags: [
            "--site-title",
            "--site-subtitle",
            "--logo-icon",
            "--logo-image",
            "--favicon",
            "--background-image",
            "--background-overlay",
            "--show-shortcut-hints",
            "--no-show-shortcut-hints",
            "--sidebar-collapsed",
            "--no-sidebar-collapsed",
            "--show-edit-button",
            "--no-show-edit-button",
            "--show-settings-button",
            "--no-show-settings-button",
            "--json",
            ...HELP_FLAGS,
          ],
        },
        upload: {
          flags: ["--type", "--file", "--json", ...HELP_FLAGS],
        },
      },
    },
    completion: {
      flags: HELP_FLAGS,
    },
  },
};

function resolveCompletionNode(path: string[]): CompletionNode {
  let node = COMPLETION_TREE;

  for (const token of path) {
    const next = node.subcommands?.[token];
    if (!next) {
      return node;
    }
    node = next;
  }

  return node;
}

function normalizeCommandPath(argsBeforeCurrent: string[]): string[] {
  const path: string[] = [];

  for (const token of argsBeforeCurrent) {
    if (token.startsWith("-")) {
      break;
    }
    path.push(token);
  }

  return path;
}

export function getCompletionCandidates(argsBeforeCurrent: string[], current: string): string[] {
  const path = normalizeCommandPath(argsBeforeCurrent);
  const node = resolveCompletionNode(path);
  const currentValue = current.trim();
  const includeFlags = currentValue.startsWith("-") || currentValue.length === 0;

  const candidates = new Set<string>();

  for (const name of Object.keys(node.subcommands ?? {})) {
    candidates.add(name);
  }

  if (includeFlags) {
    for (const flag of node.flags ?? []) {
      candidates.add(flag);
    }
  }

  return [...candidates].filter((item) => item.startsWith(currentValue)).sort();
}

export function renderBashCompletion(bin = "qjzd-nav"): string {
  return `_${bin}_completion() {
  local cur
  cur="\${COMP_WORDS[COMP_CWORD]}"
  local -a args
  args=("\${COMP_WORDS[@]:1:COMP_CWORD}")

  local completions
  if ! completions=$(QJZD_COMP_CUR="$cur" ${bin} __complete "\${args[@]}" 2>/dev/null); then
    return 0
  fi

  COMPREPLY=()
  while IFS= read -r line; do
    [[ -n "$line" ]] && COMPREPLY+=("$line")
  done <<< "$completions"
}

complete -F _${bin}_completion ${bin}
`;
}

export function renderZshCompletion(bin = "qjzd-nav"): string {
  return `#compdef ${bin}

_${bin}_completion() {
  local cur
  cur="\${words[CURRENT]}"
  local -a args
  if (( CURRENT > 1 )); then
    args=("\${(@)words[2,CURRENT-1]}")
  else
    args=()
  fi

  local -a completions
  completions=("\${(@f)$(QJZD_COMP_CUR="$cur" ${bin} __complete "\${args[@]}" 2>/dev/null)}")
  compadd -- "\${completions[@]}"
}

compdef _${bin}_completion ${bin}
`;
}

export function renderCompletionScript(shell: string, bin = "qjzd-nav"): string {
  const normalized = shell.trim().toLowerCase();
  if (normalized === "bash") {
    return renderBashCompletion(bin);
  }
  if (normalized === "zsh") {
    return renderZshCompletion(bin);
  }
  throw new CliError(`Unsupported shell "${shell}". Supported shells: bash, zsh.`);
}
