# Quick Implementation Guide: Adding True MCP Support

## Step-by-Step: Convert to True MCP

### Step 1: Install MCP SDK

```bash
cd backend
npm install @modelcontextprotocol/sdk
```

### Step 2: Create MCP Server Structure

```bash
mkdir -p src/mcp/server
mkdir -p src/mcp/schemas
```

### Step 3: Create Tool Schemas

Create `backend/src/mcp/schemas/github-tools.schema.ts`:

```typescript
import { z } from 'zod';

// Input schemas for each tool
export const CreateBranchSchema = z.object({
  branchName: z.string().describe('Name of the branch to create'),
  owner: z.string().optional().describe('Repository owner'),
  repo: z.string().optional().describe('Repository name')
});

export const CommitChangesSchema = z.object({
  branch: z.string().describe('Target branch'),
  message: z.string().describe('Commit message'),
  files: z.array(z.object({
    path: z.string(),
    content: z.string()
  })).describe('Files to commit')
});

export const ListRepositoriesSchema = z.object({
  username: z.string().optional().describe('GitHub username')
});

export const GetIssuesSchema = z.object({
  owner: z.string().optional(),
  repo: z.string().optional(),
  state: z.enum(['open', 'closed', 'all']).default('open')
});

export const GetMergeConflictsSchema = z.object({
  owner: z.string().optional(),
  repo: z.string().optional(),
  baseBranch: z.string().default('main'),
  headBranch: z.string().default('develop')
});

export const GetErrorsSchema = z.object({
  owner: z.string().optional(),
  repo: z.string().optional(),
  ref: z.string().default('HEAD')
});

// Tool definitions for MCP
export const GITHUB_MCP_TOOLS = [
  {
    name: 'create_branch',
    description: 'Create a new GitHub branch from default or specified base branch',
    inputSchema: {
      type: 'object',
      properties: {
        branchName: { type: 'string', description: 'Name of the branch to create' },
        owner: { type: 'string', description: 'Repository owner (optional)' },
        repo: { type: 'string', description: 'Repository name (optional)' }
      },
      required: ['branchName']
    }
  },
  {
    name: 'commit_changes',
    description: 'Commit one or multiple files to a specific branch',
    inputSchema: {
      type: 'object',
      properties: {
        branch: { type: 'string', description: 'Target branch for commit' },
        message: { type: 'string', description: 'Commit message' },
        files: {
          type: 'array',
          description: 'Array of files to commit',
          items: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'File path' },
              content: { type: 'string', description: 'File content' }
            },
            required: ['path', 'content']
          }
        }
      },
      required: ['branch', 'message', 'files']
    }
  },
  {
    name: 'list_repositories',
    description: 'List repositories for authenticated user or a specific user',
    inputSchema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'GitHub username (optional)' }
      }
    }
  },
  {
    name: 'get_issues',
    description: 'Retrieve issues from a repository',
    inputSchema: {
      type: 'object',
      properties: {
        owner: { type: 'string', description: 'Repository owner (optional)' },
        repo: { type: 'string', description: 'Repository name (optional)' },
        state: {
          type: 'string',
          enum: ['open', 'closed', 'all'],
          description: 'Issue state filter',
          default: 'open'
        }
      }
    }
  },
  {
    name: 'get_merge_conflicts',
    description: 'Detect merge conflicts between two branches',
    inputSchema: {
      type: 'object',
      properties: {
        owner: { type: 'string', description: 'Repository owner (optional)' },
        repo: { type: 'string', description: 'Repository name (optional)' },
        baseBranch: { type: 'string', description: 'Base branch', default: 'main' },
        headBranch: { type: 'string', description: 'Head branch', default: 'develop' }
      }
    }
  },
  {
    name: 'get_errors_from_checks',
    description: 'Get CI/CD check run errors for a specific git reference',
    inputSchema: {
      type: 'object',
      properties: {
        owner: { type: 'string', description: 'Repository owner (optional)' },
        repo: { type: 'string', description: 'Repository name (optional)' },
        ref: { type: 'string', description: 'Git reference', default: 'HEAD' }
      }
    }
  }
];
```

### Step 4: Create MCP Server

Create `backend/src/mcp/server/github-mcp-server.ts`:

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

import * as githubTools from '../github/github.tools.js';
import { GITHUB_MCP_TOOLS } from '../schemas/github-tools.schema.js';

class GitHubMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'github-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: GITHUB_MCP_TOOLS
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_branch':
            const branchResult = await githubTools.createBranch(
              args.branchName,
              args.owner,
              args.repo
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(branchResult, null, 2)
                }
              ]
            };

          case 'commit_changes':
            const commitResult = await githubTools.commitChanges({
              owner: args.owner,
              repo: args.repo,
              branch: args.branch,
              message: args.message,
              files: args.files
            });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(commitResult, null, 2)
                }
              ]
            };

          case 'list_repositories':
            const reposResult = await githubTools.listRepositories(args.username);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(reposResult, null, 2)
                }
              ]
            };

          case 'get_issues':
            const issuesResult = await githubTools.getIssues(
              args.owner,
              args.repo,
              args.state || 'open'
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(issuesResult, null, 2)
                }
              ]
            };

          case 'get_merge_conflicts':
            const conflictsResult = await githubTools.getMergeConflicts(
              args.owner,
              args.repo,
              args.baseBranch || 'main',
              args.headBranch || 'develop'
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(conflictsResult, null, 2)
                }
              ]
            };

          case 'get_errors_from_checks':
            const errorsResult = await githubTools.getErrorsFromChecks(
              args.owner,
              args.repo,
              args.ref || 'HEAD'
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(errorsResult, null, 2)
                }
              ]
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: error.message
              }, null, 2)
            }
          ],
          isError: true
        };
      }
    });

    // List resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'github://issues',
          name: 'GitHub Issues',
          description: 'Access repository issues',
          mimeType: 'application/json'
        },
        {
          uri: 'github://repositories',
          name: 'GitHub Repositories',
          description: 'List of repositories',
          mimeType: 'application/json'
        }
      ]
    }));

    // Read resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      if (uri === 'github://issues') {
        const issues = await githubTools.getIssues(undefined, undefined, 'open');
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(issues, null, 2)
            }
          ]
        };
      } else if (uri === 'github://repositories') {
        const repos = await githubTools.listRepositories();
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(repos, null, 2)
            }
          ]
        };
      }

      throw new Error(`Unknown resource: ${uri}`);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GitHub MCP Server running on stdio');
  }
}

// Start server
const server = new GitHubMCPServer();
server.run().catch(console.error);
```

### Step 5: Update package.json Scripts

Add to `backend/package.json`:

```json
{
  "scripts": {
    "mcp:server": "ts-node src/mcp/server/github-mcp-server.ts",
    "mcp:build": "tsc -p . && node dist/mcp/server/github-mcp-server.js"
  }
}
```

### Step 6: Create MCP Configuration for Claude Desktop

Create `mcp-config.json` in project root:

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["backend/dist/mcp/server/github-mcp-server.js"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "GITHUB_OWNER": "${GITHUB_OWNER}",
        "GITHUB_REPO": "${GITHUB_REPO}"
      }
    }
  }
}
```

### Step 7: Create MCP Client Wrapper

Create `backend/src/mcp/client/mcp-client.ts`:

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export class GitHubMCPClient {
  private client: Client | null = null;

  async connect() {
    const transport = new StdioClientTransport({
      command: 'ts-node',
      args: ['src/mcp/server/github-mcp-server.ts']
    });

    this.client = new Client(
      {
        name: 'github-mcp-client',
        version: '1.0.0',
      },
      {
        capabilities: {}
      }
    );

    await this.client.connect(transport);
  }

  async listTools() {
    if (!this.client) throw new Error('Client not connected');
    return await this.client.listTools();
  }

  async callTool(name: string, args: any) {
    if (!this.client) throw new Error('Client not connected');
    return await this.client.callTool({ name, arguments: args });
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }
}

// Usage example
export async function testMCPClient() {
  const client = new GitHubMCPClient();
  
  try {
    await client.connect();
    
    // List available tools
    const tools = await client.listTools();
    console.log('Available tools:', tools);
    
    // Call a tool
    const result = await client.callTool('create_branch', {
      branchName: 'feature/mcp-test'
    });
    console.log('Result:', result);
    
  } finally {
    await client.disconnect();
  }
}
```

### Step 8: Test the MCP Server

Create `backend/src/mcp/server/test-server.ts`:

```typescript
import { testMCPClient } from '../client/mcp-client.js';

async function main() {
  console.log('Testing GitHub MCP Server...\n');
  
  try {
    await testMCPClient();
    console.log('\n✅ MCP Server test passed!');
  } catch (error) {
    console.error('\n❌ MCP Server test failed:', error);
    process.exit(1);
  }
}

main();
```

Run test:
```bash
npm run mcp:server  # In one terminal
npm run test:mcp    # In another terminal
```

---

## Summary

After these steps, you'll have:
- ✅ True MCP protocol implementation
- ✅ Standardized tool exposure
- ✅ JSON-RPC communication
- ✅ Compatible with Claude Desktop and other MCP clients
- ✅ Discoverable tools with schemas
- ✅ Resource providers

Your existing tool implementations remain unchanged - we just wrap them with the MCP protocol layer!
