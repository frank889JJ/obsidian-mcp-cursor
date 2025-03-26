# Obsidian MCP for Cursor

这是一个基于 [MCP (Model Context Protocol)](https://modelcontextprotocol.io) 的 Cursor IDE 服务器实现，使 AI 助手能够与 Obsidian 知识库进行交互，提供读取、创建、编辑和管理笔记及标签的工具。

[English Documentation](README.md)

## 警告！！！

此 MCP 对您的 Obsidian 知识库具有读写权限。在使用此工具之前，请务必备份您的知识库。我们建议使用 git 或任何其他您喜欢的备份方法。虽然这些工具已经经过测试，但它们仍在开发中。

## 功能特点

- 读取和搜索知识库中的笔记
- 创建新的笔记和目录
- 编辑现有笔记
- 移动和删除笔记
- 管理标签（添加、删除、重命名）
- 搜索知识库内容
- 与 Cursor IDE 无缝集成
- 可定制的提示系统

## 系统要求

- Python 3.8 或更高版本
- Obsidian 知识库
- Cursor IDE

## 安装

1. 克隆仓库：
```bash
git clone https://github.com/frank889JJ/obsidian-mcp-cursor.git
cd obsidian-mcp-cursor
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

3. 配置设置：
- 复制 `config/cline_mcp_settings.example.json` 到 `config/cline_mcp_settings.json`
- 编辑配置文件：
  ```json
  {
      "obsidian": {
          "vault_path": "/path/to/your/vault",
          "api_port": 27124
      },
      "cursor": {
          "api_port": 27125,
          "host": "localhost"
      },
      "server": {
          "host": "0.0.0.0",
          "port": 27126,
          "debug": false
      }
  }
  ```
  将 `/path/to/your/vault` 替换为您的 Obsidian 知识库的绝对路径。例如：

  MacOS/Linux:
  ```json
  "/Users/username/Documents/MyVault"
  ```

  Windows:
  ```json
  "C:\\Users\\username\\Documents\\MyVault"
  ```

## 使用方法

1. 启动 MCP 服务器：
```bash
python src/server.py
```

2. 配置 Cursor IDE 连接到 MCP 服务器：
- 打开 Cursor IDE 设置
- 设置 MCP 连接参数
- 测试连接

3. 开始使用 AI 功能与您的知识库交互：
- 通过 AI 命令访问您的笔记
- 在对话中使用增强的上下文
- 利用您的知识库实现更好的 AI 交互

## 可用工具

- `read-note` - 读取笔记内容
- `create-note` - 创建新笔记
- `edit-note` - 编辑现有笔记
- `delete-note` - 删除笔记
- `move-note` - 移动笔记到其他位置
- `create-directory` - 创建新目录
- `search-vault` - 搜索知识库中的笔记
- `add-tags` - 为笔记添加标签
- `remove-tags` - 从笔记中移除标签
- `rename-tag` - 在所有笔记中重命名标签
- `manage-tags` - 列出和组织标签

## 安全性

此服务器需要访问您的 Obsidian 知识库目录。配置服务器时，请确保：
- 仅提供对目标知识库目录的访问权限
- 在批准之前审查工具操作
- 确保配置文件的安全性

## 故障排除

常见问题：

1. **服务器连接问题**
   - 验证配置文件语法
   - 确保知识库路径是绝对路径且存在
   - 检查指定的端口是否可用

2. **权限错误**
   - 确保知识库路径可读写
   - 检查知识库中的文件权限

3. **工具执行失败**
   - 检查服务器日志以获取详细错误信息
   - 验证 Python 环境设置
   - 确保所有依赖项都正确安装

## 说明

本项目在 Cursor AI 的协助下进行了修改和增强，将原始的 Obsidian MCP 实现适配到 Cursor IDE 环境中。

## 致谢

本项目基于 [StevenStavrakis/obsidian-mcp](https://github.com/StevenStavrakis/obsidian-mcp) 开发，特此感谢原作者 [@StevenStavrakis](https://github.com/StevenStavrakis) 的杰出工作。原项目为 Obsidian 提供了优秀的 MCP 服务器实现，使得 AI 助手能够与 Obsidian 知识库进行交互。

本项目在原有基础上进行了以下改进：
- 适配 Cursor IDE 环境
- 优化配置流程
- 添加中文文档支持
- 增强错误处理机制

## 许可证

MIT 