---
layout: home

hero:
  name: "QJZD Nav CLI"
  text: "管理 QJZD Nav 实例的命令行工具"
  tagline: 支持链接、分类、标签、备份和站点设置管理
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/
    - theme: alt
      text: CLI 参考
      link: /cli/
    - theme: alt
      text: Skills
      link: /skills/

features:
  - title: 认证管理
    details: 使用密码登录，凭据安全存储在系统 keyring 中
    link: /guide/auth
    linkText: 了解更多
  - title: 内容管理
    details: 管理链接、分类和标签，支持批量操作
    link: /guide/link
    linkText: 了解更多
  - title: 备份与恢复
    details: 支持 JSON 和 ZIP 格式备份，可导入恢复
    link: /guide/backup
    linkText: 了解更多
  - title: 站点设置
    details: 上传图片、修改主题配置，自定义站点外观
    link: /guide/settings
    linkText: 了解更多
---

<div style="text-align: center; padding: 2rem 0;">
  <h2>安装</h2>
  <pre><code>npm install -g qjzd-nav-cli</code></pre>
  <p>安装后可执行命令为 <code>qjzd-nav</code></p>
</div>
