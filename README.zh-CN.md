# QJZD Nav CLI

[English README](./README.md)

一个用于管理 [QJZD Nav](https://nav.qjzd.online) 实例的命令行工具。

## 安装

```sh
npm install -g qjzd-nav-cli
```

安装后可执行命令为：

```sh
qjzd-nav
```

查看版本：

```sh
qjzd-nav --version
```

## 运行要求

- Node.js `>= 22`

## 快速开始

### 使用密码登录

```sh
qjzd-nav auth login \
  --profile default \
  --url https://nav.qjzd.online \
  --password <your-password>
```

密码使用 RSA 加密后再发送到服务器。

### 验证当前 profile

```sh
qjzd-nav auth current
qjzd-nav auth profile list
```

## 常见用法

查看帮助：

```sh
qjzd-nav --help
qjzd-nav auth --help
qjzd-nav link --help
qjzd-nav category --help
qjzd-nav tag --help
qjzd-nav backup --help
qjzd-nav settings --help
```

根命令帮助输出示例：

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

指定已保存的 profile：

```sh
qjzd-nav link list --profile default
```

使用 JSON 输出以便脚本处理：

```sh
qjzd-nav link list --json
qjzd-nav category list --json
```

启用终端补全：

对于 `bash`：

```sh
eval "$(qjzd-nav completion bash)"
```

对于 `zsh`：

```sh
eval "$(qjzd-nav completion zsh)"
```

启用后，可以通过 <kbd>Tab</kbd> 补全这类命令：

```sh
qjzd-nav <TAB>
qjzd-nav auth <TAB>
qjzd-nav link <TAB>
```

## 主要命令分组

QJZD Nav CLI 包含以下命令分组：

- `auth` - 认证和 profile 管理
- `link` - 链接增删改查操作
- `category` - 分类增删改查操作
- `tag` - 标签增删改查操作
- `backup` - 备份和恢复操作
- `settings` - 站点设置管理

更多细节请使用 `--help` 查看。

## Agent Skills

此包还附带了可复用的 skills，位于根目录下的 `skills/`。

包含的 skills：

- `qjzd-nav-cli`
- `qjzd-nav-cli-auth`
- `qjzd-nav-cli-content`
- `qjzd-nav-cli-backup`

## 配置

profile 元数据存储在：

- 如果设置了 `QJZD_NAV_CLI_CONFIG_DIR`，则为 `$QJZD_NAV_CLI_CONFIG_DIR/config.json`
- 否则为 `$XDG_CONFIG_HOME/qjzd-nav/config.json`
- 再否则为 `~/.config/qjzd-nav/config.json`

凭据存储在系统 keyring 中。

## 开发

常用命令：

```sh
pnpm typecheck
vp lint
vp test
vp pack
```

## 发布

发布前建议先检查打包内容：

```sh
npm pack --dry-run
```

通过命令执行版本发布流程，但不发布到 npm：

```sh
vp run release
vp run release:dry
```

这里使用 `release-it` 来更新版本号、生成 release commit、创建 git tag、推送到远端，并创建 GitHub Release。
不会发布到 npm。

发布包中应包含：

- `dist/`
- `skills/`
- `README.md`
- `README.zh-CN.md`
- `LICENSE`

## 许可证

MIT
