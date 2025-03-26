# Obsidian MCP 安装指南

本指南将帮助您在 macOS 系统上安装和配置 Obsidian MCP 服务。

## 前置要求

1. Node.js 20 或更高版本
2. Obsidian 已安装并创建了至少一个仓库
3. Claude Desktop 已安装

## 安装步骤

### 1. 确保 Obsidian 仓库已正确初始化

在开始之前，请确保您的 Obsidian 仓库满足以下条件：
- 包含 `.obsidian` 目录（通过 Obsidian 打开过该仓库）
- 具有读写权限
- 位于推荐的目录位置之一：
  - `~/Documents/Obsidian/[vault-name]`（推荐）
  - `~/Notes/[vault-name]`
  - `~/Obsidian/[vault-name]`

### 2. 安装 obsidian-mcp

```bash
# 全局安装 obsidian-mcp
npm install -g obsidian-mcp
```

### 3. 配置 Claude Desktop

1. 打开或创建 Claude Desktop 配置文件：
```bash
vim ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

2. 添加以下配置（替换为您的实际仓库路径）：
```json
{
    "mcpServers": {
        "obsidian": {
            "command": "npx",
            "args": ["-y", "obsidian-mcp", "/Users/你的用户名/Documents/Obsidian/Vault"]
        }
    }
}
```

如果需要连接多个仓库：
```json
{
    "mcpServers": {
        "obsidian": {
            "command": "npx",
            "args": [
                "-y", 
                "obsidian-mcp", 
                "/Users/你的用户名/Documents/Obsidian/Work",
                "/Users/你的用户名/Documents/Obsidian/Personal"
            ]
        }
    }
}
```

### 4. 验证安装

1. 重启 Claude Desktop
2. 检查工具栏是否出现锤子图标（表示 MCP 服务器已连接）
3. 如果遇到问题，查看日志文件：
```bash
cat ~/Library/Logs/Claude/mcp*.log
```

## 路径要求和限制

### 支持的路径类型
- 本地文件系统上的专用仓库目录
- 每个仓库必须是独立的目录
- 最多可同时连接 10 个仓库

### 不支持的路径类型
- 网络驱动器（//server/share）
- 网络挂载点（/net, /mnt, /media）
- 系统目录（/tmp）
- 隐藏目录（除了 .obsidian）
- 指向外部的符号链接
- 重叠的路径（一个仓库不能在另一个仓库内）

## 常见问题解决

1. **服务器未显示连接**
   - 检查配置文件语法是否正确
   - 确认仓库路径存在且有权限
   - 重启 Claude Desktop

2. **权限错误**
   - 检查仓库目录的读写权限
   - 确保当前用户有权访问该目录

3. **仓库未被识别**
   - 在 Obsidian 中打开仓库以初始化 .obsidian 目录
   - 确认路径指向有效的 Obsidian 仓库

4. **多仓库配置问题**
   - 确保路径不重叠
   - 检查是否超过 10 个仓库的限制
   - 验证所有路径都是独立的目录

## 安全注意事项

1. 仅提供必要的仓库访问权限
2. 定期备份重要笔记
3. 不要在配置中使用不受信任的目录
4. 避免使用网络位置或系统目录

## 更多资源

- [obsidian-mcp GitHub 仓库](https://github.com/StevenStavrakis/obsidian-mcp)
- [Obsidian 官方文档](https://help.obsidian.md/)
- [Claude Desktop 文档](https://claude.ai/) 