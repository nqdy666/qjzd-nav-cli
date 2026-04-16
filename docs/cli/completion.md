# completion 命令

生成终端补全脚本。

## 概述

`qjzd-nav completion` 命令生成 shell 补全脚本，支持 Bash 和 Zsh。

## 使用方法

### Bash

```sh
# 临时启用（当前会话）
eval "$(qjzd-nav completion bash)"

# 永久启用（写入 ~/.bashrc）
qjzd-nav completion bash >> ~/.bashrc
```

### Zsh

```sh
# 临时启用（当前会话）
eval "$(qjzd-nav completion zsh)"

# 永久启用（写入 ~/.zshrc）
qjzd-nav completion zsh >> ~/.zshrc
```

## 补全内容

启用后，按 Tab 键可补全：

- 子命令：`auth`, `link`, `category`, `tag`, `backup`, `settings`
- 子命令的子命令：如 `auth profile`, `link list` 等
- 选项：如 `--json`, `--profile`, `--id` 等

**示例：**

```sh
qjzd-nav <TAB>
qjzd-nav auth <TAB>
qjzd-nav link list --<TAB>
```
