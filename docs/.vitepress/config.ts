import { defineConfig } from "vitepress";

export default defineConfig({
  title: "QJZD Nav CLI",
  description: "命令行工具，用于管理 QJZD Nav 实例",
  lang: "zh-CN",
  cleanUrls: true,
  lastUpdated: true,

  head: [["link", { rel: "icon", href: "/favicon.ico" }]],

  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "QJZD Nav CLI",

    nav: [
      { text: "指南", link: "/guide/" },
      { text: "CLI 参考", link: "/cli/" },
      { text: "Skills", link: "/skills/" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "指南",
          items: [
            { text: "快速开始", link: "/guide/" },
            { text: "认证", link: "/guide/auth" },
            { text: "链接管理", link: "/guide/link" },
            { text: "分类管理", link: "/guide/category" },
            { text: "标签管理", link: "/guide/tag" },
            { text: "备份与恢复", link: "/guide/backup" },
            { text: "站点设置", link: "/guide/settings" },
            { text: "开发指南", link: "/guide/development" },
          ],
        },
      ],
      "/cli/": [
        {
          text: "CLI 命令",
          items: [
            { text: "概览", link: "/cli/" },
            { text: "auth", link: "/cli/auth" },
            { text: "link", link: "/cli/link" },
            { text: "category", link: "/cli/category" },
            { text: "tag", link: "/cli/tag" },
            { text: "backup", link: "/cli/backup" },
            { text: "settings", link: "/cli/settings" },
            { text: "completion", link: "/cli/completion" },
          ],
        },
      ],
      "/skills/": [
        {
          text: "Skills",
          items: [
            { text: "概览", link: "/skills/" },
            { text: "qjzd-nav-cli", link: "/skills/qjzd-nav-cli" },
            { text: "qjzd-nav-cli-auth", link: "/skills/qjzd-nav-cli-auth" },
            { text: "qjzd-nav-cli-content", link: "/skills/qjzd-nav-cli-content" },
            { text: "qjzd-nav-cli-backup", link: "/skills/qjzd-nav-cli-backup" },
          ],
        },
      ],
    },

    footer: {
      message: "MIT Licensed",
      copyright: "Copyright © 2026 QJZD Nav CLI",
    },

    search: {
      provider: "local",
    },
  },
});
