# qjzd-nav-cli-operations

备份、恢复和站点设置相关的任务。

## 何时使用

- 备份站点数据
- 恢复站点数据
- 修改站点设置
- 上传图片资源

## 适用命令

- `qjzd-nav backup`
- `qjzd-nav settings`

## 典型工作流

### 完整备份流程

```bash
# 1. 导出 JSON 备份
qjzd-nav backup export --output ./backup.json

# 2. 导出 ZIP 备份（含资源）
qjzd-nav backup export-zip --output ./backup.zip
```

### 恢复数据

```bash
qjzd-nav backup import --file ./backup.json
```

### 修改站点设置

```bash
# 更新基本信息
qjzd-nav settings update --site-title "新标题"

# 上传背景图片
qjzd-nav settings upload --type background --file ./bg.jpg
```

## 注意事项

- `backup import` 仅支持 JSON 格式
- 上传背景图片时自动设置 20% 蒙层
- 支持的文件类型：PNG, JPG, WEBP, SVG, ICO
