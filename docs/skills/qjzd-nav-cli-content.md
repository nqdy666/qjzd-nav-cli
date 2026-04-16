# qjzd-nav-cli-content

链接、分类和标签的管理任务。

## 何时使用

- 管理导航链接
- 管理分类结构
- 管理标签
- 批量操作内容

## 适用命令

- `qjzd-nav link`
- `qjzd-nav category`
- `qjzd-nav tag`

## 典型工作流

### 创建链接前准备

```bash
# 1. 获取分类 ID
qjzd-nav category list --json

# 2. 获取标签 ID
qjzd-nav tag list --json
```

### 创建链接

```bash
qjzd-nav link create \
  --title "GitHub" \
  --url "https://github.com" \
  --category-id <cat-id> \
  --tags "<tag-id-1>,<tag-id-2>"
```

### 分类结构管理

```bash
# 创建父分类
qjzd-nav category create --name "技术" --order 1

# 创建子分类
qjzd-nav category create --name "JavaScript" --parent-id <parent-id>

# 重新排序
qjzd-nav category reorder --items '[{"id":"xxx","order":1}]'
```

## 注意事项

- 创建链接时 `categoryId` 是必填项
- 多个标签用逗号分隔
- 删除分类时支持 `--mode only` 仅删除分类本身
