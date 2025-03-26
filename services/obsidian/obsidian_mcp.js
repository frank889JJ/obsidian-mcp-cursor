#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// 获取默认的 Obsidian 仓库路径
const defaultVaultPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Documents/Obsidian/Vault');

// 从命令行参数获取仓库路径，如果没有提供则使用默认路径
const vaultPaths = process.argv.slice(2);
if (vaultPaths.length === 0) {
    vaultPaths.push(defaultVaultPath);
}

// 启动 obsidian-mcp 进程
const mcpProcess = spawn('npx', [
    'obsidian-mcp',
    ...vaultPaths
], {
    stdio: 'inherit',
    shell: true
});

// 处理进程事件
mcpProcess.on('error', (err) => {
    console.error('启动 obsidian-mcp 失败:', err);
    process.exit(1);
});

mcpProcess.on('exit', (code) => {
    if (code !== 0) {
        console.error(`obsidian-mcp 进程异常退出，退出码: ${code}`);
        process.exit(code);
    }
}); 