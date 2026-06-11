@echo off
REM Quick Test Runner for MCP Server - Windows
REM Run this script to test the MCP implementation after fixes

echo ╔═══════════════════════════════════════════════╗
echo ║  MCP Test Runner - Quick Fix Applied         ║
echo ╚═══════════════════════════════════════════════╝
echo.

cd backend

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies (including ts-node)...
    call npm install
    echo.
)

REM Check environment
if not exist ".env" (
    echo ⚠️  Warning: .env file not found
    echo Creating .env template...
    (
        echo # GitHub Configuration (REQUIRED^)
        echo GITHUB_TOKEN=your_github_token_here
        echo GITHUB_OWNER=your_github_username
        echo GITHUB_REPO=your_default_repo
        echo.
        echo # Get token at: https://github.com/settings/tokens
        echo # Required scopes: repo, read:org, workflow
    ) > .env
    echo ✅ Created .env template - Please edit it with your GitHub token
    echo.
    exit /b 1
)

echo 🚀 Running MCP integration tests...
echo.
call npm run mcp:test

echo.
echo ═══════════════════════════════════════════════
echo Test run complete!
echo.

pause
