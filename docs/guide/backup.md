# 备份与恢复

## 列出备份

```sh
qjzd-nav backup list
```

## 导出备份

导出为 JSON 格式：

```sh
qjzd-nav backup export
qjzd-nav backup export --output ./backup.json
```

导出为 ZIP 格式（包含静态资源）：

```sh
qjzd-nav backup export-zip
qjzd-nav backup export-zip --output ./backup.zip
```

## 下载备份

从服务器下载已有的备份文件：

```sh
qjzd-nav backup download --filename "qjzd-nav-backup-2024-01-01.json" --output ./download.json
```

## 删除备份

```sh
qjzd-nav backup delete --filename "qjzd-nav-backup-2024-01-01.json"
```

## 导入备份

导入 JSON 格式的备份文件：

```sh
qjzd-nav backup import --file ./backup.json
```

::: warning 注意
导入功能仅支持 JSON 格式，不支持 ZIP 格式。
:::
