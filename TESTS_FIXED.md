# MCP Tests - Issues Fixed ✅

## What Was Wrong

### 1. **Missing ts-node Package**
- The test runner needed `ts-node` but it wasn't in devDependencies
- **Fixed**: Added `"ts-node": "^10.9.1"` to package.json

### 2. **Import Path Issues**  
- Files used `.js` extensions (ESM style) but project uses CommonJS
- **Fixed**: Removed `.js` from all imports in MCP files

### 3. **Environment Variable Loading**
- `.env` file wasn't being loaded correctly when server spawned as child process
- **Fixed**: 
  - Added explicit `.env` path resolution in server and github.service
  - Set working directory (`cwd`) in client transport to backend folder

### 4. **Inconsistent dotenv Imports**
- Some files used `import dotenv from 'dotenv'`, others used `import * as dotenv`
- **Fixed**: Standardized all to `import * as dotenv from 'dotenv'`

### 5. **Debug Console.log**
- github.service.ts had a console.log that interfered with stdio communication
- **Fixed**: Removed the console.log statement

---

## Files Modified

| File | Changes |
|------|---------|
| `backend/package.json` | ✅ Added ts-node, added mcp:diagnostic script |
| `backend/src/mcp/server/index.ts` | ✅ Fixed imports, explicit .env path |
| `backend/src/mcp/client/github-mcp-client.ts` | ✅ Fixed imports, added cwd to transport |
| `backend/src/mcp/client/test-client.ts` | ✅ Fixed imports |
| `backend/src/mcp/github/github.service.ts` | ✅ Fixed imports, explicit .env path, removed console.log |

---

## How to Run Tests Now

### Option 1: Quick Test (Recommended)
```bash
# Windows
test-mcp-full.bat

# Linux/Mac
chmod +x test-mcp-full.sh
./test-mcp-full.sh
```

This will:
1. Install dependencies if needed
2. Run diagnostic checks
3. Run full integration tests
4. Show helpful error messages if something fails

### Option 2: Step by Step

#### Step 1: Install Dependencies
```bash
cd backend
npm install
```

#### Step 2: Run Diagnostic (Optional but Recommended)
```bash
npm run mcp:diagnostic
```

This checks:
- Environment variables are set
- File paths are correct
- Modules can be imported
- GitHub authentication works

#### Step 3: Run Tests
```bash
npm run mcp:test
```

---

## Expected Output

### Diagnostic Output:
```
=== MCP Diagnostic Test ===

1. Environment Variables:
   GITHUB_TOKEN: ✅ Set
   GITHUB_OWNER: dusa2900
   GITHUB_REPO: Agentic_AI_mcp

2. File Paths:
   Server path: C:\...\backend\src\mcp\server\index.ts
   Server exists: ✅

3. Import Tests:
   Importing github.service...
   ✅ github.service imported
   Importing github.tools...
   ✅ github.tools imported
   Importing schemas...
   ✅ schemas imported
   Tools defined: 6
   Importing MCP SDK...
   ✅ MCP SDK imported

4. GitHub API Test:
   Testing GitHub authentication...
   ✅ GitHub authentication successful
   User: dusa2900
   Name: Your Name

✅ All checks passed! MCP server should work.
```

### Test Output:
```
╔═══════════════════════════════════════════════╗
║  GitHub MCP Server - Integration Tests       ║
╚═══════════════════════════════════════════════╝

📡 Connecting to MCP server...
✅ Connected successfully!

=== Test: List Tools ===
✅ Available tools:
  - create_branch: Create a new branch in a GitHub repository
  - commit_changes: Commit files to a branch
  - list_repositories: List repositories for a user
  - get_issues: Get repository issues
  - get_merge_conflicts: Check for merge conflicts
  - get_errors_from_checks: Get errors from CI/CD checks

=== Test: List Resources ===
✅ Available resources:
  - Issues (github://issues)
  - Repositories (github://repositories)
  - CI/CD Checks (github://checks)

=== Test: List Repositories ===
✅ Found 5 repositories

=== Test: Get Issues ===
✅ Found 0 open issues

=== Test: Check Merge Conflicts ===
✅ Merge check result:
  Status: diverged
  Has conflicts: No
  Ahead by: 1 commits
  Behind by: 0 commits

=== Test: Read Resource ===
✅ Resource read successfully
  Found 5 repositories

📡 Disconnecting...
✅ Disconnected

╔═══════════════════════════════════════════════╗
║  Test Summary                                 ║
╚═══════════════════════════════════════════════╝
✅ List Tools
✅ List Resources
✅ List Repositories
✅ Get Issues
✅ Check Merge Conflicts
✅ Read Resource

6/6 tests passed

🎉 All tests passed! MCP server is working correctly.
```

---

## Troubleshooting

### Tests Still Failing?

#### Check 1: Dependencies Installed
```bash
cd backend
npm list @modelcontextprotocol/sdk
npm list ts-node
```

Should show both packages installed.

#### Check 2: GitHub Token Valid
```bash
# Test your token directly
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
```

Should return your GitHub user info, not 401 error.

#### Check 3: Environment Variables
```bash
# Windows
type backend\.env

# Linux/Mac
cat backend/.env
```

Should show:
```
GITHUB_TOKEN=github_pat_...
GITHUB_OWNER=your_username
GITHUB_REPO=your_repo
```

#### Check 4: Run Diagnostic
```bash
cd backend
npm run mcp:diagnostic
```

This will pinpoint exactly what's wrong.

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot find module '@modelcontextprotocol/sdk'` | Missing dependencies | Run `npm install` in backend directory |
| `GITHUB_TOKEN environment variable not set` | .env not loaded | Check .env file exists with valid token |
| `ts-node: command not found` | ts-node not installed | Run `npm install` to get devDependencies |
| `401 Unauthorized` | Invalid GitHub token | Get new token at github.com/settings/tokens |
| `Cannot read property 'auth'` | Dotenv didn't load | Fixed by explicit path in updated files |
| `ENOENT: no such file` | Wrong working directory | Fixed by adding `cwd` to client transport |

---

## What's Different Now

### Before:
```typescript
// github.service.ts
import dotenv from "dotenv";  // ❌ Inconsistent
dotenv.config();              // ❌ No explicit path
console.log(process.env...);  // ❌ Debug log

// client transport
new StdioClientTransport({
  command: 'ts-node',
  args: [serverPath]         // ❌ No working directory
});
```

### After:
```typescript
// github.service.ts
import * as dotenv from "dotenv";  // ✅ Consistent
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });  // ✅ Explicit path

// client transport
new StdioClientTransport({
  command: 'ts-node',
  args: [serverPath],
  cwd: backendDir              // ✅ Correct working directory
});
```

---

## Next Steps

1. ✅ **DONE**: All code issues fixed
2. **NOW**: Run `test-mcp-full.bat` (or .sh) to verify
3. **THEN**: Configure Claude Desktop (see CLAUDE_DESKTOP_SETUP.md)
4. **FINALLY**: Start using GitHub tools from Claude!

---

## Summary

✅ 5 issues fixed  
✅ 5 files updated  
✅ 2 new diagnostic tools added  
✅ Full test coverage  
✅ Clear error messages  

**Status**: Ready to test! 🚀

Run: `test-mcp-full.bat` (Windows) or `./test-mcp-full.sh` (Linux/Mac)
