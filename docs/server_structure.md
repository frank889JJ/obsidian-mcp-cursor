# MCP 服务器结构与代码关系说明

## 1. 项目结构

```
mcp/
├── src/
│   ├── server.py          # 服务器主程序
│   └── test_client.py     # 测试客户端
├── docs/
│   └── server_structure.md # 本文档
└── venv/                  # Python 虚拟环境
```

## 2. 核心组件

### 2.1 服务器主程序 (server.py)

#### MCPServer 类
- **职责**：管理 MCP 服务器的生命周期和功能
- **主要方法**：
  - `__init__(name)`: 初始化服务器，设置服务器名称
  - `initialize()`: 初始化服务器功能，注册工具处理程序
  - `run()`: 运行服务器，处理标准输入输出流

#### 工具处理
1. **工具列表处理**
   ```python
   @self.server.list_tools()
   async def list_tools() -> list[types.Tool]
   ```
   - 返回可用工具列表
   - 当前实现：返回 echo 工具的定义

2. **工具调用处理**
   ```python
   @self.server.call_tool()
   async def call_tool(name: str, arguments: dict) -> list[types.TextContent]
   ```
   - 处理工具调用请求
   - 当前实现：处理 echo 工具的调用

### 2.2 测试客户端 (test_client.py)

#### 主要功能
- 创建并管理服务器进程
- 建立客户端会话
- 测试服务器功能

#### 关键组件
1. **会话管理**
   ```python
   async with ClientSession(read_stream, write_stream) as session
   ```
   - 管理客户端与服务器的通信会话

2. **超时处理**
   ```python
   async with asyncio.timeout(seconds)
   ```
   - 为各种操作添加超时限制
   - 会话初始化：10秒
   - 工具列表获取：5秒
   - 工具调用：5秒

## 3. 通信流程

1. **服务器启动**
   - 初始化 MCPServer 实例
   - 注册工具处理程序
   - 启动标准输入输出服务器

2. **客户端连接**
   - 创建服务器进程
   - 建立客户端会话
   - 初始化会话

3. **工具交互**
   - 获取可用工具列表
   - 调用特定工具
   - 处理工具响应

## 4. 错误处理

### 4.1 服务器端
- 使用 try-except 块捕获异常
- 详细的日志记录
- 优雅的错误响应

### 4.2 客户端
- 超时处理
- 异常捕获和日志记录
- 信号处理（SIGINT, SIGTERM）

## 5. 日志系统

### 5.1 配置
```python
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
```

### 5.2 日志级别
- DEBUG: 详细调试信息
- INFO: 重要操作信息
- ERROR: 错误信息

## 6. 使用说明

### 6.1 启动服务器
```bash
source venv/bin/activate
python src/server.py
```

### 6.2 运行测试
```bash
source venv/bin/activate
python src/test_client.py
```

## 7. 注意事项

1. **依赖管理**
   - 需要激活虚拟环境
   - 确保所有依赖包已安装

2. **错误处理**
   - 服务器异常会记录到日志
   - 客户端超时会抛出 TimeoutError

3. **资源管理**
   - 使用 async with 确保资源正确释放
   - 正确处理进程和会话的生命周期

## 8. 扩展建议

1. **添加新工具**
   - 在 `list_tools()` 中添加工具定义
   - 在 `call_tool()` 中实现工具逻辑

2. **增强错误处理**
   - 添加更多异常类型
   - 实现重试机制

3. **改进日志系统**
   - 添加文件日志
   - 实现日志轮转

## 9. 错误记录与解决方案

### 9.1 初始化错误

1. **InitializationOptions 错误**
   ```python
   AttributeError: 'InitializationOptions' object has no attribute 'server_name'
   ```
   - **原因**：服务器初始化时使用了错误的初始化选项格式
   - **解决方案**：
     ```python
     # 修改前
     initialization_options = InitializationOptions()
     
     # 修改后
     initialization_options = create_initialization_options()
     ```

2. **Server 初始化错误**
   ```python
   TypeError: Server.__init__() received an unexpected keyword argument 'capabilities'
   ```
   - **原因**：Python 版本的 MCP 服务器实现与 TypeScript 版本不同
   - **解决方案**：
     ```python
     # 修改前
     self.server = Server(name=name, capabilities={"tools": True})
     
     # 修改后
     self.server = Server(name=name)
     ```

### 9.2 工具调用错误

1. **工具调用结果访问错误**
   ```python
   TypeError: 'CallToolResult' object is not subscriptable
   ```
   - **原因**：错误地尝试使用索引访问 CallToolResult 对象
   - **解决方案**：
     ```python
     # 修改前
     result[0].text
     
     # 修改后
     result.content[0].text
     ```

2. **工具参数验证错误**
   ```python
   ValidationError: Invalid input for tool 'echo'
   ```
   - **原因**：工具参数验证失败
   - **解决方案**：
     ```python
     # 修改前
     schema = {
         "type": "object",
         "properties": {
             "message": {"type": "string"}
         }
     }
     
     # 修改后
     inputSchema = {
         "type": "object",
         "properties": {
             "message": {"type": "string"}
         }
     }
     ```

### 9.3 会话管理错误

1. **会话初始化超时**
   ```python
   TimeoutError: Session initialization timed out after 10 seconds
   ```
   - **原因**：会话初始化时间过长
   - **解决方案**：
     - 增加超时时间
     - 优化初始化流程
     - 添加重试机制

2. **会话关闭错误**
   ```python
   RuntimeError: Session is already closed
   ```
   - **原因**：尝试在会话关闭后进行操作
   - **解决方案**：
     - 使用 async with 上下文管理器
     - 确保会话状态检查

### 9.4 进程管理错误

1. **进程清理错误**
   ```python
   ProcessLookupError: [Errno 3] No such process
   ```
   - **原因**：尝试终止已结束的进程
   - **解决方案**：
     ```python
     try:
         process.terminate()
     except ProcessLookupError:
         pass
     ```

### 9.5 日志配置错误

1. **日志重复输出**
   - **原因**：多次调用 basicConfig
   - **解决方案**：
     ```python
     if not logging.getLogger().handlers:
         logging.basicConfig(
             level=logging.DEBUG,
             format='%(asctime)s - %(levelname)s - %(message)s'
         )
     ```

### 9.6 最佳实践总结

1. **错误处理原则**
   - 使用 try-except 块捕获特定异常
   - 提供详细的错误信息
   - 实现优雅的降级策略

2. **调试技巧**
   - 使用详细的日志记录
   - 添加断点进行调试
   - 使用测试用例验证修复

3. **预防措施**
   - 代码审查
   - 单元测试
   - 集成测试
   - 持续集成

## 10. Cursor 集成指南

### 10.1 启用 MCP 服务器

1. **启动服务器**
   ```bash
   source venv/bin/activate
   python src/server.py
   ```

2. **重启 Cursor**
   - 完全关闭 Cursor
   - 重新启动 Cursor
   - 等待 Cursor 完全加载

3. **验证服务器状态**
   - 打开 Cursor 设置
   - 导航到 MCP 设置页面
   - 检查服务列表
   - 确认服务状态

### 10.2 使用 Echo 工具

1. **访问 AI 助手**
   - 打开任意文件
   - 使用快捷键 `Cmd + Shift + A`（Mac）或 `Ctrl + Shift + A`（Windows）
   - 或点击左侧边栏的 AI 助手图标

2. **发送消息**
   - 在 AI 助手对话框中输入消息
   - AI 助手会使用 echo 工具响应
   - 响应格式：`Echo: [您的消息]`

### 10.3 常见问题

1. **服务器未显示**
   - 确保服务器正在运行
   - 检查 Cursor 的 MCP 设置
   - 尝试重新启动 Cursor

2. **工具无响应**
   - 检查服务器日志
   - 确认服务器进程是否存活
   - 验证网络连接状态

3. **连接问题**
   - 检查防火墙设置
   - 确认端口未被占用
   - 验证服务器配置

### 10.4 最佳实践

1. **服务器管理**
   - 使用虚拟环境运行服务器
   - 保持服务器日志可见
   - 定期检查服务器状态

2. **开发流程**
   - 先启动服务器
   - 再启动 Cursor
   - 最后测试工具功能

3. **调试建议**
   - 查看服务器日志
   - 使用测试客户端验证
   - 检查 Cursor 控制台输出

- 检查服务状态
- 查看日志输出 
   