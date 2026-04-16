# auth 命令

认证和 profile 管理。

## auth login

登录并保存 profile。

```sh
qjzd-nav auth login [options]
```

**选项：**

| 选项                      | 说明                                          |
| ------------------------- | --------------------------------------------- |
| `--profile <name>`        | 保存的 profile 名称                           |
| `--url <url>`             | QJZD Nav 实例地址                             |
| `--password <password>`   | 登录密码                                      |
| `--token-expiry <expiry>` | Token 有效期：1d, 1w, 1M, 3M, 6M, 1y, forever |
| `--json`                  | 输出 JSON 格式                                |

## auth current

显示当前激活的 profile。

```sh
qjzd-nav auth current [options]
```

**选项：**

| 选项               | 说明             |
| ------------------ | ---------------- |
| `--profile <name>` | 查看指定 profile |
| `--json`           | 输出 JSON 格式   |

## auth profile

管理已保存的 profile。

```sh
qjzd-nav auth profile <subcommand> [options]
```

### auth profile list

列出所有 profile。

```sh
qjzd-nav auth profile list [options]
```

### auth profile current

显示当前激活的 profile（`auth current` 的别名）。

### auth profile get

显示指定 profile 的详细信息。

```sh
qjzd-nav auth profile get [name] [options]
```

### auth profile use

切换激活的 profile。

```sh
qjzd-nav auth profile use [name] [options]
```

### auth profile delete

删除 profile 及其凭据。

```sh
qjzd-nav auth profile delete [name] [options]
```

**选项：**

| 选项      | 说明                 |
| --------- | -------------------- |
| `--force` | 非交互模式下跳过确认 |

### auth profile doctor

检查所有 profile 的凭据健康状态。

```sh
qjzd-nav auth profile doctor [options]
```
