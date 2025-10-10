# NPM 发布指南

本文档详细介绍如何将 Agent Switch 发布到 npm，让其他用户可以通过 `npm install -g agent-switch` 安装使用。


## 🚀 发布流程

### 第一次发布

#### 1. 注册 npm 账号

如果还没有 npm 账号，需要先注册：

1. 访问 [npmjs.com](https://www.npmjs.com/signup) 注册账号
2. 验证邮箱

#### 2. 登录 npm

在终端登录 npm：

```bash
npm login
# 按提示输入：
# - Username: 你的 npm 用户名
# - Password: 你的密码
# - Email: 你的邮箱
# - OTP (如果开启了两步验证): 验证码
```

验证登录状态：

```bash
npm whoami
# 应该显示你的用户名
```

#### 3. 构建项目

确保项目能正确构建：

```bash
# 安装依赖
npm install

# 运行类型检查
npm run typecheck

# 构建项目
npm run build

# 检查构建产物
ls -la dist/
# 应该能看到 dist/index.mjs 文件
```

#### 4. 测试本地安装

在发布前先本地测试：

```bash
# 创建全局链接
npm link

# 测试命令
agent-switch --version
agent-switch list
agent-switch

# 取消链接（测试完成后）
npm unlink -g agent-switch
```

#### 5. 检查将要发布的文件

查看哪些文件会被发布到 npm：

```bash
npm pack --dry-run
```

这会列出所有将被打包的文件。确保：
- ✅ 包含 `dist/` 目录
- ✅ 包含 `README.md`
- ✅ 包含 `LICENSE`
- ✅ 包含 `package.json`
- ❌ 不包含 `src/` 源代码
- ❌ 不包含 `node_modules/`
- ❌ 不包含 `.claude/` 配置

#### 6. 发布到 npm

```bash
# 发布正式版本（1.0.0）
npm publish

# 如果包名已被占用，可以：
# 1. 修改 package.json 中的 name 字段
# 2. 或使用带作用域的包名（如 @yourusername/agent-switch）
```

发布成功后会显示：

```
+ agent-switch@1.0.0
```

#### 7. 验证发布

1. 访问 npm 包页面：`https://www.npmjs.com/package/agent-switch`
2. 全局安装测试：

```bash
# 在另一个目录测试
npm install -g agent-switch

# 测试命令
agent-switch --version
agent-switch list
```

### 后续版本更新

#### 1. 更新版本号

根据改动类型选择版本号：

```bash
# 修复 bug（1.0.0 -> 1.0.1）
npm version patch

# 新增功能（1.0.0 -> 1.1.0）
npm version minor

# 重大更新/破坏性变更（1.0.0 -> 2.0.0）
npm version major
```

这会自动：
- 修改 `package.json` 中的 version 字段
- 创建一个 git commit
- 创建一个 git tag

#### 2. 更新 CHANGELOG.md

记录本次更新的内容：

```markdown
## [1.1.0] - 2024-10-10

### Added
- 新增 GitHub Copilot 支持
- 添加配置导入导出功能

### Fixed
- 修复切换服务时的配置合并问题

### Changed
- 优化 TUI 界面显示
```

#### 3. 提交到 Git

```bash
git add .
git commit -m "chore: release v1.1.0"
git push origin main
git push origin --tags
```

#### 4. 发布新版本

```bash
npm publish
```

## 📦 发布选项

### 发布测试版本

如果想让用户测试新功能但不影响正式版：

```bash
# 修改版本为测试版
npm version 1.1.0-beta.0

# 发布到 beta 标签
npm publish --tag beta
```

用户安装测试版：

```bash
npm install -g agent-switch@beta
```

### 撤销发布

如果发布后发现严重问题，可以撤销（仅限发布后 72 小时内）：

```bash
# 撤销指定版本
npm unpublish agent-switch@1.0.0

# 或撤销整个包（慎用！）
npm unpublish agent-switch --force
```

**注意**：撤销发布后，该版本号不能再次使用。

### 废弃版本

如果某个版本有问题，推荐使用废弃标记而不是撤销：

```bash
npm deprecate agent-switch@1.0.0 "此版本有严重 bug，请升级到 1.0.1"
```

## 🔍 常见问题

### 1. 包名已被占用

错误信息：`403 Forbidden - PUT https://registry.npmjs.org/agent-switch - You do not have permission to publish "agent-switch"`

解决方案：
- 修改包名（如 `@yourusername/agent-switch`）
- 或选择其他可用的包名

### 2. 需要两步验证

如果账号开启了 2FA，发布时需要输入验证码：

```bash
npm publish --otp=123456  # 替换为你的验证码
```

### 3. 检查发布后的包内容

```bash
# 下载已发布的包到本地查看
npm pack agent-switch
tar -xzf agent-switch-1.0.0.tgz
cd package
ls -la
```

### 4. 更新包的 README

如果只是修改 README 而不更新代码：

```bash
# 修改 README.md 后
npm version patch
npm publish
```

npm 网站会自动更新包页面的 README。

## 📊 发布后的维护

### 监控下载量

访问：`https://www.npmjs.com/package/agent-switch`

可以看到：
- 每周/月下载量
- 依赖此包的项目
- 版本历史

### 管理权限

添加其他维护者：

```bash
npm owner add <username> agent-switch
```

### 查看包信息

```bash
npm info agent-switch
```

## 🎯 最佳实践

1. **语义化版本**：遵循 [Semver](https://semver.org/) 规范
   - MAJOR: 不兼容的 API 修改
   - MINOR: 向下兼容的功能性新增
   - PATCH: 向下兼容的问题修正

2. **维护 CHANGELOG**：每次发布都更新 CHANGELOG.md

3. **Git 标签**：每次发布对应一个 git tag

4. **测试后发布**：本地充分测试后再发布

5. **文档完善**：确保 README 清晰易懂

6. **及时响应**：关注 GitHub issues 和 npm 反馈

## 🔗 相关链接

- [npm 官方文档](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [如何发布 Node.js 包到 npm](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
