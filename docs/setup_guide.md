# Obsidian MCP 详细设置指南

本指南将帮助您在开发环境中设置和配置 Obsidian MCP 服务器。

## 环境准备

### 1. 检查系统要求

```bash
# 检查 Node.js 版本（需要 20 或更高）
node --version

# 检查 npm 版本
npm --version
```

### 2. 安装必要工具

```bash
# 全局安装 obsidian-mcp
npm install -g obsidian-mcp
```

## Obsidian 设置

### 1. 创建 Obsidian 仓库

默认位置：
- macOS/Linux: `~/Documents/Obsidian/Vault`
- Windows: `%USERPROFILE%\Documents\Obsidian\Vault`

```bash
# macOS/Linux
mkdir -p ~/Documents/Obsidian/Vault

# Windows
mkdir "%USERPROFILE%\Documents\Obsidian\Vault"
```

### 2. 初始化仓库

1. 打开 Obsidian 应用程序
2. 点击"打开其他仓库"
3. 选择刚创建的 Vault 目录
4. 等待 Obsidian 创建 `.obsidian` 目录

## MCP 服务器配置

### 1. 创建配置文件

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

### 2. 配置说明

- `command`: 使用 `npx` 确保使用最新版本
- `args`: 
  - `-y`: 自动确认
  - `obsidian-mcp`: 包名
  - 最后一个参数是仓库路径
- `env`: 环境变量
  - `OBSIDIAN_VAULT`: 仓库路径

### 3. 路径配置

替换配置中的 `/path/to/your/vault` 为实际路径：

macOS/Linux:
```json
"/Users/用户名/Documents/Obsidian/Vault"
```

Windows:
```json
"C:\\Users\\用户名\\Documents\\Obsidian\\Vault"
```

## Cursor IDE 设置

### 1. 配置位置

Cursor IDE 会自动在以下位置查找 MCP 配置：
- 项目根目录的 `config` 文件夹
- 当前工作目录

### 2. 验证配置

1. 重启 Cursor IDE
2. 检查 MCP 服务器状态
3. 尝试使用 Obsidian 相关功能

## 功能测试

### 1. 基本功能

- 创建新笔记
- 读取现有笔记
- 搜索笔记内容

### 2. 高级功能

- 实时同步
- 多仓库支持
- Markdown 渲染

## 故障排除

### 1. 服务器连接问题

检查：
- 配置文件语法
- 路径正确性
- 权限设置

### 2. 仓库访问问题

确认：
- Obsidian 是否运行
- 仓库是否初始化
- 文件权限是否正确

### 3. 常见错误

1. ENOENT 错误
   - 检查文件路径
   - 验证目录权限

2. 权限错误
   - 检查文件系统权限
   - 确认用户权限

3. 配置错误
   - 验证 JSON 语法
   - 检查路径格式

## 开发建议

### 1. 调试技巧

- 使用 `console.log` 输出调试信息
- 检查日志文件
- 使用开发者工具

### 2. 最佳实践

- 定期备份笔记
- 使用版本控制
- 遵循安全建议

## 更新和维护

### 1. 更新服务器

```bash
npm update -g obsidian-mcp
```

### 2. 清理缓存

```bash
npm cache clean --force
```

### 3. 重置配置

1. 删除配置文件
2. 运行安装脚本
3. 重新配置

## 安全建议

1. 定期更新依赖
2. 不要在配置中存储敏感信息
3. 使用安全的文件权限
4. 定期备份重要数据

## 参考资源

- [Obsidian 文档](https://help.obsidian.md/)
- [Cursor IDE 文档](https://cursor.sh/)
- [MCP 协议规范](https://modelcontextprotocol.io/)
- [Node.js 文档](https://nodejs.org/docs)