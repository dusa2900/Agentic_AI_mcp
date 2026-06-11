import { github } from "./github.service";

interface CommitOptions {
  owner?: string;
  repo?: string;
  branch: string;
  message: string;
  files: Array<{
    path: string;
    content: string;
  }>;
}

interface MergeConflictInfo {
  path: string;
  conflictType: string;
  base?: string;
  head?: string;
}

export async function createBranch(
  branchName: string,
  owner?: string,
  repo?: string
) {
  const repoOwner = owner || process.env.GITHUB_OWNER!;
  const repoName = repo || process.env.GITHUB_REPO!;

  const repoInfo =
    await github.repos.get({
      owner: repoOwner,
      repo: repoName,
    });

  const defaultBranch =
    repoInfo.data.default_branch;

  const branchInfo =
    await github.repos.getBranch({
      owner: repoOwner,
      repo: repoName,
      branch: defaultBranch,
    });

  const sha =
    branchInfo.data.commit.sha;

  await github.git.createRef({
    owner: repoOwner,
    repo: repoName,
    ref: `refs/heads/${branchName}`,
    sha,
  });

  return { 
    success: true, 
    message: `Branch '${branchName}' created successfully`,
    branch: branchName,
    baseSha: sha
  };
}

export async function commitChanges(options: CommitOptions) {
  const owner = options.owner || process.env.GITHUB_OWNER!;
  const repo = options.repo || process.env.GITHUB_REPO!;
  const { branch, message, files } = options;

  try {
    // Get the current commit SHA of the branch
    const branchRef = await github.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    const currentCommitSha = branchRef.data.object.sha;

    // Get the current commit to get the tree SHA
    const currentCommit = await github.git.getCommit({
      owner,
      repo,
      commit_sha: currentCommitSha,
    });

    const currentTreeSha = currentCommit.data.tree.sha;

    // Create blobs for each file
    const blobs = await Promise.all(
      files.map(async (file) => {
        const blob = await github.git.createBlob({
          owner,
          repo,
          content: Buffer.from(file.content).toString('base64'),
          encoding: 'base64',
        });
        return {
          path: file.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.data.sha,
        };
      })
    );

    // Create a new tree
    const newTree = await github.git.createTree({
      owner,
      repo,
      base_tree: currentTreeSha,
      tree: blobs,
    });

    // Create a new commit
    const newCommit = await github.git.createCommit({
      owner,
      repo,
      message,
      tree: newTree.data.sha,
      parents: [currentCommitSha],
    });

    // Update the branch reference
    await github.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.data.sha,
    });

    return {
      success: true,
      message: `Successfully committed ${files.length} file(s) to ${branch}`,
      commitSha: newCommit.data.sha,
      filesCommitted: files.map(f => f.path),
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to commit changes: ${error.message}`,
      error: error.message,
    };
  }
}

export async function listRepositories(username?: string) {
  try {
    if (username) {
      // List public repos for a specific user
      const response = await github.repos.listForUser({ username });
      return {
        success: true,
        repositories: response.data.map(repo => ({
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          private: repo.private,
          url: repo.html_url,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updatedAt: repo.updated_at,
        })),
        count: response.data.length,
      };
    } else {
      // List repos for authenticated user
      const response = await github.repos.listForAuthenticatedUser();
      return {
        success: true,
        repositories: response.data.map(repo => ({
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          private: repo.private,
          url: repo.html_url,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updatedAt: repo.updated_at,
        })),
        count: response.data.length,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to list repositories: ${error.message}`,
      error: error.message,
    };
  }
}

export async function getIssues(owner?: string, repo?: string, state: 'open' | 'closed' | 'all' = 'open') {
  const repoOwner = owner || process.env.GITHUB_OWNER!;
  const repoName = repo || process.env.GITHUB_REPO!;

  try {
    const response = await github.issues.listForRepo({
      owner: repoOwner,
      repo: repoName,
      state,
    });

    return {
      success: true,
      issues: response.data.map(issue => ({
        number: issue.number,
        title: issue.title,
        body: issue.body,
        state: issue.state,
        labels: issue.labels.map((label: any) => 
          typeof label === 'string' ? label : label.name
        ),
        assignees: issue.assignees?.map(a => a.login) || [],
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        url: issue.html_url,
        author: issue.user?.login,
      })),
      count: response.data.length,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to get issues: ${error.message}`,
      error: error.message,
    };
  }
}

export async function getMergeConflicts(
  owner?: string,
  repo?: string,
  baseBranch?: string,
  headBranch?: string
) {
  const repoOwner = owner || process.env.GITHUB_OWNER!;
  const repoName = repo || process.env.GITHUB_REPO!;
  const base = baseBranch || 'main';
  const head = headBranch || 'develop';

  try {
    // Compare two branches
    const comparison = await github.repos.compareCommitsWithBasehead({
      owner: repoOwner,
      repo: repoName,
      basehead: `${base}...${head}`,
    });

    const conflicts: MergeConflictInfo[] = [];
    
    // Check if branches can be merged
    if (comparison.data.status === 'diverged') {
      // Get files with potential conflicts
      const files = comparison.data.files || [];
      
      for (const file of files) {
        if (file.status === 'modified' || file.status === 'renamed') {
          conflicts.push({
            path: file.filename,
            conflictType: file.status,
            base: base,
            head: head,
          });
        }
      }
    }

    return {
      success: true,
      hasConflicts: conflicts.length > 0,
      status: comparison.data.status,
      ahead_by: comparison.data.ahead_by,
      behind_by: comparison.data.behind_by,
      conflicts,
      totalCommits: comparison.data.total_commits,
      message: conflicts.length > 0 
        ? `Found ${conflicts.length} potential conflict(s) between ${base} and ${head}`
        : `No conflicts detected between ${base} and ${head}`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to check merge conflicts: ${error.message}`,
      error: error.message,
    };
  }
}

export async function getErrorsFromChecks(
  owner?: string,
  repo?: string,
  ref?: string
) {
  const repoOwner = owner || process.env.GITHUB_OWNER!;
  const repoName = repo || process.env.GITHUB_REPO!;
  const reference = ref || 'HEAD';

  try {
    // Get check runs for a ref
    const response = await github.checks.listForRef({
      owner: repoOwner,
      repo: repoName,
      ref: reference,
    });

    const errors = response.data.check_runs
      .filter(check => check.conclusion === 'failure' || check.conclusion === 'timed_out')
      .map(check => ({
        name: check.name,
        status: check.status,
        conclusion: check.conclusion,
        startedAt: check.started_at,
        completedAt: check.completed_at,
        url: check.html_url,
        output: check.output?.title || 'No details available',
      }));

    return {
      success: true,
      hasErrors: errors.length > 0,
      errors,
      totalChecks: response.data.total_count,
      message: errors.length > 0
        ? `Found ${errors.length} failed check(s)`
        : 'All checks passed',
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to get check errors: ${error.message}`,
      error: error.message,
    };
  }
}