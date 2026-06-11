# GitHub MCP Agent

## Overview
A specialized Model Context Protocol (MCP) agent for GitHub operations. This agent provides comprehensive GitHub repository management capabilities including branch operations, commits, issue tracking, merge conflict detection, and CI/CD error monitoring.

## Core Capabilities

### 1. Branch Management
- **Create Branch**: Create new branches from any base branch
- **List Branches**: View all branches in a repository
- **Compare Branches**: Detect differences between branches

### 2. Commit Operations
- **Commit Changes**: Create commits with multiple file changes
- **View Commit History**: Browse repository commit timeline
- **Commit Details**: Get detailed information about specific commits

### 3. Repository Management
- **List Repositories**: View all accessible repositories (authenticated user or specific user)
- **Repository Details**: Get comprehensive repository information
- **Repository Statistics**: Access stars, forks, language distribution

### 4. Issue & Error Tracking
- **List Issues**: Retrieve open, closed, or all issues
- **Issue Details**: Get comprehensive issue information including labels and assignees
- **CI/CD Errors**: Monitor check runs and detect failures
- **Error Analysis**: Parse and categorize build/test failures

### 5. Merge Conflict Detection
- **Conflict Detection**: Identify potential merge conflicts between branches
- **Branch Comparison**: Analyze divergence between branches
- **Conflict Resolution Status**: Track ahead/behind commit counts

## Usage

### Prerequisites
Set the following environment variables:
```bash
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=default_repository_owner
GITHUB_REPO=default_repository_name
```

### Agent Invocation Patterns

#### Create a New Branch
```typescript
import { createBranch } from './backend/src/mcp/github/github.tools';

const result = await createBranch('feature/new-feature');
// Returns: { success: true, branch: 'feature/new-feature', ... }
```

#### Commit Multiple Files
```typescript
import { commitChanges } from './backend/src/mcp/github/github.tools';

const result = await commitChanges({
  branch: 'feature/new-feature',
  message: 'Add new components',
  files: [
    { path: 'src/Component.tsx', content: '...' },
    { path: 'src/styles.css', content: '...' }
  ]
});
```

#### List Repositories
```typescript
import { listRepositories } from './backend/src/mcp/github/github.tools';

// List authenticated user's repos
const myRepos = await listRepositories();

// List specific user's public repos
const userRepos = await listRepositories('octocat');
```

#### Get Issues and Errors
```typescript
import { getIssues, getErrorsFromChecks } from './backend/src/mcp/github/github.tools';

// Get open issues
const issues = await getIssues(undefined, undefined, 'open');

// Get CI/CD errors for a branch
const errors = await getErrorsFromChecks(undefined, undefined, 'feature/new-feature');
```

#### Check Merge Conflicts
```typescript
import { getMergeConflicts } from './backend/src/mcp/github/github.tools';

const conflicts = await getMergeConflicts(
  undefined,  // uses GITHUB_OWNER
  undefined,  // uses GITHUB_REPO
  'main',     // base branch
  'develop'   // head branch
);
```

## Integration with Dev Orchestrator

This agent integrates seamlessly with the Dev Orchestrator workflow:

### During Feature Development
- **Requirements Phase**: Create feature branch automatically
- **Implementation Phase**: Commit changes as components are built
- **Testing Phase**: Monitor CI/CD errors and test failures
- **Review Phase**: Check for merge conflicts with main branch

### Workflow Integration Example
```
[Requirements Analyst] → outputs feature spec
        ↓
[GitHub MCP Agent] → creates branch "feature/US-123"
        ↓
[React Developer] → implements component
        ↓
[GitHub MCP Agent] → commits component files
        ↓
[Unit Test Writer] → writes tests
        ↓
[GitHub MCP Agent] → commits test files
        ↓
[GitHub MCP Agent] → checks for CI/CD errors
        ↓
[Code Reviewer] → reviews changes
        ↓
[GitHub MCP Agent] → checks merge conflicts with main
```

## Response Formats

All functions return structured responses with consistent format:

```typescript
interface SuccessResponse {
  success: true;
  message: string;
  // ... additional data specific to operation
}

interface ErrorResponse {
  success: false;
  message: string;
  error: string;
}
```

## Error Handling

The agent implements comprehensive error handling:
- **Network Errors**: Graceful handling of API timeouts
- **Authentication Errors**: Clear messages for token issues
- **Permission Errors**: Specific feedback for access restrictions
- **Rate Limiting**: Detection and reporting of GitHub API limits

## Best Practices

### 1. Branch Naming
- Use prefixes: `feature/`, `bugfix/`, `hotfix/`
- Include ticket IDs: `feature/US-123-add-booking`

### 2. Commit Messages
- Follow conventional commits format
- Be descriptive but concise
- Reference issue numbers: `fix: resolve booking bug (#123)`

### 3. Conflict Prevention
- Check for conflicts before starting work
- Pull latest changes frequently
- Resolve conflicts early in development cycle

### 4. Issue Management
- Tag issues with appropriate labels
- Assign issues before starting work
- Close issues with commit references

## Security Considerations

- **Token Storage**: Never commit GITHUB_TOKEN to repository
- **Permissions**: Use tokens with minimal required scopes
- **Rate Limits**: Respect GitHub API rate limits
- **Data Exposure**: Be cautious with private repository data

## Monitoring & Observability

The agent logs all operations for audit trails:
- Branch creation timestamps
- Commit SHAs and file counts
- Error occurrences and types
- API call frequencies

## Future Enhancements

Planned capabilities:
- Pull Request creation and management
- Code review automation
- Automated conflict resolution
- GitHub Actions workflow triggers
- Release management
- Dependency update monitoring

## Support & Troubleshooting

### Common Issues

**Issue**: "Bad credentials"
- **Solution**: Verify GITHUB_TOKEN is valid and has required scopes

**Issue**: "Not Found"
- **Solution**: Check GITHUB_OWNER and GITHUB_REPO are correct

**Issue**: "Reference already exists"
- **Solution**: Branch name conflicts with existing branch

**Issue**: "Merge conflict detected"
- **Solution**: Manually resolve conflicts or rebase branch

### Debug Mode
Enable detailed logging by setting:
```bash
DEBUG=github:*
```

## Version History
- v1.0.0 (2026-06-10): Initial release with core operations
  - Branch management
  - Commit operations
  - Repository listing
  - Issue tracking
  - Merge conflict detection
  - CI/CD error monitoring
