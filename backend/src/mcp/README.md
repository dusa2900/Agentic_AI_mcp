# MCP (Model Context Protocol) Implementation

This directory contains the complete MCP protocol layer implementation for GitHub operations.

## Directory Structure

```
backend/src/mcp/
├── schemas/
│   └── github-tools.schema.ts    # Zod schemas & MCP tool definitions
├── server/
│   └── index.ts                  # MCP Server implementation
├── client/
│   ├── github-mcp-client.ts      # MCP Client wrapper
│   └── test-client.ts            # Integration tests
├── github/
│   ├── github.service.ts         # Octokit setup
│   └── github.tools.ts           # Tool implementations (6 functions)
└── github-agent/
    ├── client.ts                 # Legacy agent wrapper
    ├── index.ts                  # Type exports
    ├── examples.ts               # Usage examples
    ├── config.json               # Agent configuration
    └── __tests__/
        └── client.test.ts        # Unit tests
```

## Components

### 1. Schemas (`schemas/`)
**Purpose**: Define tool interfaces and validation rules

- **github-tools.schema.ts**
  - Zod schemas for input validation
  - MCP-compliant JSON Schema definitions
  - TypeScript type exports
  - 6 tool definitions

**Key Exports**:
```typescript
export const GITHUB_MCP_TOOLS: Tool definitions
export const CreateBranchSchema: Zod schema
export type CreateBranchInput: TypeScript type
```

### 2. Server (`server/`)
**Purpose**: MCP protocol server implementation

- **index.ts**
  - Implements MCP Server class
  - Registers all 6 tools
  - Handles JSON-RPC requests
  - Provides 3 resources
  - Uses stdio transport

**Protocol Support**:
- `tools/list` - List available tools
- `tools/call` - Execute tool
- `resources/list` - List resources
- `resources/read` - Read resource content

**Usage**:
```bash
# Run server
npm run mcp:server

# Build and run
npm run mcp:build
```

### 3. Client (`client/`)
**Purpose**: Client for connecting to MCP server

- **github-mcp-client.ts**
  - MCP Client wrapper class
  - Connection management
  - Convenience methods for all tools
  - Type-safe API

- **test-client.ts**
  - 6 integration tests
  - Automated test suite
  - Verification script

**Usage**:
```typescript
import { createGitHubMCPClient } from './client/github-mcp-client';

const client = await createGitHubMCPClient();
const result = await client.createBranch('feature/test');
await client.disconnect();
```

**Testing**:
```bash
npm run mcp:test
```

### 4. GitHub Tools (`github/`)
**Purpose**: Core GitHub API implementations

- **github.service.ts**
  - Octokit initialization
  - Authentication setup

- **github.tools.ts**
  - 6 tool implementations:
    1. `createBranch` - Create new branch
    2. `commitChanges` - Commit files
    3. `listRepositories` - List repos
    4. `getIssues` - Get issues
    5. `getMergeConflicts` - Check conflicts
    6. `getErrorsFromChecks` - Get CI/CD errors

**Note**: These are the actual implementations. The MCP server wraps them with protocol handling.

### 5. GitHub Agent (`github-agent/`)
**Purpose**: Legacy agent wrapper (pre-MCP)

**Status**: Kept for backward compatibility. New code should use MCP client.

---

## Architecture Flow

```
Claude Desktop / AI App
        ↓ (uses MCP protocol)
MCP Client (client/github-mcp-client.ts)
        ↓ (JSON-RPC via stdio)
MCP Server (server/index.ts)
        ↓ (validates with schemas)
Schemas (schemas/github-tools.schema.ts)
        ↓ (calls implementations)
Tools (github/github.tools.ts)
        ↓ (API calls)
GitHub API (via Octokit)
```

---

## Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Create `backend/.env`:
```bash
GITHUB_TOKEN=your_token_here
GITHUB_OWNER=your_username
GITHUB_REPO=your_repo
```

### 3. Build
```bash
npm run build
```

### 4. Test
```bash
npm run mcp:test
```

### 5. Run Server
```bash
npm run mcp:server
```

---

## Tools Available

| Tool Name | Description | Inputs |
|-----------|-------------|--------|
| `create_branch` | Create a new branch | branchName, owner?, repo? |
| `commit_changes` | Commit files to branch | branch, message, files[], owner?, repo? |
| `list_repositories` | List repositories | username? |
| `get_issues` | Get repository issues | owner?, repo?, state? |
| `get_merge_conflicts` | Check for conflicts | baseBranch, headBranch, owner?, repo? |
| `get_errors_from_checks` | Get CI/CD errors | ref, owner?, repo? |

---

## Resources Available

| URI | Description | Data Type |
|-----|-------------|-----------|
| `github://issues` | Open issues | JSON |
| `github://repositories` | Repository list | JSON |
| `github://checks` | CI/CD check status | JSON |

---

## Integration Examples

### Using MCP Client
```typescript
import { createGitHubMCPClient } from './mcp/client/github-mcp-client';

async function example() {
  const client = await createGitHubMCPClient();
  
  // Create branch
  await client.createBranch('feature/new-feature');
  
  // Commit files
  await client.commitChanges({
    branch: 'feature/new-feature',
    message: 'Add new feature',
    files: [
      { path: 'src/new-file.ts', content: 'export {}' }
    ]
  });
  
  // Check for issues
  const issues = await client.getIssues();
  
  await client.disconnect();
}
```

### Using with Claude Desktop
See [CLAUDE_DESKTOP_SETUP.md](../../../CLAUDE_DESKTOP_SETUP.md) for configuration.

---

## Development

### Adding a New Tool

1. **Implement function in `github/github.tools.ts`**:
```typescript
export async function myNewTool(arg: string) {
  // Implementation
  return { success: true, data: 'result' };
}
```

2. **Add schema in `schemas/github-tools.schema.ts`**:
```typescript
export const MyNewToolSchema = z.object({
  arg: z.string()
});

// Add to GITHUB_MCP_TOOLS array
{
  name: 'my_new_tool',
  description: 'Does something',
  inputSchema: { /* JSON schema */ }
}
```

3. **Add handler in `server/index.ts`**:
```typescript
case 'my_new_tool':
  return await this.handleMyNewTool(args);

private async handleMyNewTool(args: any) {
  const result = await githubTools.myNewTool(args.arg);
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
}
```

4. **Test**:
```bash
npm run mcp:test
```

---

## Testing

### Run All Tests
```bash
npm run mcp:test
```

### Manual Testing
```bash
# Start server in one terminal
npm run mcp:server

# In another terminal, use the client
ts-node src/mcp/client/test-client.ts
```

---

## Troubleshooting

### Server won't start
- Check `GITHUB_TOKEN` is set in `.env`
- Verify dependencies installed: `npm install`
- Check build completed: `npm run build`

### Tools not working
- Verify GitHub token has required scopes (repo, read:org, workflow)
- Check token is valid: `curl -H "Authorization: token TOKEN" https://api.github.com/user`

### Connection errors
- Ensure stdio transport is working
- Check no other process is using the server
- Verify TypeScript is compiled correctly

---

## Documentation

- **[MCP_IMPLEMENTATION_COMPLETE.md](../../../MCP_IMPLEMENTATION_COMPLETE.md)** - Implementation summary
- **[MCP_STATUS_SUMMARY.md](../../../MCP_STATUS_SUMMARY.md)** - Status overview
- **[MCP_ARCHITECTURE_ANALYSIS.md](../../../MCP_ARCHITECTURE_ANALYSIS.md)** - Architecture details
- **[CLAUDE_DESKTOP_SETUP.md](../../../CLAUDE_DESKTOP_SETUP.md)** - Claude integration

---

## Contributing

When adding new functionality:
1. Write the tool implementation first
2. Add schema validation
3. Register with MCP server
4. Add tests
5. Update documentation

---

## License

Part of the carpooling application project.
