/**
 * Example Usage: GitHub MCP Agent
 * 
 * This file demonstrates various ways to use the GitHub MCP Agent
 * for different development workflow scenarios.
 */

import { createGitHubAgent } from './github-agent-client';

/**
 * Example 1: Basic Branch Creation and Commit
 */
async function example1_BasicWorkflow() {
  console.log('\n=== Example 1: Basic Branch and Commit ===\n');
  
  const agent = createGitHubAgent();
  
  // Create a new feature branch
  const branch = await agent.createBranch('feature/add-seat-selection');
  console.log('Branch created:', branch);
  
  // Commit some files
  const commit = await agent.commit(
    'feature/add-seat-selection',
    'feat: add seat selection component',
    [
      {
        path: 'src/components/SeatSelection.tsx',
        content: `
import React from 'react';

export const SeatSelection = () => {
  return <div>Seat Selection Component</div>;
};
        `.trim()
      },
      {
        path: 'src/components/SeatSelection.test.tsx',
        content: `
import { render } from '@testing-library/react';
import { SeatSelection } from './SeatSelection';

test('renders seat selection', () => {
  const { getByText } = render(<SeatSelection />);
  expect(getByText(/Seat Selection/i)).toBeInTheDocument();
});
        `.trim()
      }
    ]
  );
  console.log('Commit result:', commit);
}

/**
 * Example 2: Full Feature Development Workflow
 */
async function example2_FullFeatureWorkflow() {
  console.log('\n=== Example 2: Full Feature Workflow ===\n');
  
  const agent = createGitHubAgent();
  
  const result = await agent.executeWorkflow({
    featureName: 'feature/US-007-booking-flow',
    commitMessage: 'feat(booking): implement complete booking flow with validation',
    files: [
      {
        path: 'src/components/BookingForm.tsx',
        content: '// BookingForm component implementation'
      },
      {
        path: 'src/hooks/useBooking.ts',
        content: '// useBooking custom hook'
      },
      {
        path: 'src/api/bookings.ts',
        content: '// Booking API service'
      }
    ],
    checkConflictsWithBranch: 'main'
  });
  
  console.log('\nWorkflow Steps:');
  result.steps.forEach(step => console.log(step));
  console.log('\nWorkflow Success:', result.success);
}

/**
 * Example 3: Check Repository Issues and Errors
 */
async function example3_MonitorIssuesAndErrors() {
  console.log('\n=== Example 3: Monitor Issues and Errors ===\n');
  
  const agent = createGitHubAgent();
  
  // Get open issues
  const issues = await agent.getIssues('open');
  console.log(`\nOpen Issues: ${issues.count}`);
  if (issues.success && issues.issues) {
    issues.issues.slice(0, 3).forEach((issue: any) => {
      console.log(`  #${issue.number}: ${issue.title}`);
    });
  }
  
  // Check CI/CD errors on main branch
  const errors = await agent.getErrors('main');
  console.log(`\nCI/CD Status:`, errors.message);
  if (errors.hasErrors) {
    console.log('Failed Checks:');
    errors.errors.forEach((error: any) => {
      console.log(`  - ${error.name}: ${error.conclusion}`);
    });
  }
}

/**
 * Example 4: Merge Conflict Detection
 */
async function example4_CheckMergeConflicts() {
  console.log('\n=== Example 4: Merge Conflict Detection ===\n');
  
  const agent = createGitHubAgent();
  
  const conflicts = await agent.checkMergeConflicts('main', 'develop');
  
  console.log('Merge Status:', conflicts.status);
  console.log('Ahead by:', conflicts.ahead_by, 'commits');
  console.log('Behind by:', conflicts.behind_by, 'commits');
  
  if (conflicts.hasConflicts) {
    console.log('\nPotential Conflicts:');
    conflicts.conflicts.forEach((conflict: any) => {
      console.log(`  - ${conflict.path} (${conflict.conflictType})`);
    });
  } else {
    console.log('\n✓ No conflicts detected - safe to merge!');
  }
}

/**
 * Example 5: List User Repositories
 */
async function example5_ListRepositories() {
  console.log('\n=== Example 5: Repository Listing ===\n');
  
  const agent = createGitHubAgent();
  
  // List authenticated user's repos
  const myRepos = await agent.listRepositories();
  console.log(`\nYour Repositories: ${myRepos.count}`);
  if (myRepos.success && myRepos.repositories) {
    myRepos.repositories.slice(0, 5).forEach((repo: any) => {
      console.log(`  - ${repo.fullName} (${repo.language || 'N/A'})`);
      console.log(`    ⭐ ${repo.stars} | 🍴 ${repo.forks}`);
    });
  }
}

/**
 * Example 6: Dev Orchestrator Integration
 */
async function example6_DevOrchestratorIntegration() {
  console.log('\n=== Example 6: Dev Orchestrator Integration ===\n');
  
  const agent = createGitHubAgent();
  
  // Simulate different workflow stages
  const stages = [
    {
      name: 'requirements',
      context: { branchName: 'feature/US-123-payment-integration' }
    },
    {
      name: 'implementation',
      context: {
        branch: 'feature/US-123-payment-integration',
        commitMessage: 'feat: add payment integration',
        files: [
          { path: 'src/payment.ts', content: '// Payment logic' }
        ]
      }
    },
    {
      name: 'testing',
      context: { branch: 'feature/US-123-payment-integration' }
    },
    {
      name: 'review',
      context: {
        baseBranch: 'main',
        branch: 'feature/US-123-payment-integration'
      }
    }
  ];
  
  for (const stage of stages) {
    console.log(`\nExecuting ${stage.name} stage...`);
    const result = await agent.handleStageTask(stage.name, stage.context);
    console.log(`Result:`, result.success ? '✓' : '✗', result.message || '');
  }
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  GitHub MCP Agent - Usage Examples        ║');
  console.log('╚════════════════════════════════════════════╝');
  
  try {
    // Uncomment the examples you want to run:
    
    // await example1_BasicWorkflow();
    // await example2_FullFeatureWorkflow();
    // await example3_MonitorIssuesAndErrors();
    // await example4_CheckMergeConflicts();
    // await example5_ListRepositories();
    // await example6_DevOrchestratorIntegration();
    
    console.log('\n✓ Examples completed!\n');
  } catch (error) {
    console.error('\n✗ Error running examples:', error);
  }
}

// Export for use in other modules
export {
  example1_BasicWorkflow,
  example2_FullFeatureWorkflow,
  example3_MonitorIssuesAndErrors,
  example4_CheckMergeConflicts,
  example5_ListRepositories,
  example6_DevOrchestratorIntegration
};

// Run if executed directly
if (require.main === module) {
  runAllExamples();
}
