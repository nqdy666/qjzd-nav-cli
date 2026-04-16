# 站点设置

## 查看当前设置

```sh
qjzd-nav settings get
```

## 更新设置

更新站点标题和副标题：

```sh
qjzd-nav settings update --site-title "我的导航" --site-subtitle "链接收藏"
```

更新 Logo：

```sh
qjzd-nav settings update --logo-icon "i-lucide-compass"
```

更新背景蒙层透明度：

```sh
qjzd-nav settings update --background-overlay 50
```

布尔选项支持否定形式：

```sh
qjzd-nav settings update --no-show-shortcut-hints
qjzd-nav settings update --sidebar-collapsed
```

## 上传文件

上传背景图片（自动设置 20% 蒙层）：

```sh
qjzd-nav settings upload --type background --file ./bg.jpg
```

上传 Logo：

```sh
qjzd-nav settings upload --type logo --file ./logo.png
```

上传 Favicon：

```sh
qjzd-nav settings upload --type favicon --file ./favicon.ico
```

## 设置字段说明

| 字段                     | 类型    | 说明           |
| ------------------------ | ------- | -------------- |
| `--site-title`           | string  | 站点标题       |
| `--site-subtitle`        | string  | 站点副标题     |
| `--logo-icon`            | string  | Logo 图标类    |
| `--logo-image`           | string  | Logo 图片 URL  |
| `--favicon`              | string  | Favicon URL    |
| `--background-image`     | string  | 背景图片 URL   |
| `--background-overlay`   | number  | 背景蒙层 0-100 |
| `--show-shortcut-hints`  | boolean | 显示快捷键提示 |
| `--sidebar-collapsed`    | boolean | 侧边栏默认折叠 |
| `--show-edit-button`     | boolean | 显示编辑按钮   |
| `--show-settings-button` | boolean | 显示设置按钮   |
