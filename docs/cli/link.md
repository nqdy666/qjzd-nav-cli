# link 命令

链接的增删改查操作。

## link list

列出所有链接。

```sh
qjzd-nav link list [options]
```

**选项：**

| 选项                  | 说明                           |
| --------------------- | ------------------------------ |
| `--category-id <id>`  | 按分类 ID 筛选                 |
| `--tag-ids <ids>`     | 按标签 ID 筛选，多个用逗号分隔 |
| `--keyword <keyword>` | 搜索关键词                     |
| `--page <page>`       | 页码                           |
| `--page-size <size>`  | 每页数量                       |
| `--json`              | 输出 JSON 格式                 |

## link create

创建新链接。

```sh
qjzd-nav link create [options]
```

**选项：**

| 选项                   | 说明                    |
| ---------------------- | ----------------------- |
| `--title <title>`      | 链接标题（必填）        |
| `--url <url>`          | 链接地址（必填）        |
| `--category-id <id>`   | 分类 ID（必填）         |
| `--description <desc>` | 链接描述                |
| `--icon <icon>`        | 图标类                  |
| `--tags <tags>`        | 标签 ID，多个用逗号分隔 |
| `--order <order>`      | 排序序号                |
| `--json`               | 输出 JSON 格式          |

## link update

更新链接。

```sh
qjzd-nav link update [options]
```

**选项：**

| 选项                   | 说明                    |
| ---------------------- | ----------------------- |
| `--id <id>`            | 链接 ID（必填）         |
| `--title <title>`      | 链接标题                |
| `--url <url>`          | 链接地址                |
| `--category-id <id>`   | 分类 ID                 |
| `--description <desc>` | 链接描述                |
| `--icon <icon>`        | 图标类                  |
| `--tags <tags>`        | 标签 ID，多个用逗号分隔 |
| `--order <order>`      | 排序序号                |
| `--json`               | 输出 JSON 格式          |

## link delete

删除链接。

```sh
qjzd-nav link delete [options]
```

**选项：**

| 选项        | 说明            |
| ----------- | --------------- |
| `--id <id>` | 链接 ID（必填） |
| `--json`    | 输出 JSON 格式  |
