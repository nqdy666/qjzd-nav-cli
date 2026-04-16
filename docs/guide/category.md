# 分类管理

## 列出分类

```sh
qjzd-nav category list
```

按关键词搜索：

```sh
qjzd-nav category list --keyword 编程
```

分页：

```sh
qjzd-nav category list --page 1 --page-size 20
```

## 创建分类

```sh
qjzd-nav category create \
  --name "编程" \
  --description "编程相关链接" \
  --icon "i-lucide-code" \
  --order 0
```

创建子分类：

```sh
qjzd-nav category create \
  --name "JavaScript" \
  --parent-id <parent-category-id>
```

## 更新分类

```sh
qjzd-nav category update --id <cat-id> --name "新名称"
qjzd-nav category update --id <cat-id> --icon "i-lucide-star"
```

## 删除分类

删除分类及其所有链接：

```sh
qjzd-nav category delete --id <cat-id>
```

仅删除分类，将链接移动到父分类：

```sh
qjzd-nav category delete --id <cat-id> --mode only --sub-action promote
```

## 排序分类

批量更新分类顺序：

```sh
qjzd-nav category reorder --items '[{"id":"xxx","order":1},{"id":"yyy","order":2}]'
```
