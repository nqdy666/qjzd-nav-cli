# 认证管理

## 登录

使用密码登录到 QJZD Nav 实例：

```sh
qjzd-nav auth login \
  --profile default \
  --url https://nav.qjzd.online \
  --password <your-password>
```

密码使用 RSA 加密后再发送到服务器，安全性由服务器公钥保障。

## 查看认证状态

查看当前激活的 profile：

```sh
qjzd-nav auth current
```

列出所有已保存的 profile：

```sh
qjzd-nav auth profile list
```

查看指定 profile 的详细信息：

```sh
qjzd-nav auth profile get default
```

## 切换 Profile

切换默认使用的 profile：

```sh
qjzd-nav auth profile use production
```

## 删除 Profile

删除指定的 profile 及其凭据：

```sh
qjzd-nav auth profile delete local --force
```

## 诊断问题

检查所有 profile 的凭据健康状态：

```sh
qjzd-nav auth profile doctor
```

输出示例：

```
NAME              BASE URL                      AUTH      STATUS                 ACTIVE
local             https://nav.qjzd.online      bearer    ok                     *
production        https://nav.example.com      bearer    missing credentials

Profile credential issues detected.
```

## 非交互模式

在脚本或 CI 环境中使用时，必须显式传递所有参数：

```sh
qjzd-nav auth login \
  --profile CI \
  --url https://nav.qjzd.online \
  --password $QJZD_NAV_PASSWORD
```
