#!/bin/bash

# Comprehensive MCP Test Runner with Diagnostics

echo "╔═══════════════════════════════════════════════╗"
echo "║  MCP Test Runner - With Diagnostics          ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

cd backend

# Check if dependencies are installed
if [ ! -d "node_modules/@modelcontextprotocol" ]; then
    echo "⚠️  MCP SDK not found. Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
    echo ""
fi

# Run diagnostic first
echo "🔍 Running diagnostic checks..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run mcp:diagnostic
DIAGNOSTIC_EXIT=$?
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $DIAGNOSTIC_EXIT -ne 0 ]; then
    echo "⚠️  Diagnostic checks found issues. Attempting to run tests anyway..."
    echo ""
else
    echo "✅ Diagnostic checks passed!"
    echo ""
fi

# Run the actual tests
echo "🧪 Running MCP integration tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run mcp:test
TEST_EXIT=$?
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $TEST_EXIT -eq 0 ]; then
    echo "✅ All tests passed successfully!"
    exit 0
else
    echo "❌ Tests failed with exit code: $TEST_EXIT"
    echo ""
    echo "Troubleshooting tips:"
    echo "  1. Check that GITHUB_TOKEN is valid in .env"
    echo "  2. Verify GitHub token has required scopes: repo, read:org, workflow"
    echo "  3. Check network connectivity to GitHub API"
    echo "  4. Review any error messages above"
    exit 1
fi
