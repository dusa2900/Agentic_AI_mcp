# GitHub MCP Server Configuration for Claude Desktop

## Setup Instructions

### 1. Build the MCP Server

First, compile the TypeScript code:

```bash
cd backend
npm install
npm run build
```

### 2. Configure Claude Desktop

#### Option A: Using the config file (Recommended)

1. Locate your Claude Desktop configuration file:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. Add the GitHub MCP server to your configuration:

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": [
        "C:\\Users\\goutham.dusa\\Desktop\\AI\\14-05 - mcp\\backend\\dist\\mcp\\server\\index.js"
      ],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here",
        "GITHUB_OWNER": "your_github_username",
        "GITHUB_REPO": "your_default_repo"
      }
    }
  }
}
```

**Important**: Replace the path with the absolute path to your compiled server file.

#### Option B: Using environment variables

1. Set environment variables in your system:
   ```bash
   # Windows PowerShell
   $env:GITHUB_TOKEN="your_token_here"
   $env:GITHUB_OWNER="your_username"
   $env:GITHUB_REPO="your_repo"
   ```

2. Add to Claude config without the env field:
   ```json
   {
     "mcpServers": {
       "github": {
         "command": "node",
         "args": ["path/to/backend/dist/mcp/server/index.js"]
       }
     }
   }
   ```

### 3. Get a GitHub Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Claude MCP Server")
4. Select scopes:
   - ✅ `repo` - Full control of private repositories
   - ✅ `read:org` - Read organization data
   - ✅ `workflow` - Update GitHub Actions workflows
5. Click "Generate token"
6. Copy the token immediately (you won't see it again)

### 4. Restart Claude Desktop

After adding the configuration, restart Claude Desktop completely.

### 5. Verify Installation

In Claude Desktop, you should see:
- A notification that the GitHub MCP server is connected
- Tools available in the tool picker (hammer icon)
- 6 GitHub tools: create_branch, commit_changes, list_repositories, get_issues, get_merge_conflicts, get_errors_from_checks

## Available Tools in Claude

Once configured, you can ask Claude to:

- **Create branches**: "Create a new branch called feature/add-payment"
- **Commit files**: "Commit these changes to the feature branch"
- **List repos**: "Show me my GitHub repositories"
- **Check issues**: "What are the open issues in my repo?"
- **Detect conflicts**: "Check if main has conflicts with develop"
- **Monitor CI/CD**: "Show me any failing checks on the main branch"

## Troubleshooting

### Server not connecting

1. Check that the server file exists:
   ```bash
   ls backend/dist/mcp/server/index.js
   ```

2. Test the server manually:
   ```bash
   cd backend
   npm run mcp:build
   node dist/mcp/server/index.js
   ```
   You should see: "GitHub MCP Server running on stdio"

### Token errors

1. Verify your token is valid:
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
   ```

2. Check token scopes include `repo`, `read:org`, and `workflow`

### Path errors (Windows)

Use forward slashes or double backslashes in paths:
```json
"C:/Users/goutham.dusa/Desktop/AI/14-05 - mcp/backend/dist/mcp/server/index.js"
```
or
```json
"C:\\Users\\goutham.dusa\\Desktop\\AI\\14-05 - mcp\\backend\\dist\\mcp\\server\\index.js"
```

### View logs

Claude Desktop logs MCP server output. Check the logs:
- **Windows**: `%APPDATA%\Claude\logs`
- **macOS**: `~/Library/Logs/Claude`
- **Linux**: `~/.local/share/Claude/logs`

## Testing Without Claude

You can test the MCP server independently:

```bash
# Run the test client
cd backend
npm run mcp:test
```

This will verify all tools are working correctly.

## Security Notes

- ⚠️ Never commit your GitHub token to version control
- ⚠️ Keep your `.env` file private
- ⚠️ Use tokens with minimal required scopes
- ⚠️ Rotate tokens periodically
- ⚠️ Revoke tokens immediately if compromised

## Advanced Configuration

### Multiple Repositories

You can configure multiple MCP servers for different repositories:

```json
{
  "mcpServers": {
    "github-personal": {
      "command": "node",
      "args": ["path/to/server/index.js"],
      "env": {
        "GITHUB_TOKEN": "token1",
        "GITHUB_OWNER": "personal-account",
        "GITHUB_REPO": "personal-repo"
      }
    },
    "github-work": {
      "command": "node",
      "args": ["path/to/server/index.js"],
      "env": {
        "GITHUB_TOKEN": "token2",
        "GITHUB_OWNER": "company-org",
        "GITHUB_REPO": "work-repo"
      }
    }
  }
}
```

### Custom Server Port (for HTTP transport)

If using HTTP transport in the future:

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["path/to/server/index.js", "--transport", "http", "--port", "3001"]
    }
  }
}
```

## Resources

- **MCP Documentation**: https://modelcontextprotocol.io
- **Claude Desktop**: https://claude.ai/desktop
- **GitHub API**: https://docs.github.com/rest
- **Octokit**: https://octokit.github.io/rest.js
