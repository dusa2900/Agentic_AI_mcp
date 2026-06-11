# GitHub MCP Agent - Quick Start Guide

## Installation

No additional installation needed - the agent uses the existing backend GitHub service.

## Configuration

1. **Set Environment Variables** (in `.env` file):
```bash
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-repository-name
```

2. **GitHub Token Scopes Required**:
   - `repo` - Full control of private repositories
   - `read:org` - Read organization data
   - `workflow` - Update GitHub Action workflows

## Basic Usage

### Option 1: Using the Agent Client (Recommended)

```typescript
import { createGitHubAgent } from './.github/agents/github-agent-client';

// Create agent instance
const agent = createGitHubAgent();

// Or specify custom owner/repo
const agent = createGitHubAgent('my-org', 'my-repo');

// Create a branch
await agent.createBranch('feature/new-feature');

// Commit files
await agent.commit('feature/new-feature', 'feat: add new feature', [
  { path: 'src/component.tsx', content: '...' }
]);

// Check for errors
const errors = await agent.getErrors('feature/new-feature');

// Check merge conflicts
const conflicts = await agent.checkMergeConflicts('main', 'feature/new-feature');
```

### Option 2: Direct Function Calls

```typescript
import { 
  createBranch, 
  commitChanges, 
  getIssues 
} from './backend/src/mcp/github/github.tools';

// Create branch
await createBranch('feature/test');

// Commit changes
await commitChanges({
  branch: 'feature/test',
  message: 'Update files',
  files: [{ path: 'file.ts', content: 'content' }]
});

// Get issues
await getIssues(undefined, undefined, 'open');
```

## Integration with Dev Orchestrator

The GitHub MCP Agent automatically integrates with your development workflow:

```typescript
const agent = createGitHubAgent();

// Handle different workflow stages
await agent.handleStageTask('requirements', {
  branchName: 'feature/US-123'
});

await agent.handleStageTask('implementation', {
  branch: 'feature/US-123',
  commitMessage: 'feat: implement feature',
  files: [...]
});

await agent.handleStageTask('testing', {
  branch: 'feature/US-123'
});

await agent.handleStageTask('review', {
  baseBranch: 'main',
  branch: 'feature/US-123'
});
```

## Running Tests

```bash
# Install dependencies (if not already done)
cd backend
npm install

# Run tests
npm test -- .github/agents/__tests__/github-agent.test.ts
```

## Common Commands

### Create Feature Branch
```bash
node -e "require('./.github/agents/examples.ts').example1_BasicWorkflow()"
```

### Full Workflow
```bash
node -e "require('./.github/agents/examples.ts').example2_FullFeatureWorkflow()"
```

### Check Issues & Errors
```bash
node -e "require('./.github/agents/examples.ts').example3_MonitorIssuesAndErrors()"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Bad credentials" | Check `GITHUB_TOKEN` is valid |
| "Not Found" | Verify `GITHUB_OWNER` and `GITHUB_REPO` |
| "Reference already exists" | Branch name already exists, use different name |
| "API rate limit exceeded" | Wait for rate limit to reset or use authenticated requests |

## API Reference

See [github-mcp-agent.md](./github-mcp-agent.md) for complete API documentation.

## Examples

See [examples.ts](./examples.ts) for detailed usage examples.
