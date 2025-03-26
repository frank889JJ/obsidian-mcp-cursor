# 核心架构
来源：https://modelcontextprotocol.io/docs/concepts/architecture

了解MCP如何连接客户端、服务器和LLM

Model Context Protocol (MCP)建立在灵活、可扩展的架构上，实现了LLM应用程序和集成之间的无缝通信。本文档涵盖了核心架构组件和概念。

## 概述

MCP遵循客户端-服务器架构，其中：

* **主机**是启动连接的LLM应用程序（如Claude桌面应用或IDE）
* **客户端**在主机应用程序内与服务器保持1:1连接
* **服务器**向客户端提供上下文、工具和提示

```mermaid
flowchart LR
    subgraph "主机"
        client1[MCP客户端]
        client2[MCP客户端]
    end
    subgraph "服务器进程"
        server1[MCP服务器]
    end
    subgraph "服务器进程"
        server2[MCP服务器]
    end

    client1 <-->|传输层| server1
    client2 <-->|传输层| server2
```

## 核心组件

### 协议层

协议层处理消息构架、请求/响应链接和高级通信模式。

<Tabs>
  <Tab title="TypeScript">
    ```typescript
    class Protocol<Request, Notification, Result> {
        // 处理传入请求
        setRequestHandler<T>(schema: T, handler: (request: T, extra: RequestHandlerExtra) => Promise<r>): void

        // 处理传入通知
        setNotificationHandler<T>(schema: T, handler: (notification: T) => Promise<void>): void

        // 发送请求并等待响应
        request<T>(request: Request, schema: T, options?: RequestOptions): Promise<T>

        // 发送单向通知
        notification(notification: Notification): Promise<void>
    }
    ```
  </Tab>

  <Tab title="Python">
    ```python
    class Session(BaseSession[RequestT, NotificationT, ResultT]):
        async def send_request(
            self,
            request: RequestT,
            result_type: type[Result]
        ) -> Result:
            """
            发送请求并等待响应。如果响应包含错误，则引发McpError。
            """
            # 请求处理实现

        async def send_notification(
            self,
            notification: NotificationT
        ) -> None:
            """发送不期望响应的单向通知。"""
            # 通知处理实现

        async def _received_request(
            self,
            responder: RequestResponder[ReceiveRequestT, ResultT]
        ) -> None:
            """处理来自另一端的传入请求。"""
            # 请求处理实现

        async def _received_notification(
            self,
            notification: ReceiveNotificationT
        ) -> None:
            """处理来自另一端的传入通知。"""
            # 通知处理实现
    ```
  </Tab>
</Tabs>

关键类包括：

* `Protocol`
* `Client`
* `Server`

### 传输层

传输层处理客户端和服务器之间的实际通信。MCP支持多种传输机制：

1. **Stdio传输**
   * 使用标准输入/输出进行通信
   * 适合本地进程

2. **带有SSE的HTTP传输**
   * 使用服务器发送事件（Server-Sent Events）进行服务器到客户端的消息传递
   * 使用HTTP POST进行客户端到服务器的消息传递

所有传输都使用[JSON-RPC](https://www.jsonrpc.org/) 2.0来交换消息。有关Model Context Protocol消息格式的详细信息，请参阅[规范](https://spec.modelcontextprotocol.io)。

### 消息类型

MCP有以下主要类型的消息：

1. **请求**期望来自另一方的响应：
   ```typescript
   interface Request {
     method: string;
     params?: { ... };
   }
   ```

2. **结果**是对请求的成功响应：
   ```typescript
   interface Result {
     [key: string]: unknown;
   }
   ```

3. **错误**表示请求失败：
   ```typescript
   interface Error {
     code: number;
     message: string;
     data?: unknown;
   }
   ```

4. **通知**是不期望响应的单向消息：
   ```typescript
   interface Notification {
     method: string;
     params?: { ... };
   }
   ```

## 连接生命周期

### 1. 初始化

```mermaid
sequenceDiagram
    participant Client
    participant Server

    Client->>Server: initialize请求
    Server->>Client: initialize响应
    Client->>Server: initialized通知

    Note over Client,Server: 连接准备就绪可供使用
```

1. 客户端发送`initialize`请求，包含协议版本和功能
2. 服务器响应其协议版本和功能
3. 客户端发送`initialized`通知作为确认
4. 开始正常的消息交换

### 2. 消息交换

初始化后，支持以下模式：

* **请求-响应**：客户端或服务器发送请求，另一方响应
* **通知**：任何一方发送单向消息

### 3. 终止

任何一方都可以终止连接：

* 通过`close()`进行干净关闭
* 传输断开连接
* 错误条件

## 错误处理

MCP定义了以下标准错误代码：

```typescript
enum ErrorCode {
  // 标准JSON-RPC错误代码
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603
}
```

SDK和应用程序可以定义自己的错误代码（大于-32000）。

错误通过以下方式传播：

* 对请求的错误响应
* 传输上的错误事件
* 协议级错误处理程序

## 实现示例

以下是实现MCP服务器的基本示例：

<Tabs>
  <Tab title="TypeScript">
    ```typescript
    import { Server } from "@modelcontextprotocol/sdk/server/index.js";
    import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

    const server = new Server({
      name: "example-server",
      version: "1.0.0"
    }, {
      capabilities: {
        resources: {}
      }
    });

    // 处理请求
    server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: "example://resource",
            name: "示例资源"
          }
        ]
      };
    });

    // 连接传输
    const transport = new StdioServerTransport();
    await server.connect(transport);
    ```
  </Tab>

  <Tab title="Python">
    ```python
    import asyncio
    import mcp.types as types
    from mcp.server import Server
    from mcp.server.stdio import stdio_server

    app = Server("example-server")

    @app.list_resources()
    async def list_resources() -> list[types.Resource]:
        return [
            types.Resource(
                uri="example://resource",
                name="示例资源"
            )
        ]

    async def main():
        async with stdio_server() as streams:
            await app.run(
                streams[0],
                streams[1],
                app.create_initialization_options()
            )

    if __name__ == "__main__":
        asyncio.run(main)
    ```
  </Tab>
</Tabs>

## 最佳实践

### 传输选择

1. **本地通信**
   * 对本地进程使用stdio传输
   * 对同一机器上的通信高效
   * 简单的进程管理

2. **远程通信**
   * 对需要HTTP兼容性的场景使用SSE
   * 考虑安全影响，包括认证和授权

### 消息处理

1. **请求处理**
   * 彻底验证输入
   * 使用类型安全的模式
   * 优雅处理错误
   * 实现超时

2. **进度报告**
   * 对长操作使用进度令牌
   * 增量报告进度
   * 在已知时包含总进度

3. **错误管理**
   * 使用适当的错误代码
   * 包含有用的错误消息
   * 清理错误时的资源

## 安全考虑

1. **传输安全**
   * 对远程连接使用TLS
   * 验证连接来源
   * 在需要时实现认证

2. **消息验证**
   * 验证所有传入消息
   * 净化输入
   * 检查消息大小限制
   * 验证JSON-RPC格式

3. **资源保护**
   * 实现访问控制
   * 验证资源路径
   * 监控资源使用
   * 对请求进行速率限制

4. **错误处理**
   * 不泄漏敏感信息
   * 记录与安全相关的错误
   * 实现适当的清理
   * 处理DoS场景

## 调试和监控

1. **日志记录**
   * 记录协议事件
   * 跟踪消息流
   * 监控性能
   * 记录错误

2. **诊断**
   * 实现健康检查
   * 监控连接状态
   * 跟踪资源使用
   * 分析性能

3. **测试**
   * 测试不同传输
   * 验证错误处理
   * 检查边缘情况
   * 负载测试服务器 