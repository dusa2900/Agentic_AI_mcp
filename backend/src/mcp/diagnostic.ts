/**
 * Simple diagnostic script to test MCP server startup
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from backend directory
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

console.log('=== MCP Diagnostic Test ===\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log('   GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? '✅ Set' : '❌ Not set');
console.log('   GITHUB_OWNER:', process.env.GITHUB_OWNER || '❌ Not set');
console.log('   GITHUB_REPO:', process.env.GITHUB_REPO || '❌ Not set');
console.log('');

// Check file paths
console.log('2. File Paths:');
const serverPath = path.resolve(__dirname, './server/index.ts');
console.log('   Server path:', serverPath);
console.log('   Server exists:', require('fs').existsSync(serverPath) ? '✅' : '❌');
console.log('');

// Try importing the server module
console.log('3. Import Tests:');

// Check if node_modules exists
const fs = require('fs');
const nodeModulesPath = path.resolve(__dirname, '../../node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('   ❌ node_modules not found! Run: npm install');
  console.log('');
  process.exit(1);
}

const mcpPackagePath = path.resolve(nodeModulesPath, '@modelcontextprotocol/sdk');
if (!fs.existsSync(mcpPackagePath)) {
  console.log('   ❌ @modelcontextprotocol/sdk not installed! Run: npm install');
  console.log('');
  process.exit(1);
}

try {
  console.log('   Importing github.service...');
  const githubService = require('./github/github.service');
  console.log('   ✅ github.service imported');
} catch (error: any) {
  console.log('   ❌ Failed to import github.service:', error.message);
}

try {
  console.log('   Importing github.tools...');
  const githubTools = require('./github/github.tools');
  console.log('   ✅ github.tools imported');
} catch (error: any) {
  console.log('   ❌ Failed to import github.tools:', error.message);
}

try {
  console.log('   Importing schemas...');
  const schemas = require('./schemas/github-tools.schema');
  console.log('   ✅ schemas imported');
  console.log('   Tools defined:', schemas.GITHUB_MCP_TOOLS?.length || 0);
} catch (error: any) {
  console.log('   ❌ Failed to import schemas:', error.message);
}

try {
  console.log('   Importing MCP SDK...');
  // Try different import patterns for MCP SDK
  let mcpSDK;
  try {
    mcpSDK = require('@modelcontextprotocol/sdk/server/index.js');
  } catch {
    try {
      mcpSDK = require('@modelcontextprotocol/sdk/server/index');
    } catch {
      mcpSDK = require('@modelcontextprotocol/sdk');
    }
  }
  console.log('   ✅ MCP SDK imported');
} catch (error: any) {
  console.log('   ❌ Failed to import MCP SDK:', error.message);
}

console.log('\n4. GitHub API Test:');
try {
  const { github } = require('./github/github.service');
  console.log('   Testing GitHub authentication...');
  
  github.rest.users.getAuthenticated()
    .then((response: any) => {
      console.log('   ✅ GitHub authentication successful');
      console.log('   User:', response.data.login);
      console.log('   Name:', response.data.name);
      console.log('\n✅ All checks passed! MCP server should work.\n');
    })
    .catch((error: any) => {
      console.log('   ❌ GitHub authentication failed:', error.message);
      console.log('\n⚠️  Check your GITHUB_TOKEN in .env file\n');
    });
} catch (error: any) {
  console.log('   ❌ Failed to test GitHub:', error.message);
}
