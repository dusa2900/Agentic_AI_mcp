import * as githubTools from '../github/github.tools';

/**
 * GitHub MCP Agent Client
 * Provides a unified interface for all GitHub operations
 */
export class GitHubMCPAgent {
  private owner?: string;
  private repo?: string;

  constructor(owner?: string, repo?: string) {
    this.owner = owner;
    this.repo = repo;
  }

  /**
   * Create a new branch from the default branch
   */
  async createBranch(branchName: string) {
    return await githubTools.createBranch(branchName, this.owner, this.repo);
  }

  /**
   * Commit multiple files to a branch
   */
  async commit(
    branch: string,
    message: string,
    files: Array<{ path: string; content: string }>
  ) {
    return await githubTools.commitChanges({
      owner: this.owner,
      repo: this.repo,
      branch,
      message,
      files,
    });
  }

  /**
   * List repositories
   */
  async listRepositories(username?: string) {
    return await githubTools.listRepositories(username);
  }

  /**
   * Get issues from the repository
   */
  async getIssues(state: 'open' | 'closed' | 'all' = 'open') {
    return await githubTools.getIssues(this.owner, this.repo, state);
  }

  /**
   * Check for merge conflicts between branches
   */
  async checkMergeConflicts(baseBranch: string, headBranch: string) {
    return await githubTools.getMergeConflicts(
      this.owner,
      this.repo,
      baseBranch,
      headBranch
    );
  }

  /**
   * Get CI/CD errors from check runs
   */
  async getErrors(ref: string = 'HEAD') {
    return await githubTools.getErrorsFromChecks(this.owner, this.repo, ref);
  }

  /**
   * Full workflow: Create branch, commit changes, check for errors
   */
  async executeWorkflow(params: {
    featureName: string;
    commitMessage: string;
    files: Array<{ path: string; content: string }>;
    checkConflictsWithBranch?: string;
  }) {
    const results = {
      branch: null as any,
      commit: null as any,
      conflicts: null as any,
      errors: null as any,
      success: false,
      steps: [] as string[],
    };

    try {
      // Step 1: Create branch
      results.steps.push('Creating branch...');
      results.branch = await this.createBranch(params.featureName);
      if (!results.branch.success) {
        throw new Error(`Branch creation failed: ${results.branch.message}`);
      }
      results.steps.push(`✓ Branch '${params.featureName}' created`);

      // Step 2: Commit changes
      results.steps.push('Committing files...');
      results.commit = await this.commit(
        params.featureName,
        params.commitMessage,
        params.files
      );
      if (!results.commit.success) {
        throw new Error(`Commit failed: ${results.commit.message}`);
      }
      results.steps.push(`✓ Committed ${params.files.length} file(s)`);

      // Step 3: Check for merge conflicts (optional)
      if (params.checkConflictsWithBranch) {
        results.steps.push('Checking for merge conflicts...');
        results.conflicts = await this.checkMergeConflicts(
          params.checkConflictsWithBranch,
          params.featureName
        );
        if (results.conflicts.hasConflicts) {
          results.steps.push(
            `⚠ Warning: ${results.conflicts.conflicts.length} potential conflict(s) detected`
          );
        } else {
          results.steps.push('✓ No merge conflicts detected');
        }
      }

      // Step 4: Check for CI/CD errors
      results.steps.push('Checking CI/CD status...');
      results.errors = await this.getErrors(params.featureName);
      if (results.errors.hasErrors) {
        results.steps.push(`⚠ Warning: ${results.errors.errors.length} check(s) failed`);
      } else {
        results.steps.push('✓ All checks passed');
      }

      results.success = true;
      return results;
    } catch (error: any) {
      results.steps.push(`✗ Error: ${error.message}`);
      return results;
    }
  }

  /**
   * Dev Orchestrator integration: Handle stage-specific tasks
   */
  async handleStageTask(stage: string, context: any) {
    switch (stage) {
      case 'requirements':
        // Create feature branch based on user story
        return await this.createBranch(context.branchName || 'feature/new-task');

      case 'implementation':
        // Commit implementation files
        return await this.commit(
          context.branch,
          context.commitMessage || 'feat: implement feature',
          context.files
        );

      case 'testing':
        // Check for CI/CD errors
        return await this.getErrors(context.branch);

      case 'review':
        // Check for merge conflicts
        return await this.checkMergeConflicts(
          context.baseBranch || 'main',
          context.branch
        );

      default:
        return { success: false, message: `Unknown stage: ${stage}` };
    }
  }
}

// Factory function for easy instantiation
export function createGitHubAgent(owner?: string, repo?: string) {
  return new GitHubMCPAgent(owner, repo);
}

// Export individual functions for direct use
export {
  createBranch,
  commitChanges,
  listRepositories,
  getIssues,
  getMergeConflicts,
  getErrorsFromChecks,
} from '../github/github.tools';
