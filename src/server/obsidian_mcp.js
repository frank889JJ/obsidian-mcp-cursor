#!/usr/bin/env node

const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const path = require('path');
const fs = require('fs');

class ObsidianMcpServer {
    constructor() {
        this.server = new McpServer({
            name: "Obsidian MCP",
            version: "1.0.0",
        });

        this.vaultPath = process.env.OBSIDIAN_VAULT || this.getDefaultVaultPath();
        this.validateVaultPath();
    }

    getDefaultVaultPath() {
        return path.join(
            process.env.HOME || process.env.USERPROFILE,
            'Documents/Obsidian/Vault'
        );
    }

    validateVaultPath() {
        if (!fs.existsSync(this.vaultPath)) {
            throw new Error(`Obsidian vault not found at: ${this.vaultPath}`);
        }

        const obsidianDir = path.join(this.vaultPath, '.obsidian');
        if (!fs.existsSync(obsidianDir)) {
            throw new Error(`Not a valid Obsidian vault: ${this.vaultPath} (missing .obsidian directory)`);
        }
    }

    async start() {
        // 注册工具
        this.server.addTool({
            name: 'obsidian.search',
            description: '搜索 Obsidian 笔记',
            parameters: {
                query: { type: 'string', description: '搜索关键词' }
            },
            handler: async ({ query }) => {
                // 实现搜索逻辑
                return { results: [] };
            }
        });

        this.server.addTool({
            name: 'obsidian.createNote',
            description: '创建新的笔记',
            parameters: {
                title: { type: 'string', description: '笔记标题' },
                content: { type: 'string', description: '笔记内容' }
            },
            handler: async ({ title, content }) => {
                const filePath = path.join(this.vaultPath, `${title}.md`);
                fs.writeFileSync(filePath, content, 'utf8');
                return { success: true, path: filePath };
            }
        });

        this.server.addTool({
            name: 'obsidian.readNote',
            description: '读取笔记内容',
            parameters: {
                path: { type: 'string', description: '笔记路径' }
            },
            handler: async ({ path: notePath }) => {
                const fullPath = path.join(this.vaultPath, notePath);
                if (!fs.existsSync(fullPath)) {
                    throw new Error(`Note not found: ${notePath}`);
                }
                const content = fs.readFileSync(fullPath, 'utf8');
                return { content };
            }
        });

        // 启动服务器
        const transport = new StdioServerTransport();
        await this.server.listen(transport);

        // 发送就绪通知
        this.server.log('info', 'Obsidian MCP server ready');
    }
}

// 启动服务器
const server = new ObsidianMcpServer();
server.start().catch(error => {
    console.error('Failed to start Obsidian MCP server:', error);
    process.exit(1);
});