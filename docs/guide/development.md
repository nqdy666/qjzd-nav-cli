# 开发指南

## 环境要求

- Node.js `>= 22`
- pnpm `>= 10`

## 依赖安装

```sh
pnpm install
```

## 开发

启动开发服务器：

```sh
pnpm dev
```

## 类型检查

```sh
pnpm typecheck
```

## 代码检查

```sh
pnpm lint
```

## 格式化

自动格式化代码：

```sh
pnpm fmt
```

## 测试

运行所有测试：

```sh
pnpm test
```

运行指定测试文件：

```sh
pnpm test --run src/utils/__test__/completion.spec.ts
```

## 构建

构建生产版本：

```sh
pnpm build
```

构建产物位于 `dist/` 目录。

## 发布

### 检查打包内容

发布前验证打包内容：

```sh
npm pack --dry-run
```

### 版本发布

使用 `release-it` 执行版本发布流程：

```sh
# 完整发布（更新版本、生成 commit、创建 tag、推送到远端、创建 GitHub Release）
pnpm release

# 预演模式（不实际发布）
pnpm release:dry
```

发布流程会自动：

- 更新 package.json 中的版本号
- 生成 release commit
- 创建 git tag
- 推送到远端仓库
- 创建 GitHub Release

### 手动发布到 npm

```sh
pnpm publish --access public
```

## 文档

### 启动文档开发服务器

```sh
pnpm docs:dev
```

文档网站位于 `docs/` 目录，使用 VitePress 构建。

### 构建文档

```sh
pnpm docs:build
```

构建产物位于 `docs/.vitepress/dist/`。

### 预览构建结果

```sh
pnpm docs:preview
```

## 项目结构

```
├── src/
│   ├── cli.ts              # CLI 入口
│   ├── commands/           # 命令实现
│   │   ├── auth/           # 认证命令
│   │   ├── link/          # 链接命令
│   │   ├── category/      # 分类命令
│   │   ├── tag/          # 标签命令
│   │   ├── backup/       # 备份命令
│   │   └── settings/      # 设置命令
│   ├── shared/            # 共享类型
│   └── utils/             # 工具函数
├── skills/                # CLI Skills
├── docs/                  # VitePress 文档
└── dist/                 # 构建产物
```

## 常用命令一览

| 命令               | 说明           |
| ------------------ | -------------- |
| `pnpm dev`         | 启动开发服务器 |
| `pnpm build`       | 构建生产版本   |
| `pnpm test`        | 运行测试       |
| `pnpm typecheck`   | 类型检查       |
| `pnpm lint`        | 代码检查       |
| `pnpm fmt`         | 代码格式化     |
| `pnpm docs:dev`    | 启动文档网站   |
| `pnpm docs:build`  | 构建文档网站   |
| `pnpm release`     | 版本发布       |
| `pnpm release:dry` | 发布预演       |
