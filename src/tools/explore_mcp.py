import sys
print("Python路径:", sys.path)

try:
    import mcp
    print("成功导入mcp模块")
    print("可用模块:", dir(mcp))
    
    try:
        from mcp.client import Client
        print("成功导入Client类")
    except ImportError as e:
        print("导入Client失败:", e)
    
    try:
        from mcp.client import client
        print("成功导入client函数")
    except ImportError as e:
        print("导入client失败:", e)
        
    try:
        from mcp.server import Server
        print("成功导入Server类")
    except ImportError as e:
        print("导入Server失败:", e)
        
except ImportError as e:
    print("导入mcp失败:", e)
    print("请确认已安装mcp包并激活虚拟环境") 