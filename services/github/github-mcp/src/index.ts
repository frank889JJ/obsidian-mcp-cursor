#!/usr/bin/env node

/**
 * This is a template MCP server that implements a simple notes system.
 * It demonstrates core MCP concepts like resources and tools by allowing:
 * - Listing notes as resources
 * - Reading individual notes
 * - Creating new notes via a tool
 * - Summarizing all notes via a prompt
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Octokit } from "@octokit/rest";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// GitHub API 认证
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN environment variable is required");
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

/**
 * Type alias for a GitHub repository object.
 */
type Repository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  private: boolean;
  created_at: string | null;
  updated_at: string | null;
  pushed_at: string | null;
  language: string | null;
};

/**
 * Create an MCP server with capabilities for resources (to list/read notes),
 * tools (to create new notes), and prompts (to summarize notes).
 */
const server = new Server(
  {
    name: "github-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

/**
 * Get user repositories from GitHub
 */
async function getUserRepositories(): Promise<Repository[]> {
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    per_page: 100,
    sort: 'updated',
    direction: 'desc'
  });
  return data;
}

/**
 * Handler for listing available GitHub repositories as resources.
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const repos = await getUserRepositories();
  return {
    resources: repos.map(repo => ({
      uri: `github://${repo.full_name}`,
      mimeType: "application/json",
      name: repo.name,
      description: repo.description || `GitHub repository: ${repo.full_name}`
    }))
  };
});

/**
 * Handler for reading repository details.
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const match = request.params.uri.match(/^github:\/\/([^\/]+)\/([^\/]+)$/);
  if (!match) {
    throw new Error(`Invalid GitHub repository URI: ${request.params.uri}`);
  }

  const [owner, repo] = match.slice(1);
  const { data } = await octokit.rest.repos.get({
    owner,
    repo
  });

  return {
    contents: [{
      uri: request.params.uri,
      mimeType: "application/json",
      text: JSON.stringify(data, null, 2)
    }]
  };
});

/**
 * Handler that lists available tools.
 * Exposes a single "create_issue" tool that lets clients create new GitHub issues.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_issue",
        description: "Create a new GitHub issue",
        inputSchema: {
          type: "object",
          properties: {
            repo: {
              type: "string",
              description: "Repository name (owner/repo)"
            },
            title: {
              type: "string",
              description: "Issue title"
            },
            body: {
              type: "string",
              description: "Issue description"
            }
          },
          required: ["repo", "title"]
        }
      }
    ]
  };
});

/**
 * Handler for the create_issue tool.
 * Creates a new GitHub issue with the provided details.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "create_issue": {
      const repo = String(request.params.arguments?.repo);
      const title = String(request.params.arguments?.title);
      const body = String(request.params.arguments?.body || '');

      if (!repo || !title) {
        throw new Error("Repository and title are required");
      }

      const [owner, repoName] = repo.split('/');
      if (!owner || !repoName) {
        throw new Error("Repository must be in format owner/repo");
      }

      const { data } = await octokit.rest.issues.create({
        owner,
        repo: repoName,
        title,
        body
      });

      return {
        content: [{
          type: "text",
          text: `Created issue #${data.number}: ${data.html_url}`
        }]
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * Handler that lists available prompts.
 * Exposes a single "summarize_repos" prompt that summarizes all repositories.
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "summarize_repos",
        description: "Summarize all GitHub repositories",
      }
    ]
  };
});

/**
 * Handler for the summarize_repos prompt.
 * Returns a prompt that requests summarization of all repositories.
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== "summarize_repos") {
    throw new Error("Unknown prompt");
  }

  const repos = await getUserRepositories();
  const embeddedRepos = repos.map(repo => ({
    type: "resource" as const,
    resource: {
      uri: `github://${repo.full_name}`,
      mimeType: "application/json",
      text: JSON.stringify({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        issues: repo.open_issues_count
      }, null, 2)
    }
  }));

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "Please summarize the following GitHub repositories:"
        }
      },
      ...embeddedRepos,
      {
        role: "user",
        content: {
          type: "text",
          text: "Provide a concise summary of all the repositories above."
        }
      }
    ]
  };
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  try {
    console.log("Starting GitHub MCP server...");
    const transport = new StdioServerTransport();
    console.log("Initializing transport...");
    await server.connect(transport);
    console.log("GitHub MCP server started successfully");
  } catch (error) {
    console.error("Server startup failed:", error);
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }
}

// Add process event listeners
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Start the server
main();
