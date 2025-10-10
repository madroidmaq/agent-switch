# Agent Switch - AI Agent 配置切换器

[![npm version](https://badge.fury.io/js/agent-switch.svg)](https://badge.fury.io/js/agent-switch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/agent-switch.svg)](https://nodejs.org/)

一个美观实用的 TUI（文本用户界面）工具，用于快速切换 AI Agent 框架的配置。支持 Claude Code、GitHub Copilot、Gemini 等多种 AI Agent 框架。

## 目录

- [功能特性](#功能特性)
- [安装](#安装)
- [使用方法](#使用方法)
- [配置文件](#配置文件)
- [开发](#开发)
- [故障排除](#故障排除)
- [许可证](#许可证)

## 功能特性

- 🎨 **美观的 TUI 界面** - 基于 Ink 构建的现代化终端界面
- ⚡ **快速切换** - 在多个 AI Agent 服务配置之间一键切换
- 🌍 **作用域支持** - 支持全局和本地项目级别的配置
- 🤖 **多框架支持** - 当前支持 Claude Code，未来支持 Copilot、Gemini 等
- 📋 **基于现有配置** - 直接读写 `~/.claude/presets.json`（Claude Code）

## 安装

### 全局安装（推荐）

```bash
npm install -g agent-switch
```

安装后可直接使用 `as` 或 `agent-switch` 命令。

### 本地开发

```bash
git clone https://github.com/yourusername/agent-switch.git
cd agent-switch
npm install
npm run build

# 创建全局链接（可选）
npm link
```

## 使用方法

### TUI 模式（推荐）

启动交互式 TUI 界面：

```bash
agent-switch
# 或
agent-switch switch
```

**键盘快捷键：**

**在服务列表界面：**
- `↑↓` - 在服务列表中导航
- `Tab` - 切换作用域（全局 ↔ 本地）
- `Enter` - 切换到选中的服务（使用当前作用域）
- `E` - 编辑配置文件（使用系统默认编辑器打开 `~/.claude/presets.json`）
- `H` - 查看帮助（在浏览器中打开帮助文档）
- `Q` / `Esc` - 退出

**交互流程：**
1. 启动 TUI，查看服务列表
2. 用 `↑↓` 选择要切换的服务
3. 用 `Tab` 键切换作用域（默认：全局配置）
4. 按 `Enter` 确认切换
5. 显示成功消息和当前配置，3秒后自动退出

### 命令行模式

快速切换服务（无需 TUI）：

```bash
# 全局切换
agent-switch use anyrouter

# 本地切换（仅当前项目）
agent-switch use anyrouter --local
```

列出所有服务：

```bash
agent-switch list
# 或
agent-switch ls
```

查看当前服务：

```bash
agent-switch current
```

## 配置文件

Agent Switch 直接使用对应框架的配置文件：

- **预设配置**: `~/.claude/presets.json` - 存储所有服务配置
- **全局配置**: `~/.claude/settings.json` - 全局默认激活的服务
- **本地配置**: `.claude/settings.local.json` - 项目级别的服务配置

### 预设配置格式

```json
{
  "anyrouter": {
    "env": {
      "ANTHROPIC_BASE_URL": "https://xxx",
      "ANTHROPIC_AUTH_TOKEN": "sk-xxx",
      "ANTHROPIC_MODEL": "claude-sonnet-4-20250514",
      "ANTHROPIC_SMALL_FAST_MODEL": "claude-3-5-haiku-20241022"
    },
    "forceLoginMethod": "console"
  },
  "claudeai": {
    "env": {},
    "forceLoginMethod": "claudeai"
  }
}
```

## 开发

```bash
# 开发模式
npm run dev

# 类型检查
npm run typecheck

# 构建
npm run build
```

## 故障排除

### 常见问题

#### 权限错误
如果遇到配置文件读写权限问题：
```bash
# 检查并创建配置目录
mkdir -p ~/.claude
chmod 755 ~/.claude

# 检查配置文件权限
ls -la ~/.claude/
```

#### 服务切换失败
1. **配置文件格式错误**
   ```bash
   # 检查配置文件格式
   agent-switch list
   ```

2. **服务不存在**
   ```bash
   # 查看所有可用服务
   agent-switch list
   ```

3. **环境变量问题**
   ```bash
   # 查看当前配置
   agent-switch current
   ```

#### TUI 界面显示异常
- 确保终端支持 Unicode 字符
- 调整终端窗口大小
- 使用支持 TrueColor 的终端（推荐 iTerm2、Windows Terminal）

#### 命令未找到
如果全局安装后仍提示命令未找到：
```bash
# 检查 npm 全局安装路径
npm config get prefix

# 确保该路径在 PATH 环境变量中
echo $PATH
```

### 获取帮助

- 📖 [项目文档](https://github.com/madroidmaq/agent-switch#readme)
- 🐛 [报告问题](https://github.com/madroidmaq/agent-switch/issues)
- 💬 [讨论区](https://github.com/madroidmaq/agent-switch/discussions)


## License

MIT
