# backup 命令

备份和恢复操作。

## backup list

列出所有备份。

```sh
qjzd-nav backup list [options]
```

**选项：**

| 选项     | 说明           |
| -------- | -------------- |
| `--json` | 输出 JSON 格式 |

## backup export

导出 JSON 格式备份。

```sh
qjzd-nav backup export [options]
```

**选项：**

| 选项              | 说明           |
| ----------------- | -------------- |
| `--output <file>` | 输出文件路径   |
| `--json`          | 输出 JSON 格式 |

## backup export-zip

导出 ZIP 格式备份（包含静态资源）。

```sh
qjzd-nav backup export-zip [options]
```

**选项：**

| 选项              | 说明           |
| ----------------- | -------------- |
| `--output <file>` | 输出文件路径   |
| `--json`          | 输出 JSON 格式 |

## backup download

下载备份文件。

```sh
qjzd-nav backup download [options]
```

**选项：**

| 选项                    | 说明               |
| ----------------------- | ------------------ |
| `--filename <filename>` | 备份文件名（必填） |
| `--output <file>`       | 输出文件路径       |
| `--json`                | 输出 JSON 格式     |

## backup delete

删除备份。

```sh
qjzd-nav backup delete [options]
```

**选项：**

| 选项                    | 说明               |
| ----------------------- | ------------------ |
| `--filename <filename>` | 备份文件名（必填） |
| `--json`                | 输出 JSON 格式     |

## backup import

导入 JSON 格式备份。

```sh
qjzd-nav backup import [options]
```

**选项：**

| 选项            | 说明                 |
| --------------- | -------------------- |
| `--file <path>` | 备份文件路径（必填） |
| `--json`        | 输出 JSON 格式       |

::: warning 注意
导入功能仅支持 JSON 格式，不支持 ZIP 格式。
:::
