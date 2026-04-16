# 标签管理

## 列出标签

```sh
qjzd-nav tag list
```

按关键词搜索：

```sh
qjzd-nav tag list --keyword JavaScript
```

分页：

```sh
qjzd-nav tag list --page 1 --page-size 20
```

## 创建标签

```sh
qjzd-nav tag create --name "JavaScript" --color "#F7DF1E"
```

## 更新标签

```sh
qjzd-nav tag update --id <tag-id> --name "TypeScript" --color "#3178C6"
```

## 删除标签

```sh
qjzd-nav tag delete --id <tag-id>
```
