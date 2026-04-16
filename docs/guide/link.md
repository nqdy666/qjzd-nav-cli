# 链接管理

## 列出链接

列出所有链接：

```sh
qjzd-nav link list
```

按分类筛选：

```sh
qjzd-nav link list --category-id <category-id>
```

按标签筛选：

```sh
qjzd-nav link list --tag-ids <tag-id-1>,<tag-id-2>
```

按关键词搜索：

```sh
qjzd-nav link list --keyword AI
```

分页：

```sh
qjzd-nav link list --page 1 --page-size 20
```

## 创建链接

```sh
qjzd-nav link create \
  --title "Google" \
  --url "https://google.com" \
  --category-id <category-id> \
  --description "搜索引擎" \
  --icon "i-lucide-search" \
  --tags "<tag-id-1>,<tag-id-2>" \
  --order 0
```

## 更新链接

```sh
qjzd-nav link update --id <link-id> --title "新标题"
qjzd-nav link update --id <link-id> --url "https://new-url.com"
```

## 删除链接

```sh
qjzd-nav link delete --id <link-id>
```

## JSON 输出

所有命令支持 `--json` 参数，便于脚本处理：

```sh
qjzd-nav link list --json
qjzd-nav link create --title "Test" --url "https://test.com" --category-id <id> --json
```
