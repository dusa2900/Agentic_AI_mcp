#!/bin/bash

# MCP Server Quick Start Script
# This script helps you get the MCP server running quickly

echo "╔═══════════════════════════════════════════════╗"
echo "║  GitHub MCP Server - Quick Start             ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env file not found"
    echo "Creating .env from example..."
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo "✅ Created backend/.env - Please edit it with your GitHub token"
    else
        echo "❌ No .env.example found. Creating basic .env..."
        cat > backend/.env << EOF
# GitHub Configuration
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_default_repo

# Database Configuration  
DATABASE_URL=postgresql://user:password@localhost:5432/carpool
JWT_SECRET=your-secret-key-here
EOF
        echo "✅ Created backend/.env - Please edit it with your credentials"
    fi
    echo ""
fi

# Check if GITHUB_TOKEN is set
source backend/.env 2>/dev/null || true
if [ -z "$GITHUB_TOKEN" ] || [ "$GITHUB_TOKEN" = "your_github_token_here" ]; then
    echo "❌ Error: GITHUB_TOKEN not configured"
    echo ""
    echo "Please edit backend/.env and set your GitHub token:"
    echo "  GITHUB_TOKEN=ghp_your_actual_token_here"
    echo ""
    echo "Get a token at: https://github.com/settings/tokens"
    echo "Required scopes: repo, read:org, workflow"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Build the project
echo "🔨 Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build complete"
echo ""

# Run tests
echo "🧪 Running MCP tests..."
npm run mcp:test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║  ✅ MCP Server is ready!                     ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "  1. Run the server: npm run mcp:server"
echo "  2. Configure Claude Desktop (see CLAUDE_DESKTOP_SETUP.md)"
echo "  3. Start using GitHub tools from Claude!"
echo ""
