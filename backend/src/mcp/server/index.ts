#!/usr/bin/env node

/**
 * GitHub MCP Server
 * 
 * A Model Context Protocol (MCP) server that exposes GitHub operations as tools.
 * This server follows the MCP specification and provides standardized access to
 * GitHub API operations including branch management, commits, issues, and CI/CD monitoring.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

import * as githubTools from '../github/github.tools';
import { GITHUB_MCP_TOOLS } from '../schemas/github-tools.schema';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from backend directory
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

/**
 * GitHub MCP Server Class
 * Implements the MCP protocol for GitHub operations
 */
class GitHubMCPServer {
  private server: Server;

  constructor() {
    // Initialize MCP server with metadata
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
    this.setupErrorHandling();
  }

  /**
   * Set up protocol request handlers
   */
  private setupHandlers(): void {
    // Handler: List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: GITHUB_MCP_TOOLS
      };
    });

    // Handler: Execute tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Validate environment variables for GitHub operations
        if (!process.env.GITHUB_TOKEN) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'GITHUB_TOKEN environment variable is not set'
          );
        }

        // Route tool calls to appropriate handlers
        switch (name) {
          case 'create_branch':
            return await this.handleCreateBranch(args);

          case 'commit_changes':
            return await this.handleCommitChanges(args);

          case 'list_repositories':
            return await this.handleListRepositories(args);

          case 'get_issues':
            return await this.handleGetIssues(args);

          case 'get_merge_conflicts':
            return await this.handleGetMergeConflicts(args);

          case 'get_errors_from_checks':
            return await this.handleGetErrorsFromChecks(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error: any) {
        // Handle MCP errors
        if (error instanceof McpError) {
          throw error;
        }

        // Wrap other errors in MCP error format
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`,
          error
        );
      }
    });

    // Handler: List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'github://issues',
            name: 'GitHub Issues',
            description: 'Access to repository issues (open by default)',
            mimeType: 'application/json'
          },
          {
            uri: 'github://repositories',
            name: 'GitHub Repositories',
            description: 'List of accessible repositories',
            mimeType: 'application/json'
          },
          {
            uri: 'github://checks',
            name: 'CI/CD Checks',
            description: 'Status of CI/CD check runs',
            mimeType: 'application/json'
          }
        ]
      };
    });

    // Handler: Read resource contents
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      try {
        let data: any;

        switch (uri) {
          case 'github://issues':
            data = await githubTools.getIssues(undefined, undefined, 'open');
            break;

          case 'github://repositories':
            data = await githubTools.listRepositories();
            break;

          case 'github://checks':
            data = await githubTools.getErrorsFromChecks(undefined, undefined, 'HEAD');
            break;

          default:
            throw new McpError(
              ErrorCode.InvalidRequest,
              `Unknown resource URI: ${uri}`
            );
        }

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      } catch (error: any) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to read resource: ${error.message}`,
          error
        );
      }
    });
  }

  /**
   * Set up global error handling
   */
  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Tool Handler: Create Branch
   */
  private async handleCreateBranch(args: any) {
    const result = await githubTools.createBranch(
      args.branchName,
      args.owner,
      args.repo
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  /**
   * Tool Handler: Commit Changes
   */
  private async handleCommitChanges(args: any) {
    const result = await githubTools.commitChanges({
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
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  /**
   * Tool Handler: List Repositories
   */
  private async handleListRepositories(args: any) {
    const result = await githubTools.listRepositories(args.username);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  /**
   * Tool Handler: Get Issues
   */
  private async handleGetIssues(args: any) {
    const result = await githubTools.getIssues(
      args.owner,
      args.repo,
      args.state || 'open'
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  /**
   * Tool Handler: Get Merge Conflicts
   */
  private async handleGetMergeConflicts(args: any) {
    const result = await githubTools.getMergeConflicts(
      args.owner,
      args.repo,
      args.baseBranch || 'main',
      args.headBranch || 'develop'
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  /**
   * Tool Handler: Get Errors from Checks
   */
  private async handleGetErrorsFromChecks(args: any) {
    const result = await githubTools.getErrorsFromChecks(
      args.owner,
      args.repo,
      args.ref || 'HEAD'
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  /**
   * Start the MCP server with stdio transport
   */
  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    // Log to stderr (stdout is used for protocol communication)
    console.error('GitHub MCP Server running on stdio');
    console.error('Server capabilities:', {
      tools: GITHUB_MCP_TOOLS.length,
      resources: 3
    });
  }
}

/**
 * Main entry point
 */
async function main() {
  try {
    const server = new GitHubMCPServer();
    await server.run();
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Start server if run directly
if (require.main === module) {
  main();
}

export { GitHubMCPServer };
