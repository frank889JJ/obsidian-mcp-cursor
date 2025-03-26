#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 检查 Node.js 版本
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 20) {
    console.error('需要 Node.js 20 或更高版本');
    process.exit(1);
}

// 检查 Obsidian 是否安装
const homeDir = process.env.HOME || process.env.USERPROFILE;
const defaultVaultPath = path.join(homeDir, 'Documents/Obsidian/Vault');

if (!fs.existsSync(defaultVaultPath)) {
    console.log('创建默认 Obsidian 仓库目录...');
    fs.mkdirSync(defaultVaultPath, { recursive: true });
}

// 安装全局依赖
console.log('安装 obsidian-mcp...');
try {
    execSync('npm install -g obsidian-mcp', { stdio: 'inherit' });
} catch (error) {
    console.error('安装 obsidian-mcp 失败:', error);
    process.exit(1);
}

// 创建配置目录
const configDir = path.join(process.cwd(), 'config');
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
}

// 创建配置文件
const configPath = path.join(configDir, 'obsidian-mcp.json');
const config = {
    mcpServers: {
        obsidian: {
            command: 'npx',
            args: ['-y', 'obsidian-mcp', defaultVaultPath],
            env: {
                OBSIDIAN_VAULT: defaultVaultPath
            }
        }
    }
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('配置文件已创建:', configPath);

console.log('\n安装完成！');
console.log('下一步：');
console.log('1. 打开 Obsidian 并初始化仓库');
console.log('2. 重启 Cursor IDE');
console.log('3. 开始使用 Obsidian MCP 功能');