# qjzd-nav-cli

路由 Skill，用于处理涉及 QJZD Nav CLI 的各种任务。

## 何时使用

- 任务涉及 QJZD Nav CLI 的多个功能领域
- 不确定应该使用哪个具体的 Skill
- 任务描述只提到「使用 QJZD Nav CLI」

## Skill 映射

| 子领域                  | 对应 Skill             |
| ----------------------- | ---------------------- |
| 登录、Profile、凭据修复 | `qjzd-nav-cli-auth`    |
| 链接、分类、标签管理    | `qjzd-nav-cli-content` |
| 备份、恢复、设置管理    | `qjzd-nav-cli-backup`  |

## 快速定位

使用以下命令快速确定任务所属领域：

```bash
qjzd-nav --help
qjzd-nav auth --help
qjzd-nav link --help
qjzd-nav category --help
qjzd-nav tag --help
qjzd-nav backup --help
qjzd-nav settings --help
qjzd-nav completion --help
```

## 通用约定

- 优先使用已认证的 Profile
- 使用 `--profile <name>` 指定环境
- 使用 `--json` 便于自动化处理
- 使用 `--force` 时注意 destructive 操作

## 配置与凭据

Profile 元数据存储位置：

- `$QJZD_NAV_CLI_CONFIG_DIR/config.json`（如设置了该环境变量）
- `$XDG_CONFIG_HOME/qjzd-nav/config.json`
- `$HOME/.config/qjzd-nav/config.json`

凭据存储在系统 keyring 中（通过 `@napi-rs/keyring`）。
