# QJZD Nav CLI

This repository is a TypeScript CLI for managing QJZD Nav instances.

## Runtime and Packaging

- Runtime: Node.js >= 22
- Language: TypeScript, ESM
- CLI entry: `src/cli.ts`
- Published binary: `qjzd-nav`
- Local development entry: `tsx src/cli.ts`
- Build output: `dist/cli.mjs`

## Current Command Surface

The root CLI currently registers these business areas:

- `auth` - Authentication and profile management
- `link` - Link CRUD operations
- `category` - Category CRUD operations
- `tag` - Tag CRUD operations
- `backup` - Backup and restore operations
- `settings` - Site settings management

## Command Architecture

This project uses a sub-CLI pattern:

1. Register a placeholder root command in `src/cli.ts` via `registerXxxCommands(cli)`.
2. Implement a dedicated sub-CLI in `src/commands/xxx/index.ts` with its own `cac("qjzd-nav xxx")` instance.
3. Export `tryRunXxxCommand(args, runtime)`.
4. In `src/cli.ts`, dispatch in order by calling `tryRunXxxCommand(...)` before the final root parse.

This pattern is important because it gives correct help output for:

- `qjzd-nav link list`
- `qjzd-nav link list --help`

## Runtime and Auth Model

Authentication and HTTP clients are centralized in `src/utils/runtime.ts`.

- `RuntimeContext` resolves profiles and constructs clients
- `RuntimeContext.getClientsForOptions(...)` returns `clients.axios`
- Shared auth/config models live in `src/shared/profile.ts`
- Auth uses RSA password encryption with bearer tokens
- Profile storage is handled by `src/utils/config-store.ts`
- Profile metadata is stored in `config.json`, but credentials are stored in the system keyring via `@napi-rs/keyring`
- Config path: `$HOME/.config/qjzd-nav/config.json`

## Implemented Business Areas

### `auth`

- login (uses RSA encryption for password)
- current
- profile list/current/get/use/delete/doctor
- supports multi-profile management
- deleting a profile must also remove its stored credentials from the system keyring

### `link`

- list/get/create/update/delete
- filtering by categoryId, tagIds (comma-separated), keyword
- pagination with page and pageSize

### `category`

- list/get/create/update/delete/reorder
- supports parentId for hierarchical categories
- `--mode only` for deleting category only (links move to parent/default)

### `tag`

- list/get/create/update/delete

### `backup`

- list
- export (JSON)
- export-zip (includes assets)
- download
- delete
- import (JSON only)

### `settings`

- get
- update (various settings fields)
- upload (background, logo, favicon with automatic settings update)

## Formatting and Output Conventions

Shared output helpers live in `src/utils/output.ts`.

- Business-specific `printXxxList(...)` and `printXxx(...)` helpers in `src/commands/<module>/format.ts`
- `src/utils/output.ts` for generic helpers like `printJson(...)`
- Table output via `cli-table3`
- Time formatting uses `dayjs`
- JSON output is controlled by `--json`

## Testing Conventions

- Co-locate command tests under `src/commands/<module>/__test__/`
- Keep cross-cutting utility tests under `src/utils/__test__/`

## Validation Workflow

```sh
pnpm typecheck
pnpm test
pnpm run build
```
