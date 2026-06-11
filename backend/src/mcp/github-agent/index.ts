/**
 * GitHub MCP Agent - Main Entry Point
 * 
 * This module provides a comprehensive GitHub Model Context Protocol (MCP) agent
 * for managing GitHub operations including branches, commits, issues, and CI/CD monitoring.
 */

export { 
  GitHubMCPAgent, 
  createGitHubAgent 
} from './client';

export {
  createBranch,
  commitChanges,
  listRepositories,
  getIssues,
  getMergeConflicts,
  getErrorsFromChecks
} from '../github/github.tools';

// Type definitions
export interface BranchResult {
  success: boolean;
  message: string;
  branch?: string;
  baseSha?: string;
  error?: string;
}

export interface CommitResult {
  success: boolean;
  message: string;
  commitSha?: string;
  filesCommitted?: string[];
  error?: string;
}

export interface RepositoryInfo {
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
}

export interface RepositoriesResult {
  success: boolean;
  repositories?: RepositoryInfo[];
  count?: number;
  message?: string;
  error?: string;
}

export interface IssueInfo {
  number: number;
  title: string;
  body: string | null;
  state: string;
  labels: string[];
  assignees: string[];
  createdAt: string;
  updatedAt: string;
  url: string;
  author?: string;
}

export interface IssuesResult {
  success: boolean;
  issues?: IssueInfo[];
  count?: number;
  message?: string;
  error?: string;
}

export interface ConflictInfo {
  path: string;
  conflictType: string;
  base?: string;
  head?: string;
}

export interface MergeConflictsResult {
  success: boolean;
  hasConflicts?: boolean;
  status?: string;
  ahead_by?: number;
  behind_by?: number;
  conflicts?: ConflictInfo[];
  totalCommits?: number;
  message: string;
  error?: string;
}

export interface CheckError {
  name: string;
  status: string;
  conclusion: string | null;
  startedAt: string | null;
  completedAt: string | null;
  url: string;
  output: string;
}

export interface ErrorsResult {
  success: boolean;
  hasErrors?: boolean;
  errors?: CheckError[];
  totalChecks?: number;
  message: string;
  error?: string;
}

export interface WorkflowParams {
  featureName: string;
  commitMessage: string;
  files: Array<{ path: string; content: string }>;
  checkConflictsWithBranch?: string;
}

export interface WorkflowResult {
  branch: BranchResult | null;
  commit: CommitResult | null;
  conflicts: MergeConflictsResult | null;
  errors: ErrorsResult | null;
  success: boolean;
  steps: string[];
}

// Re-export example functions
export {
  example1_BasicWorkflow,
  example2_FullFeatureWorkflow,
  example3_MonitorIssuesAndErrors,
  example4_CheckMergeConflicts,
  example5_ListRepositories,
  example6_DevOrchestratorIntegration
} from './examples';
