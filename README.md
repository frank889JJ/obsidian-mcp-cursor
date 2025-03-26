# Obsidian MCP for Cursor IDE

将 Obsidian 知识库与 Cursor IDE 集成的 MCP (Model Context Protocol) 服务器实现。

## 功能特点

- 在 Cursor IDE 中直接访问和搜索 Obsidian 笔记
- 支持多个 Obsidian 仓库
- 实时同步笔记更新
- 支持 Markdown 格式
- 安全的本地访问机制

## 系统要求

- Node.js 20 或更高版本
- Obsidian 已安装并创建了至少一个仓库
- Cursor IDE
- macOS/Linux/Windows

## 安装步骤

### 1. 安装必要的依赖

```bash
# 全局安装 obsidian-mcp
npm install -g obsidian-mcp
```

### 2. 创建 Obsidian 仓库

如果还没有 Obsidian 仓库，需要创建一个：

```bash
# macOS/Linux
mkdir -p ~/Documents/Obsidian/Vault

# Windows
mkdir "%USERPROFILE%\Documents\Obsidian\Vault"
```

### 3. 配置 Obsidian

1. 打开 Obsidian 应用
2. 添加仓库：选择 `打开其他仓库` -> `打开` -> 选择刚创建的 Vault 目录
3. 等待 Obsidian 初始化仓库（创建 .obsidian 目录）

### 4. 配置 MCP 服务器

在项目根目录下创建 `config/obsidian-mcp.json`：

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": ["-y", "obsidian-mcp", "/path/to/your/vault"],
      "env": {
        "OBSIDIAN_VAULT": "/path/to/your/vault"
      }
    }
  }
}
```

注意：将 `/path/to/your/vault` 替换为您的 Obsidian 仓库实际路径。

### 5. 启动服务

1. 确保 Obsidian 正在运行
2. 重启 Cursor IDE
3. Cursor 会自动检测并加载 MCP 配置

## 目录结构

```
obsidian-mcp-cursor/
├── config/
│   └── obsidian-mcp.json     # MCP 服务器配置
├── scripts/
│   ├── install.js            # 安装脚本
│   └── setup.js              # 设置脚本
├── src/
│   └── server/
│       └── obsidian_mcp.js   # MCP 服务器实现
├── docs/
│   └── setup_guide.md        # 详细设置指南
├── package.json
└── README.md
```

## 常见问题

### 服务器未连接
- 检查 Obsidian 是否正在运行
- 验证仓库路径是否正确
- 确认 Node.js 版本是否满足要求

### 权限问题
- 检查仓库目录的读写权限
- 确保当前用户有权访问该目录

### 配置问题
- 确保配置文件语法正确
- 验证路径分隔符是否正确（Windows 使用 \，Unix 使用 /）

## 安全说明

1. 本服务器仅在本地运行，不会向外部发送数据
2. 建议定期备份 Obsidian 仓库
3. 不要在配置中使用不受信任的目录
4. 避免将敏感信息存储在笔记中

## 贡献指南

欢迎提交 Pull Request 和 Issue！

## 许可证

MIT

## 作者

[Your Name]

## 更多资源

- [Obsidian 官方文档](https://help.obsidian.md/)
- [Cursor IDE 文档](https://cursor.sh/)
- [MCP 协议文档](https://modelcontextprotocol.io/)