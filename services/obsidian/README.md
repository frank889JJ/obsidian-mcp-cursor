# Obsidian MCP 服务

这是一个基于 [obsidian-mcp](https://github.com/StevenStavrakis/obsidian-mcp) 的 Obsidian 集成服务。

## 环境要求

- Node.js 20 或更高版本
- Obsidian
- 一个或多个 Obsidian 仓库（vault）

## 环境变量

- `OBSIDIAN_VAULT_PATH`: Obsidian 仓库路径（可选，默认为 `~/Documents/Obsidian/Vault`）
- `PORT`: 服务器端口（可选，默认为 3000）

## 安装

```bash
npm install
```

## 使用方法

### 基本用法

```bash
# 使用默认仓库路径（~/Documents/Obsidian/Vault）
node obsidian_mcp.js

# 指定一个仓库路径
node obsidian_mcp.js ~/Documents/Obsidian/MyVault

# 指定多个仓库路径
node obsidian_mcp.js ~/Documents/Obsidian/Work ~/Documents/Obsidian/Personal
```

### 仓库路径要求

- 路径必须指向有效的 Obsidian 仓库（包含 .obsidian 目录）
- 仓库必须至少在 Obsidian 中初始化过一次
- 路径必须具有读写权限
- 路径不能重叠（一个仓库不能在另一个仓库内）
- 每个仓库必须是独立的目录
- 最多可以同时连接 10 个仓库

### 推荐的仓库位置

- `~/Documents/Obsidian/[vault-name]`（推荐）
- `~/Notes/[vault-name]`（替代位置）
- `~/Obsidian/[vault-name]`（替代位置）

### 不支持的路径

- 网络驱动器（//server/share）
- 网络挂载点（/net, /mnt, /media）
- 系统目录（/tmp, C:\Windows）
- 隐藏目录（除了 .obsidian）
- 指向外部的符号链接

## 注意事项

1. 如果路径未被识别为有效的仓库，请先在 Obsidian 中打开它以进行初始化。
2. 仓库名称会自动从路径的最后一部分生成：
   - 空格和特殊字符会转换为连字符
   - 名称会转换为小写以保持一致性
   - 如果有重复，会自动添加数字（例如：'work-vault-1'）

## API 接口

### 创建笔记
- POST `/create_note`
```json
{
    "path": "笔记路径.md",
    "content": "笔记内容"
}
```

### 搜索笔记
- POST `/search`
```json
{
    "query": "搜索关键词"
}
```

### 获取笔记内容
- POST `/get_note`
```json
{
    "path": "笔记路径.md"
}
```

### 更新笔记
- POST `/update_note`
```json
{
    "path": "笔记路径.md",
    "content": "新的笔记内容"
}
```

### 删除笔记
- POST `/delete_note`
```json
{
    "path": "笔记路径.md"
}
```

### 列出所有笔记
- GET `/list_notes` 