# tag 命令

标签的增删改查操作。

## tag list

列出所有标签。

```sh
qjzd-nav tag list [options]
```

**选项：**

| 选项                  | 说明           |
| --------------------- | -------------- |
| `--keyword <keyword>` | 搜索关键词     |
| `--page <page>`       | 页码           |
| `--page-size <size>`  | 每页数量       |
| `--json`              | 输出 JSON 格式 |

## tag create

创建新标签。

```sh
qjzd-nav tag create [options]
```

**选项：**

| 选项              | 说明                 |
| ----------------- | -------------------- |
| `--name <name>`   | 标签名称（必填）     |
| `--color <color>` | 标签颜色（十六进制） |
| `--json`          | 输出 JSON 格式       |

## tag update

更新标签。

```sh
qjzd-nav tag update [options]
```

**选项：**

| 选项              | 说明            |
| ----------------- | --------------- |
| `--id <id>`       | 标签 ID（必填） |
| `--name <name>`   | 标签名称        |
| `--color <color>` | 标签颜色        |
| `--json`          | 输出 JSON 格式  |

## tag delete

删除标签。

```sh
qjzd-nav tag delete [options]
```

**选项：**

| 选项        | 说明            |
| ----------- | --------------- |
| `--id <id>` | 标签 ID（必填） |
| `--json`    | 输出 JSON 格式  |
