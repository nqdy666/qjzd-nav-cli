# settings 命令

站点设置管理。

## settings get

获取当前设置。

```sh
qjzd-nav settings get [options]
```

**选项：**

| 选项     | 说明           |
| -------- | -------------- |
| `--json` | 输出 JSON 格式 |

## settings update

更新站点设置。

```sh
qjzd-nav settings update [options]
```

**选项：**

| 选项                            | 类型    | 说明           |
| ------------------------------- | ------- | -------------- |
| `--site-title <title>`          | string  | 站点标题       |
| `--site-subtitle <subtitle>`    | string  | 站点副标题     |
| `--logo-icon <icon>`            | string  | Logo 图标类    |
| `--logo-image <url>`            | string  | Logo 图片 URL  |
| `--favicon <url>`               | string  | Favicon URL    |
| `--background-image <url>`      | string  | 背景图片 URL   |
| `--background-overlay <number>` | number  | 背景蒙层 0-100 |
| `--show-shortcut-hints`         | boolean | 显示快捷键提示 |
| `--no-show-shortcut-hints`      | boolean | 隐藏快捷键提示 |
| `--sidebar-collapsed`           | boolean | 侧边栏默认折叠 |
| `--no-sidebar-collapsed`        | boolean | 侧边栏默认展开 |
| `--show-edit-button`            | boolean | 显示编辑按钮   |
| `--no-show-edit-button`         | boolean | 隐藏编辑按钮   |
| `--show-settings-button`        | boolean | 显示设置按钮   |
| `--no-show-settings-button`     | boolean | 隐藏设置按钮   |
| `--json`                        | boolean | 输出 JSON 格式 |

## settings upload

上传文件（背景图片、Logo 或 Favicon）。

```sh
qjzd-nav settings upload [options]
```

**选项：**

| 选项            | 说明                                        |
| --------------- | ------------------------------------------- |
| `--type <type>` | 上传类型：background, logo, favicon（必填） |
| `--file <path>` | 本地文件路径（必填）                        |
| `--json`        | 输出 JSON 格式                              |

**示例：**

```sh
# 上传背景图片（自动设置 20% 蒙层）
qjzd-nav settings upload --type background --file ./bg.jpg

# 上传 Logo
qjzd-nav settings upload --type logo --file ./logo.png

# 上传 Favicon
qjzd-nav settings upload --type favicon --file ./favicon.ico
```

**支持的文件类型：**

- 背景：PNG, JPG, WEBP
- Logo：PNG, JPG, SVG, ICO
- Favicon：PNG, SVG, ICO
