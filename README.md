# Cursor MCP Server

这是一个基于Model Context Protocol (MCP)的Cursor集成服务器。

## 功能特点

- 支持MCP协议
- 提供资源、工具和提示功能
- 易于扩展和定制

## 安装

1. 克隆仓库：
```bash
git clone [repository-url]
cd cursor-mcp-server
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

3. 配置环境变量：
```bash
cp .env.example .env
# 编辑.env文件设置必要的配置
```

## 运行

```bash
python src/server.py
```

## 开发

- 使用Python 3.8+
- 遵循PEP 8编码规范
- 编写测试用例

## 致谢

本项目基于 [StevenStavrakis/obsidian-mcp](https://github.com/StevenStavrakis/obsidian-mcp) 开发，特此感谢原作者 [@StevenStavrakis](https://github.com/StevenStavrakis) 的杰出工作。原项目为 Obsidian 提供了优秀的 MCP 服务器实现，使得 AI 助手能够与 Obsidian 知识库进行交互。

本项目在原有基础上进行了以下改进：
- 适配 Cursor IDE 环境
- 优化配置流程
- 添加中文文档支持
- 增强错误处理机制

## 许可证

MIT 