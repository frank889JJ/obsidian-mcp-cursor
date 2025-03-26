import mcp
import inspect

# 查看ClientSession的初始化方法
print("===== ClientSession初始化方法 =====")
try:
    # 获取ClientSession类的init方法
    init_method = mcp.ClientSession.__init__
    print(inspect.signature(init_method))
    print(inspect.getsource(init_method))
except Exception as e:
    print("无法获取ClientSession.__init__:", e)

print("\n===== ClientSession的方法 =====")
for name in dir(mcp.ClientSession):
    if not name.startswith("_") or name == "__init__":
        try:
            attr = getattr(mcp.ClientSession, name)
            if callable(attr):
                print(f"{name}: {inspect.signature(attr)}")
        except (ValueError, TypeError):
            print(f"{name}: 无法获取签名")

# 查看mcp模块中的Client相关导出
print("\n===== mcp模块中的Client相关 =====")
for name in dir(mcp):
    if "client" in name.lower():
        print(name) 