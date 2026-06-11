import { z } from 'zod';

/**
 * Zod schemas for input validation
 */

export const CreateBranchSchema = z.object({
  branchName: z.string().describe('Name of the branch to create'),
  owner: z.string().optional().describe('Repository owner (defaults to env GITHUB_OWNER)'),
  repo: z.string().optional().describe('Repository name (defaults to env GITHUB_REPO)')
});

export const CommitChangesSchema = z.object({
  owner: z.string().optional().describe('Repository owner'),
  repo: z.string().optional().describe('Repository name'),
  branch: z.string().describe('Target branch for the commit'),
  message: z.string().describe('Commit message'),
  files: z.array(z.object({
    path: z.string().describe('File path relative to repository root'),
    content: z.string().describe('File content')
  })).describe('Array of files to commit')
});

export const ListRepositoriesSchema = z.object({
  username: z.string().optional().describe('GitHub username (omit for authenticated user)')
});

export const GetIssuesSchema = z.object({
  owner: z.string().optional().describe('Repository owner'),
  repo: z.string().optional().describe('Repository name'),
  state: z.enum(['open', 'closed', 'all']).default('open').describe('Issue state filter')
});

export const GetMergeConflictsSchema = z.object({
  owner: z.string().optional().describe('Repository owner'),
  repo: z.string().optional().describe('Repository name'),
  baseBranch: z.string().default('main').describe('Base branch for comparison'),
  headBranch: z.string().default('develop').describe('Head branch for comparison')
});

export const GetErrorsFromChecksSchema = z.object({
  owner: z.string().optional().describe('Repository owner'),
  repo: z.string().optional().describe('Repository name'),
  ref: z.string().default('HEAD').describe('Git reference (branch, tag, or SHA)')
});

/**
 * Type definitions for validated inputs
 */
export type CreateBranchInput = z.infer<typeof CreateBranchSchema>;
export type CommitChangesInput = z.infer<typeof CommitChangesSchema>;
export type ListRepositoriesInput = z.infer<typeof ListRepositoriesSchema>;
export type GetIssuesInput = z.infer<typeof GetIssuesSchema>;
export type GetMergeConflictsInput = z.infer<typeof GetMergeConflictsSchema>;
export type GetErrorsFromChecksInput = z.infer<typeof GetErrorsFromChecksSchema>;

/**
 * MCP Tool Definitions
 * These follow the MCP protocol specification for tool schemas
 */
export const GITHUB_MCP_TOOLS = [
  {
    name: 'create_branch',
    description: 'Create a new GitHub branch from the default or specified base branch. Returns branch details and base commit SHA.',
    inputSchema: {
      type: 'object',
      properties: {
        branchName: {
          type: 'string',
          description: 'Name of the branch to create (e.g., "feature/new-feature")'
        },
        owner: {
          type: 'string',
          description: 'Repository owner (defaults to GITHUB_OWNER environment variable)'
        },
        repo: {
          type: 'string',
          description: 'Repository name (defaults to GITHUB_REPO environment variable)'
        }
      },
      required: ['branchName']
    }
  },
  {
    name: 'commit_changes',
    description: 'Commit one or multiple files to a specific branch. Creates blobs, trees, and commits atomically.',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner'
        },
        repo: {
          type: 'string',
          description: 'Repository name'
        },
        branch: {
          type: 'string',
          description: 'Target branch for the commit'
        },
        message: {
          type: 'string',
          description: 'Commit message following conventional commits format'
        },
        files: {
          type: 'array',
          description: 'Array of files to commit',
          items: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'File path relative to repository root (e.g., "src/components/Button.tsx")'
              },
              content: {
                type: 'string',
                description: 'File content as a string'
              }
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
    description: 'List repositories for the authenticated user or a specific GitHub user. Returns repository metadata including stars, forks, and language.',
    inputSchema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'GitHub username (omit to list authenticated user\'s repositories)'
        }
      }
    }
  },
  {
    name: 'get_issues',
    description: 'Retrieve issues from a repository with optional state filtering. Returns issue details including number, title, labels, and assignees.',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner'
        },
        repo: {
          type: 'string',
          description: 'Repository name'
        },
        state: {
          type: 'string',
          enum: ['open', 'closed', 'all'],
          description: 'Filter issues by state',
          default: 'open'
        }
      }
    }
  },
  {
    name: 'get_merge_conflicts',
    description: 'Detect potential merge conflicts between two branches. Analyzes file changes and identifies conflicting modifications.',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner'
        },
        repo: {
          type: 'string',
          description: 'Repository name'
        },
        baseBranch: {
          type: 'string',
          description: 'Base branch for comparison',
          default: 'main'
        },
        headBranch: {
          type: 'string',
          description: 'Head branch to compare against base',
          default: 'develop'
        }
      }
    }
  },
  {
    name: 'get_errors_from_checks',
    description: 'Get CI/CD check run errors for a specific git reference. Retrieves failed checks from GitHub Actions and other CI systems.',
    inputSchema: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner'
        },
        repo: {
          type: 'string',
          description: 'Repository name'
        },
        ref: {
          type: 'string',
          description: 'Git reference (branch name, tag, or commit SHA)',
          default: 'HEAD'
        }
      }
    }
  }
] as const;
