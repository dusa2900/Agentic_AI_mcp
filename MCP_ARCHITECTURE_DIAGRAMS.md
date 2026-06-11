# MCP Architecture Diagrams

## Current Architecture ❌ (What You Have Now)

```
┌─────────────────────────────────────────────────────────┐
│              Dev Orchestrator / Agents                   │
│  (Requirements Analyst, Code Reviewer, etc.)            │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ Direct function calls
                        │ (No protocol)
                        ▼
┌─────────────────────────────────────────────────────────┐
│            GitHubMCPAgent (Class Wrapper)               │
│                                                         │
│  async createBranch() {                                 │
│    return githubTools.createBranch(...)  ◄── Direct    │
│  }                                                      │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ Direct JavaScript calls
                        ▼
┌─────────────────────────────────────────────────────────┐
│            GitHub Tools (github.tools.ts)               │
│                                                         │
│  - createBranch()                                       │
│  - commitChanges()                                      │
│  - listRepositories()                                   │
│  - getIssues()                                          │
│  - getMergeConflicts()                                  │
│  - getErrorsFromChecks()                                │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ REST API calls
                        ▼
┌─────────────────────────────────────────────────────────┐
│              GitHub API (via Octokit)                   │
└─────────────────────────────────────────────────────────┘

Issues with Current Architecture:
❌ No standardized protocol
❌ Tight coupling between agents and tools
❌ No tool discoverability
❌ Not compatible with MCP ecosystem
❌ Can't be used by external MCP clients
```

---

## Target Architecture ✅ (What It Should Be)

```
┌──────────────────────────────────────────────────────────────┐
│                   AI Application Layer                       │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Claude Desktop │  │ Dev Orchestrator│  │ VS Code      │  │
│  └────────┬───────┘  └────────┬───────┘  └──────┬───────┘  │
│           │                   │                   │          │
└───────────┼───────────────────┼───────────────────┼──────────┘
            │                   │                   │
            └───────────────────┴───────────────────┘
                                │
                                │ MCP Protocol
                                │ (JSON-RPC 2.0)
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                       MCP Client Layer                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - Discovers available tools                         │  │
│  │  - Validates requests against schemas                │  │
│  │  - Invokes tools via protocol                        │  │
│  │  - Handles responses and errors                      │  │
│  │  - Manages transport (stdio/HTTP/WebSocket)          │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ JSON-RPC Messages:
                            │ - tools/list
                            │ - tools/call
                            │ - resources/list
                            │ - resources/read
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                      MCP Server Layer                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         GitHub MCP Server                            │  │
│  │                                                      │  │
│  │  Tool Registry:                                      │  │
│  │  ┌───────────────────────────────────────────────┐  │  │
│  │  │ Tool: create_branch                           │  │  │
│  │  │ Schema: { branchName: string, ... }           │  │  │
│  │  │ Handler: async (args) => {...}                │  │  │
│  │  └───────────────────────────────────────────────┘  │  │
│  │  ┌───────────────────────────────────────────────┐  │  │
│  │  │ Tool: commit_changes                          │  │  │
│  │  │ Schema: { branch, message, files[], ... }     │  │  │
│  │  │ Handler: async (args) => {...}                │  │  │
│  │  └───────────────────────────────────────────────┘  │  │
│  │  ... (4 more tools)                                  │  │
│  │                                                      │  │
│  │  Resource Registry:                                  │  │
│  │  ┌───────────────────────────────────────────────┐  │  │
│  │  │ Resource: github://issues                     │  │  │
│  │  │ Handler: async () => getIssues()              │  │  │
│  │  └───────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ Direct function calls
                            │ (internal only)
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                   Tool Implementation Layer                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         GitHub Tools (github.tools.ts)               │  │
│  │                                                      │  │
│  │  export async function createBranch(...) {          │  │
│  │    const response = await github.git.createRef(...) │  │
│  │    return { success: true, ... }                    │  │
│  │  }                                                   │  │
│  │                                                      │  │
│  │  export async function commitChanges(...) {         │  │
│  │    // Blob creation, tree creation, commit         │  │
│  │  }                                                   │  │
│  │                                                      │  │
│  │  ... (4 more tool implementations)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ REST API calls
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                 GitHub API (via Octokit)                     │
└──────────────────────────────────────────────────────────────┘

Benefits of Target Architecture:
✅ Standardized MCP protocol
✅ Loose coupling via protocol
✅ Dynamic tool discovery
✅ Compatible with MCP ecosystem
✅ Can be used by any MCP client
✅ Multiple transport options
✅ Schema-driven validation
```

---

## Message Flow Example

### Current Flow (Direct Call) ❌

```
Agent
  │
  ├─> agent.createBranch('feature/test')
  │     │
  │     └─> githubTools.createBranch('feature/test')
  │           │
  │           └─> github.git.createRef({...})
  │                 │
  │                 └─> GitHub API
  │                       │
  │                       └─> Response
  │                             │
  │                             └─> Back to Agent
```

### Target Flow (MCP Protocol) ✅

```
Agent/Claude Desktop
  │
  ├─> client.callTool({
  │     name: 'create_branch',
  │     arguments: { branchName: 'feature/test' }
  │   })
  │     │
  │     └─> JSON-RPC Request:
  │         {
  │           "jsonrpc": "2.0",
  │           "id": 1,
  │           "method": "tools/call",
  │           "params": {
  │             "name": "create_branch",
  │             "arguments": {
  │               "branchName": "feature/test"
  │             }
  │           }
  │         }
  │           │
  │           └─> MCP Server
  │                 │
  │                 ├─> Validates against schema
  │                 │
  │                 ├─> Calls githubTools.createBranch(...)
  │                 │     │
  │                 │     └─> github.git.createRef({...})
  │                 │           │
  │                 │           └─> GitHub API
  │                 │                 │
  │                 │                 └─> Response
  │                 │                       │
  │                 └─> JSON-RPC Response:
  │                     {
  │                       "jsonrpc": "2.0",
  │                       "id": 1,
  │                       "result": {
  │                         "content": [{
  │                           "type": "text",
  │                           "text": "{success: true, ...}"
  │                         }]
  │                       }
  │                     }
  │                       │
  │                       └─> Back to Agent/Claude
```

---

## Protocol Messages

### 1. List Tools Request
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

### 2. List Tools Response
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "create_branch",
        "description": "Create a new GitHub branch",
        "inputSchema": {
          "type": "object",
          "properties": {
            "branchName": { "type": "string" }
          },
          "required": ["branchName"]
        }
      }
    ]
  }
}
```

### 3. Call Tool Request
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "create_branch",
    "arguments": {
      "branchName": "feature/test"
    }
  }
}
```

### 4. Call Tool Response
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"success\": true, \"branch\": \"feature/test\", \"baseSha\": \"abc123\"}"
      }
    ]
  }
}
```

---

## Comparison Table

| Aspect | Current ❌ | Target ✅ |
|--------|-----------|----------|
| **Protocol** | None (direct calls) | MCP (JSON-RPC 2.0) |
| **Tool Discovery** | Manual code inspection | Dynamic via `tools/list` |
| **Validation** | Manual in code | Schema-driven automatic |
| **Interoperability** | Project-specific | Works with any MCP client |
| **Transport** | N/A | stdio, HTTP, WebSocket |
| **Error Handling** | Custom | Standardized protocol errors |
| **Documentation** | Code comments | Self-documenting schemas |
| **Testing** | Unit tests only | Protocol-level testing |
| **Integration** | Hard-coded imports | Protocol-based discovery |
| **Scalability** | Monolithic | Distributed servers |

---

## Key Differences

### Tool Registration

**Current:**
```typescript
// No registration - just export functions
export async function createBranch(...) { ... }
```

**Target:**
```typescript
// Register with MCP server
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'create_branch',
    description: '...',
    inputSchema: { ... }
  }]
}));
```

### Tool Invocation

**Current:**
```typescript
// Direct import and call
import { createBranch } from './github.tools';
const result = await createBranch('feature/test');
```

**Target:**
```typescript
// Via protocol
const client = await createMCPClient();
const result = await client.callTool({
  name: 'create_branch',
  arguments: { branchName: 'feature/test' }
});
```

### Error Handling

**Current:**
```typescript
// Custom error objects
return {
  success: false,
  error: error.message
};
```

**Target:**
```typescript
// Protocol-compliant errors
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32603,
    "message": "Internal error",
    "data": { ... }
  }
}
```
