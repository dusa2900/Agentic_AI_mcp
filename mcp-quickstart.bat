@echo off
REM MCP Server Quick Start Script for Windows
REM This script helps you get the MCP server running quickly

echo ╔═══════════════════════════════════════════════╗
echo ║  GitHub MCP Server - Quick Start             ║
echo ╚═══════════════════════════════════════════════╝
echo.

REM Check if .env exists
if not exist "backend\.env" (
    echo ⚠️  Warning: backend\.env file not found
    echo Creating .env from example...
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo ✅ Created backend\.env - Please edit it with your GitHub token
    ) else (
        echo ❌ No .env.example found. Creating basic .env...
        (
            echo # GitHub Configuration
            echo GITHUB_TOKEN=your_github_token_here
            echo GITHUB_OWNER=your_github_username
            echo GITHUB_REPO=your_default_repo
            echo.
            echo # Database Configuration  
            echo DATABASE_URL=postgresql://user:password@localhost:5432/carpool
            echo JWT_SECRET=your-secret-key-here
        ) > backend\.env
        echo ✅ Created backend\.env - Please edit it with your credentials
    )
    echo.
)

REM Check if dependencies are installed
if not exist "backend\node_modules" (
    echo 📦 Installing dependencies...
    cd backend
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        exit /b 1
    )
    cd ..
    echo ✅ Dependencies installed
    echo.
)

REM Build the project
echo 🔨 Building project...
cd backend
call npm run build
if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build complete
echo.

REM Run tests
echo 🧪 Running MCP tests...
call npm run mcp:test
if errorlevel 1 (
    echo ❌ Tests failed
    exit /b 1
)

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║  ✅ MCP Server is ready!                     ║
echo ╚═══════════════════════════════════════════════╝
echo.
echo Next steps:
echo   1. Run the server: npm run mcp:server
echo   2. Configure Claude Desktop (see CLAUDE_DESKTOP_SETUP.md)
echo   3. Start using GitHub tools from Claude!
echo.

pause
