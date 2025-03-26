import mcp
import inspect

# 查看stdio_client的源代码
print("===== stdio_client 源代码 =====")
try:
    print(inspect.getsource(mcp.stdio_client))
except Exception as e:
    print("无法获取源代码:", e)
    
# 查看参数
print("\n===== stdio_client 参数 =====")
try:
    print(inspect.signature(mcp.stdio_client))
    for param in inspect.signature(mcp.stdio_client).parameters.values():
        print(f"{param.name}: {param.default}")
except Exception as e:
    print("无法获取参数:", e)
    
# 查看StdioServerParameters
print("\n===== StdioServerParameters =====")
try:
    print(inspect.getsource(mcp.StdioServerParameters))
except Exception as e:
    print("无法获取源代码:", e)
    
# 查看其他相关信息
print("\n===== 相关类型 =====")
for name in dir(mcp):
    if "stdio" in name.lower() or "client" in name.lower():
        print(name) 