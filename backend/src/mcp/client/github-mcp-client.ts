/**
 * GitHub MCP Client
 * 
 * A client implementation for connecting to the GitHub MCP Server.
 * This client can be used for testing or integration with other applications.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import * as path from 'path';

/**
 * GitHub MCP Client Class
 * Provides a convenient interface for interacting with the GitHub MCP Server
 */
export class GitHubMCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;

  /**
   * Connect to the GitHub MCP Server
   */
  async connect(): Promise<void> {
    // Determine server path
    const serverPath = path.resolve(__dirname, '../server/index.ts');
    
    // Use node with ts-node/register to avoid spawn issues on Windows
    const nodeExecutable = process.execPath;
    const tsNodeRegister = path.resolve(__dirname, '../../../node_modules/ts-node/register/index.js');

    // Create transport with stdio
    this.transport = new StdioClientTransport({
      command: nodeExecutable,
      args: [
        '--require',
        tsNodeRegister,
        serverPath
      ],
      env: {
        ...process.env,
        NODE_ENV: 'production',
        TS_NODE_PROJECT: path.resolve(__dirname, '../../../tsconfig.json')
      }
    });

    // Create MCP client
    this.client = new Client(
      {
        name: 'github-mcp-client',
        version: '1.0.0',
      },
      {
        capabilities: {}
      }
    );

    // Connect to server
    await this.client.connect(this.transport);
  }

  /**
   * List all available tools
   */
  async listTools(): Promise<any> {
    if (!this.client) {
      throw new Error('Client not connected. Call connect() first.');
    }

    return await this.client.listTools();
  }

  /**
   * List all available resources
   */
  async listResources(): Promise<any> {
    if (!this.client) {
      throw new Error('Client not connected. Call connect() first.');
    }

    return await this.client.listResources();
  }

  /**
   * Read a resource
   */
  async readResource(uri: string): Promise<any> {
    if (!this.client) {
      throw new Error('Client not connected. Call connect() first.');
    }

    return await this.client.readResource({ uri });
  }

  /**
   * Call a tool by name with arguments
   */
  async callTool(name: string, args: any): Promise<any> {
    if (!this.client) {
      throw new Error('Client not connected. Call connect() first.');
    }

    return await this.client.callTool({
      name,
      arguments: args
    });
  }

  /**
   * Convenience method: Create a branch
   */
  async createBranch(branchName: string, owner?: string, repo?: string): Promise<any> {
    return await this.callTool('create_branch', {
      branchName,
      owner,
      repo
    });
  }

  /**
   * Convenience method: Commit changes
   */
  async commitChanges(options: {
    branch: string;
    message: string;
    files: Array<{ path: string; content: string }>;
    owner?: string;
    repo?: string;
  }): Promise<any> {
    return await this.callTool('commit_changes', options);
  }

  /**
   * Convenience method: List repositories
   */
  async listRepositories(username?: string): Promise<any> {
    return await this.callTool('list_repositories', { username });
  }

  /**
   * Convenience method: Get issues
   */
  async getIssues(owner?: string, repo?: string, state: 'open' | 'closed' | 'all' = 'open'): Promise<any> {
    return await this.callTool('get_issues', { owner, repo, state });
  }

  /**
   * Convenience method: Check merge conflicts
   */
  async getMergeConflicts(
    baseBranch: string,
    headBranch: string,
    owner?: string,
    repo?: string
  ): Promise<any> {
    return await this.callTool('get_merge_conflicts', {
      baseBranch,
      headBranch,
      owner,
      repo
    });
  }

  /**
   * Convenience method: Get errors from checks
   */
  async getErrorsFromChecks(ref: string = 'HEAD', owner?: string, repo?: string): Promise<any> {
    return await this.callTool('get_errors_from_checks', {
      ref,
      owner,
      repo
    });
  }

  /**
   * Disconnect from the server
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.transport = null;
    }
  }
}

/**
 * Factory function to create and connect a client
 */
export async function createGitHubMCPClient(): Promise<GitHubMCPClient> {
  const client = new GitHubMCPClient();
  await client.connect();
  return client;
}
