# category 命令

分类的增删改查操作。

## category list

列出所有分类。

```sh
qjzd-nav category list [options]
```

**选项：**

| 选项                  | 说明           |
| --------------------- | -------------- |
| `--keyword <keyword>` | 搜索关键词     |
| `--page <page>`       | 页码           |
| `--page-size <size>`  | 每页数量       |
| `--json`              | 输出 JSON 格式 |

## category create

创建新分类。

```sh
qjzd-nav category create [options]
```

**选项：**

| 选项                   | 说明             |
| ---------------------- | ---------------- |
| `--name <name>`        | 分类名称（必填） |
| `--description <desc>` | 分类描述         |
| `--icon <icon>`        | 图标类           |
| `--order <order>`      | 排序序号         |
| `--parent-id <id>`     | 父分类 ID        |
| `--json`               | 输出 JSON 格式   |

## category update

更新分类。

```sh
qjzd-nav category update [options]
```

**选项：**

| 选项                   | 说明                          |
| ---------------------- | ----------------------------- |
| `--id <id>`            | 分类 ID（必填）               |
| `--name <name>`        | 分类名称                      |
| `--description <desc>` | 分类描述                      |
| `--icon <icon>`        | 图标类                        |
| `--order <order>`      | 排序序号                      |
| `--parent-id <id>`     | 父分类 ID（使用空字符串清除） |
| `--json`               | 输出 JSON 格式                |

## category delete

删除分类。

```sh
qjzd-nav category delete [options]
```

**选项：**

| 选项                    | 说明                                       |
| ----------------------- | ------------------------------------------ |
| `--id <id>`             | 分类 ID（必填）                            |
| `--mode <mode>`         | 删除模式，仅支持 `only`                    |
| `--sub-action <action>` | 子操作，当 mode=only 时：promote 或 delete |
| `--json`                | 输出 JSON 格式                             |

## category reorder

批量更新分类顺序。

```sh
qjzd-nav category reorder [options]
```

**选项：**

| 选项              | 说明                                         |
| ----------------- | -------------------------------------------- |
| `--items <items>` | JSON 数组格式，如 `[{"id":"xxx","order":1}]` |
| `--json`          | 输出 JSON 格式                               |
