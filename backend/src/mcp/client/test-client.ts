/**
 * Test client for GitHub MCP Server
 * 
 * This script demonstrates how to use the MCP client to interact with
 * the GitHub MCP Server. It can be used for testing and validation.
 */

import { createGitHubMCPClient, GitHubMCPClient } from './github-mcp-client';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Test: List all available tools
 */
async function testListTools(client: any) {
  console.log('\n=== Test: List Tools ===');
  try {
    const result = await client.listTools();
    console.log('✅ Available tools:');
    result.tools.forEach((tool: any) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    return true;
  } catch (error) {
    console.error('❌ Failed:', error);
    return false;
  }
}

/**
 * Test: List all available resources
 */
async function testListResources(client: any) {
  console.log('\n=== Test: List Resources ===');
  try {
    const result = await client.listResources();
    console.log('✅ Available resources:');
    result.resources.forEach((resource: any) => {
      console.log(`  - ${resource.name} (${resource.uri})`);
    });
    return true;
  } catch (error) {
    console.error('❌ Failed:', error);
    return false;
  }
}

/**
 * Test: Create a branch
 */
async function testCreateBranch(client: any) {
  console.log('\n=== Test: Create Branch ===');
  try {
    const branchName = `test/mcp-${Date.now()}`;
    const result = await client.createBranch(branchName);
    console.log('✅ Branch created:', result);
    return true;
  } catch (error: any) {
    console.error('❌ Failed:', error.message);
    return false;
  }
}

/**
 * Test: List repositories
 */
async function testListRepositories(client: any) {
  console.log('\n=== Test: List Repositories ===');
  try {
    const result = await client.listRepositories();
    const parsed = JSON.parse(result.content[0].text);
    console.log(`✅ Found ${parsed.count} repositories`);
    if (parsed.repositories && parsed.repositories.length > 0) {
      console.log('First 3 repos:');
      parsed.repositories.slice(0, 3).forEach((repo: any) => {
        console.log(`  - ${repo.fullName} (${repo.language || 'N/A'})`);
      });
    }
    return true;
  } catch (error: any) {
    console.error('❌ Failed:', error.message);
    return false;
  }
}

/**
 * Test: Get issues
 */
async function testGetIssues(client: any) {
  console.log('\n=== Test: Get Issues ===');
  try {
    const result = await client.getIssues(undefined, undefined, 'open');
    const parsed = JSON.parse(result.content[0].text);
    console.log(`✅ Found ${parsed.count} open issues`);
    if (parsed.issues && parsed.issues.length > 0) {
      console.log('Recent issues:');
      parsed.issues.slice(0, 3).forEach((issue: any) => {
        console.log(`  - #${issue.number}: ${issue.title}`);
      });
    }
    return true;
  } catch (error: any) {
    console.error('❌ Failed:', error.message);
    return false;
  }
}

/**
 * Test: Check merge conflicts
 */
async function testMergeConflicts(client: any) {
  console.log('\n=== Test: Check Merge Conflicts ===');
  try {
    const result = await client.getMergeConflicts('main', 'develop');
    const parsed = JSON.parse(result.content[0].text);
    console.log('✅ Merge check result:');
    console.log(`  Status: ${parsed.status}`);
    console.log(`  Has conflicts: ${parsed.hasConflicts ? 'Yes' : 'No'}`);
    console.log(`  Ahead by: ${parsed.ahead_by} commits`);
    console.log(`  Behind by: ${parsed.behind_by} commits`);
    return true;
  } catch (error: any) {
    console.error('❌ Failed:', error.message);
    return false;
  }
}

/**
 * Test: Read a resource
 */
async function testReadResource(client: any) {
  console.log('\n=== Test: Read Resource ===');
  try {
    const result = await client.readResource('github://repositories');
    const parsed = JSON.parse(result.contents[0].text);
    console.log(`✅ Resource read successfully`);
    console.log(`  Found ${parsed.count} repositories`);
    return true;
  } catch (error: any) {
    console.error('❌ Failed:', error.message);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║  GitHub MCP Server - Integration Tests       ║');
  console.log('╚═══════════════════════════════════════════════╝');

  // Check environment
  if (!process.env.GITHUB_TOKEN) {
    console.error('\n❌ Error: GITHUB_TOKEN environment variable not set');
    console.error('Please set it in your .env file or export it:');
    console.error('  export GITHUB_TOKEN=your_token_here\n');
    process.exit(1);
  }

  let client: GitHubMCPClient | undefined;
  const results: { [key: string]: boolean } = {};

  try {
    console.log('\n📡 Connecting to MCP server...');
    client = await createGitHubMCPClient();
    console.log('✅ Connected successfully!\n');

    // Run all tests
    results['List Tools'] = await testListTools(client);
    results['List Resources'] = await testListResources(client);
    results['List Repositories'] = await testListRepositories(client);
    results['Get Issues'] = await testGetIssues(client);
    results['Check Merge Conflicts'] = await testMergeConflicts(client);
    results['Read Resource'] = await testReadResource(client);
    
    // Note: Create Branch test is commented out to avoid creating test branches
    // Uncomment if you want to test branch creation
    // results['Create Branch'] = await testCreateBranch(client);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  } finally {
    if (client) {
      console.log('\n📡 Disconnecting...');
      await client.disconnect();
      console.log('✅ Disconnected\n');
    }
  }

  // Print summary
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║  Test Summary                                 ║');
  console.log('╚═══════════════════════════════════════════════╝');

  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}`);
  });

  console.log(`\n${passed}/${total} tests passed\n`);

  if (passed === total) {
    console.log('🎉 All tests passed! MCP server is working correctly.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the output above.\n');
    process.exit(1);
  }
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch((error) => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

export { runTests };
