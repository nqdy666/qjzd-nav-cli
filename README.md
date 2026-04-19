# QJZD Nav CLI

[简体中文](./README.zh-CN.md)

A command-line tool for managing [QJZD Nav](https://nav.qjzd.online) instances.

## Install

```sh
npm install -g qjzd-nav-cli
```

The installed binary is:

```sh
qjzd-nav
```

Check the version:

```sh
qjzd-nav --version
```

## Requirements

- Node.js `>= 22`

## Quick Start

### Login with password

```sh
qjzd-nav auth login \
  --profile default \
  --url https://nav.qjzd.online \
  --password <your-password>
```

The password is encrypted with RSA before being sent to the server.

### Verify the current profile

```sh
qjzd-nav auth current
qjzd-nav auth profile list
```

## Common Usage

Get help:

```sh
qjzd-nav --help
qjzd-nav auth --help
qjzd-nav link --help
qjzd-nav category --help
qjzd-nav tag --help
```

Example root help output:

```text
qjzd-nav/1.0.0

Usage:
  $ qjzd-nav <command> [options]

Commands:
  auth          Authentication commands
  link          Link management commands
  category      Category management commands
  tag           Tag management commands
  backup        Backup management commands
  settings      Settings management commands

For more info, run any command with the `--help` flag:
  $ qjzd-nav auth --help
  $ qjzd-nav link --help
  $ qjzd-nav category --help
  $ qjzd-nav tag --help
  $ qjzd-nav backup --help
  $ qjzd-nav settings --help

Options:
  -h, --help     Display this message
  -v, --version  Display version number
```

Use a specific saved profile:

```sh
qjzd-nav link list --profile default
```

Use JSON output for scripting:

```sh
qjzd-nav link list --json
qjzd-nav category list --json
```

Enable shell completion:

For `bash`:

```sh
eval "$(qjzd-nav completion bash)"
```

For `zsh`:

```sh
eval "$(qjzd-nav completion zsh)"
```

After enabling completion, you can use <kbd>Tab</kbd> to complete commands such as:

```sh
qjzd-nav <TAB>
qjzd-nav auth <TAB>
qjzd-nav link <TAB>
```

## Main Command Areas

QJZD Nav CLI includes these command groups:

- `auth` - Authentication and profile management
- `link` - Link CRUD operations
- `category` - Category CRUD operations
- `tag` - Tag CRUD operations
- `backup` - Backup and restore operations
- `settings` - Site settings management

For details on any command, use `--help`.

## Agent Skills

This package ships with reusable skills under the root `skills/` directory.

Included skills:

- `qjzd-nav-cli`
- `qjzd-nav-cli-auth`
- `qjzd-nav-cli-content`
- `qjzd-nav-cli-backup`

## Configuration

Profile metadata is stored in:

- `$QJZD_NAV_CLI_CONFIG_DIR/config.json` if `QJZD_NAV_CLI_CONFIG_DIR` is set
- otherwise `$XDG_CONFIG_HOME/qjzd-nav/config.json`
- otherwise `$HOME/.config/qjzd-nav/config.json`

Credentials are stored in the system keyring via `@napi-rs/keyring`.

## Development

Useful commands:

```sh
pnpm typecheck
vp lint
vp test
vp pack
```

## Publishing

Before publishing, verify the package contents:

```sh
npm pack --dry-run
```

Create a release version locally without publishing to npm:

```sh
vp run release
vp run release:dry
```

This uses `release-it` to bump the version, create a release commit and git tag, push them upstream, and create a GitHub Release.
It does not publish the package to npm.

The published package should include:

- `dist/`
- `skills/`
- `README.md`
- `README.zh-CN.md`
- `LICENSE`

## License

MIT
