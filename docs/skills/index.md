---
layout: home
title: Skills 概览
titleTemplate: false
---

# Skills

QJZD Nav CLI 提供了可复用的 Skills，位于项目的 `skills/` 目录下。

## 目录结构

```
skills/
├── qjzd-nav-cli/              # 主路由 Skill
├── qjzd-nav-cli-auth/         # 认证管理
├── qjzd-nav-cli-content/      # 内容管理（链接、分类、标签）
└── qjzd-nav-cli-operations/      # 运维操作（备份、设置）
```

## Skill 说明

| Skill                     | 说明         | 适用场景                   |
| ------------------------- | ------------ | -------------------------- |
| `qjzd-nav-cli`            | 主路由 Skill | 混合任务或不确定时使用     |
| `qjzd-nav-cli-auth`       | 认证管理     | 登录、Profile、凭据修复    |
| `qjzd-nav-cli-content`    | 内容管理     | 链接、分类、标签的增删改查 |
| `qjzd-nav-cli-operations` | 运维操作     | 备份、恢复、站点设置       |

## 使用方式

在 Claude Code 中加载 Skill：

```
加载 skills/qjzd-nav-cli
```

或加载特定领域的 Skill：

```
加载 skills/qjzd-nav-cli-auth
```

## 相关资源

- [CLI 命令参考](/cli/)
- [快速开始](/guide/)
