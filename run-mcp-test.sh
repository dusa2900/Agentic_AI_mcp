#!/bin/bash

# Quick Test Runner for MCP Server
# Run this script to test the MCP implementation after fixes

echo "╔═══════════════════════════════════════════════╗"
echo "║  MCP Test Runner - Quick Fix Applied         ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (including ts-node)..."
    npm install
    echo ""
fi

# Check if ts-node is available
if ! command -v npx ts-node &> /dev/null; then
    echo "⚠️  ts-node not found, installing..."
    npm install
    echo ""
fi

# Check environment
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Creating .env template..."
    cat > .env << EOF
# GitHub Configuration (REQUIRED)
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_default_repo

# Get token at: https://github.com/settings/tokens
# Required scopes: repo, read:org, workflow
EOF
    echo "✅ Created .env template - Please edit it with your GitHub token"
    echo ""
    exit 1
fi

# Check if GITHUB_TOKEN is set
source .env 2>/dev/null || true
if [ -z "$GITHUB_TOKEN" ] || [ "$GITHUB_TOKEN" = "your_github_token_here" ]; then
    echo "❌ Error: GITHUB_TOKEN not configured in .env"
    echo ""
    echo "Please edit backend/.env and set:"
    echo "  GITHUB_TOKEN=ghp_your_actual_token"
    echo ""
    echo "Get a token at: https://github.com/settings/tokens"
    exit 1
fi

echo "🚀 Running MCP integration tests..."
echo ""
npm run mcp:test

echo ""
echo "═══════════════════════════════════════════════"
echo "Test run complete!"
echo ""
