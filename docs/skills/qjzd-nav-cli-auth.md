# qjzd-nav-cli-auth

认证和 Profile 管理相关的任务。

## 何时使用

- 登录 QJZD Nav 实例
- 管理多个 Profile
- 修复凭据问题
- 检查 Profile 健康状态

## 适用命令

- `qjzd-nav auth login`
- `qjzd-nav auth current`
- `qjzd-nav auth profile`

## 常见工作流

### 首次登录

```bash
qjzd-nav auth login \
  --profile default \
  --url https://nav.qjzd.online \
  --password <password>
```

### 检查当前状态

```bash
qjzd-nav auth current
qjzd-nav auth profile list
```

### 修复凭据问题

```bash
# 诊断问题
qjzd-nav auth profile doctor

# 删除损坏的 Profile
qjzd-nav auth profile delete <name> --force

# 重新登录
qjzd-nav auth login --profile <name> --url <url> --password <password>
```

## 注意事项

- 密码使用 RSA 加密传输
- 凭据存储在系统 keyring 中
- 非交互模式必须显式传递所有参数
