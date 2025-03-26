# Model Context Protocol (MCP) 重点概览

## 什么是MCP？

Model Context Protocol (MCP) 是一个开放标准协议，使AI应用程序（如Claude桌面应用或IDE插件）能够与本地工具和数据源集成，为大型语言模型提供丰富的上下文。

## 核心架构

MCP遵循客户端-服务器架构：

* **主机**：启动连接的LLM应用程序
* **客户端**：在主机内与服务器保持1:1连接
* **服务器**：提供上下文、工具和提示词

通信层:
* **传输层**：支持Stdio传输（本地）和HTTP/SSE传输（远程）
* **消息格式**：使用JSON-RPC 2.0，包括请求、响应、通知和错误

## 主要功能

### 1. 资源 - 应用程序控制

允许服务器公开数据，客户端决定如何使用：

```
// 资源示例
{
  uri: "file:///logs/app.log",
  name: "应用程序日志",
  mimeType: "text/plain"
}
```

资源通过URI唯一标识，可包含文本或二进制数据。客户端可以列出、读取和订阅资源更新。

### 2. 工具 - 模型控制

允许LLM通过服务器执行操作：

```
// 工具示例
{
  name: "calculate_sum",
  description: "将两个数字相加",
  inputSchema: {
    type: "object",
    properties: {
      a: { type: "number" },
      b: { type: "number" }
    }
  }
}
```

工具提供了一种机制，使AI能够与外部系统交互，包括API调用、系统操作和数据处理。

### 3. 提示词 - 用户控制

定义可重用的提示模板，用户可选择使用：

```
// 提示词示例
{
  name: "code-review",
  description: "审查代码更改",
  arguments: [
    {
      name: "changes",
      description: "代码差异",
      required: true
    }
  ]
}
```

提示词可以包含动态参数、嵌入式资源上下文和多步工作流程。

### 4. 采样

允许服务器通过客户端请求LLM补全：

```
// 采样请求示例
{
  "messages": [
    {
      "role": "user",
      "content": {
        "type": "text",
        "text": "分析这段代码"
      }
    }
  ],
  "systemPrompt": "您是一个代码助手",
  "maxTokens": 500
}
```

采样采用人在循环设计，确保用户控制模型看到和生成的内容。

## 安全最佳实践

对所有MCP功能的通用安全考虑：

1. **输入验证**：验证所有参数、URI和用户输入
2. **访问控制**：实现适当的授权和身份验证
3. **速率限制**：防止过度使用和滥用
4. **数据处理**：安全处理敏感信息和二进制数据
5. **错误处理**：不向客户端暴露内部错误

## 连接生命周期

1. **初始化**：客户端发送功能，服务器响应
2. **消息交换**：请求-响应交互和单向通知
3. **终止**：优雅关闭或断开连接

## 实现提示

要开始使用MCP：

1. 选择适合语言的SDK（TypeScript、Python、Java、Kotlin等）
2. 定义您的服务器功能（资源、工具、提示词）
3. 选择合适的传输机制
4. 实现请求处理程序
5. 测试与支持MCP的客户端的集成

## 生态系统

MCP已被多种应用程序支持，包括：

* Claude桌面应用
* VS Code插件（如Continue、Cody）
* IDE（Cursor、Zed、Theia IDE）
* AI代理平台（Goose、mcp-agent、SpinAI）
* 聊天应用（LibreChat、5ire）

未来路线图包括改进远程连接、代理支持和标准化工作。 