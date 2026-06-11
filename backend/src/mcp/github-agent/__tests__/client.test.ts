import { GitHubMCPAgent, createGitHubAgent } from '../client';
import * as githubTools from '../../github/github.tools';

// Mock the github tools module
jest.mock('../../github/github.tools');

describe('GitHubMCPAgent', () => {
  let agent: GitHubMCPAgent;
  const mockOwner = 'test-owner';
  const mockRepo = 'test-repo';

  beforeEach(() => {
    agent = new GitHubMCPAgent(mockOwner, mockRepo);
    jest.clearAllMocks();
  });

  describe('createBranch', () => {
    it('should create a branch successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Branch created',
        branch: 'feature/test',
        baseSha: 'abc123'
      };

      (githubTools.createBranch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await agent.createBranch('feature/test');

      expect(githubTools.createBranch).toHaveBeenCalledWith('feature/test', mockOwner, mockRepo);
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
    });

    it('should handle branch creation errors', async () => {
      const mockError = {
        success: false,
        message: 'Branch already exists',
        error: 'Reference already exists'
      };

      (githubTools.createBranch as jest.Mock).mockResolvedValue(mockError);

      const result = await agent.createBranch('feature/existing');

      expect(result.success).toBe(false);
      expect(result.message).toContain('already exists');
    });
  });

  describe('commit', () => {
    it('should commit multiple files successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Committed 2 file(s)',
        commitSha: 'def456',
        filesCommitted: ['file1.ts', 'file2.ts']
      };

      (githubTools.commitChanges as jest.Mock).mockResolvedValue(mockResponse);

      const files = [
        { path: 'file1.ts', content: 'content1' },
        { path: 'file2.ts', content: 'content2' }
      ];

      const result = await agent.commit('feature/test', 'test commit', files);

      expect(githubTools.commitChanges).toHaveBeenCalledWith({
        owner: mockOwner,
        repo: mockRepo,
        branch: 'feature/test',
        message: 'test commit',
        files
      });
      expect(result.filesCommitted).toHaveLength(2);
    });

    it('should handle commit errors', async () => {
      const mockError = {
        success: false,
        message: 'Failed to commit',
        error: 'Invalid branch'
      };

      (githubTools.commitChanges as jest.Mock).mockResolvedValue(mockError);

      const result = await agent.commit('invalid-branch', 'test', []);

      expect(result.success).toBe(false);
    });
  });

  describe('listRepositories', () => {
    it('should list repositories for authenticated user', async () => {
      const mockResponse = {
        success: true,
        repositories: [
          { name: 'repo1', fullName: 'owner/repo1' },
          { name: 'repo2', fullName: 'owner/repo2' }
        ],
        count: 2
      };

      (githubTools.listRepositories as jest.Mock).mockResolvedValue(mockResponse);

      const result = await agent.listRepositories();

      expect(githubTools.listRepositories).toHaveBeenCalledWith(undefined);
      expect(result.count).toBe(2);
    });

    it('should list repositories for specific user', async () => {
      const mockResponse = {
        success: true,
        repositories: [{ name: 'public-repo' }],
        count: 1
      };

      (githubTools.listRepositories as jest.Mock).mockResolvedValue(mockResponse);

      const result = await agent.listRepositories('octocat');

      expect(githubTools.listRepositories).toHaveBeenCalledWith('octocat');
      expect(result.count).toBe(1);
    });
  });

  describe('getIssues', () => {
    it('should get open issues by default', async () => {
      const mockResponse = {
        success: true,
        issues: [
          { number: 1, title: 'Bug fix', state: 'open' },
          { number: 2, title: 'Feature request', state: 'open' }
        ],
        count: 2
      };

      (githubTools.getIssues as jest.Mock).mockResolvedValue(mockResponse);

      const result = await agent.getIssues();

      expect(githubTools.getIssues).toHaveBeenCalledWith(mockOwner, mockRepo, 'open');
      expect(result.count).toBe(2);
    });

    it('should filter issues by state', async () => {
      const mockResponse = {
        success: true,
        issues: [],
        count: 0
      };

      (githubTools.getIssues as jest.Mock).mockResolvedValue(mockResponse);

      await agent.getIssues('closed');

      expect(githubTools.getIssues).toHaveBeenCalledWith(mockOwner, mockRepo, 'closed');
    });
  });

  describe('checkMergeConflicts', () => {
    it('should detect no conflicts', async () => {
      const mockResponse = {
        success: true,
        hasConflicts: false,
        status: 'ahead',
        ahead_by: 5,
        behind_by: 0,
        conflicts: [],
        totalCommits: 5,
        message: 'No conflicts detected'
      };

      (githubTools.getMergeConflicts as jest.Mock).mockResolvedValue(mockResponse);

      const result = await agent.checkMergeConflicts('main', 'feature/test');

      expect(githubTools.getMergeConflicts).toHaveBeenCalledWith(
        mockOwner,
        mockRepo,
        'main',
        'feature/test'
      );
      expect(result.hasConflicts).toBe(false);
    });

    it('should detect merge conflicts', async () => {
      const mockResponse = {
        success: true,
        hasConflicts: true,
        status: 'diverged',
        ahead_by: 3,
        behind_by: 2,
        conflicts: [
          { path: 'file1.ts', conflictType: 'modified' }
        ],
        totalCommits: 5,
        message: 'Found 1 potential conflict(s)'
      };

      (githubTools.getMergeConflicts as jest.Mock).mockResolvedValue(mockResponse);

      const result = await agent.checkMergeConflicts('main', 'develop');

      expect(result.hasConflicts).toBe(true);
      expect(result.conflicts).toHaveLength(1);
    });
  });

  describe('getErrors', () => {
    it('should get CI/CD errors for a branch', async () => {
      const mockResponse = {
        success: true,
        hasErrors: true,
        errors: [
          {
            name: 'Build',
            status: 'completed',
            conclusion: 'failure',
            output: 'Build failed'
          }
        ],
        totalChecks: 3,
        message: 'Found 1 failed check(s)'
      };

      (githubTools.getErrorsFromChecks as jest.Mock).mockResolvedValue(mockResponse);

      const result = await agent.getErrors('feature/test');

      expect(githubTools.getErrorsFromChecks).toHaveBeenCalledWith(
        mockOwner,
        mockRepo,
        'feature/test'
      );
      expect(result.hasErrors).toBe(true);
      expect(result.errors).toHaveLength(1);
    });

    it('should handle no errors', async () => {
      const mockResponse = {
        success: true,
        hasErrors: false,
        errors: [],
        totalChecks: 3,
        message: 'All checks passed'
      };

      (githubTools.getErrorsFromChecks as jest.Mock).mockResolvedValue(mockResponse);

      const result = await agent.getErrors();

      expect(result.hasErrors).toBe(false);
      expect(result.message).toContain('passed');
    });
  });

  describe('executeWorkflow', () => {
    it('should execute full workflow successfully', async () => {
      (githubTools.createBranch as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Branch created'
      });

      (githubTools.commitChanges as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Committed'
      });

      (githubTools.getMergeConflicts as jest.Mock).mockResolvedValue({
        success: true,
        hasConflicts: false
      });

      (githubTools.getErrorsFromChecks as jest.Mock).mockResolvedValue({
        success: true,
        hasErrors: false
      });

      const result = await agent.executeWorkflow({
        featureName: 'feature/test',
        commitMessage: 'test commit',
        files: [{ path: 'test.ts', content: 'test' }],
        checkConflictsWithBranch: 'main'
      });

      expect(result.success).toBe(true);
      expect(result.steps.length).toBeGreaterThan(0);
    });

    it('should handle workflow failures', async () => {
      (githubTools.createBranch as jest.Mock).mockResolvedValue({
        success: false,
        message: 'Branch creation failed'
      });

      const result = await agent.executeWorkflow({
        featureName: 'feature/test',
        commitMessage: 'test',
        files: []
      });

      expect(result.success).toBe(false);
      expect(result.steps.some(s => s.includes('✗'))).toBe(true);
    });
  });

  describe('handleStageTask', () => {
    it('should handle requirements stage', async () => {
      (githubTools.createBranch as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Branch created'
      });

      const result = await agent.handleStageTask('requirements', {
        branchName: 'feature/US-123'
      });

      expect(githubTools.createBranch).toHaveBeenCalledWith('feature/US-123', mockOwner, mockRepo);
      expect(result.success).toBe(true);
    });

    it('should handle implementation stage', async () => {
      (githubTools.commitChanges as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Committed'
      });

      const result = await agent.handleStageTask('implementation', {
        branch: 'feature/test',
        commitMessage: 'feat: add feature',
        files: [{ path: 'test.ts', content: 'test' }]
      });

      expect(githubTools.commitChanges).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should handle testing stage', async () => {
      (githubTools.getErrorsFromChecks as jest.Mock).mockResolvedValue({
        success: true,
        hasErrors: false
      });

      const result = await agent.handleStageTask('testing', {
        branch: 'feature/test'
      });

      expect(githubTools.getErrorsFromChecks).toHaveBeenCalled();
    });

    it('should handle review stage', async () => {
      (githubTools.getMergeConflicts as jest.Mock).mockResolvedValue({
        success: true,
        hasConflicts: false
      });

      const result = await agent.handleStageTask('review', {
        baseBranch: 'main',
        branch: 'feature/test'
      });

      expect(githubTools.getMergeConflicts).toHaveBeenCalled();
    });

    it('should handle unknown stage', async () => {
      const result = await agent.handleStageTask('unknown-stage', {});

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unknown stage');
    });
  });

  describe('factory function', () => {
    it('should create agent instance', () => {
      const newAgent = createGitHubAgent('owner', 'repo');
      expect(newAgent).toBeInstanceOf(GitHubMCPAgent);
    });
  });
});
