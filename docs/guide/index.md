# 快速开始

QJZD Nav CLI 是用于管理 QJZD Nav 实例的命令行工具，支持链接、分类、标签、备份和站点设置的管理。

## 环境要求

- Node.js `>= 22`

## 安装

通过 npm 全局安装：

```sh
npm install -g nav-qjzd-cli
```

安装后可执行命令为 `qjzd-nav`。

## 首次认证

使用密码登录：

```sh
qjzd-nav auth login \
  --profile default \
  --url https://nav.qjzd.online \
  --password <your-password>
```

密码使用 RSA 加密后再发送到服务器。

## 基础命令

查看帮助：

```sh
qjzd-nav --help
qjzd-nav auth --help
qjzd-nav link --help
qjzd-nav category --help
qjzd-nav tag --help
qjzd-nav backup --help
qjzd-nav settings --help
```

查看当前认证状态：

```sh
qjzd-nav auth current
qjzd-nav auth profile list
```

## 下一步

- 了解[认证管理](/guide/auth)
- 学习[链接管理](/guide/link)
- 掌握[分类管理](/guide/category)
- 查阅 [CLI 命令参考](/cli/)
- 了解 [Skills](/skills/)
- [开发指南](/guide/development) - 适用于 contributors
