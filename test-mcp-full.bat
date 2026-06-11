@echo off
REM Comprehensive MCP Test Runner with Diagnostics - Windows

echo ╔═══════════════════════════════════════════════╗
echo ║  MCP Test Runner - With Diagnostics          ║
echo ╚═══════════════════════════════════════════════╝
echo.

cd backend

REM Check if dependencies are installed
if not exist "node_modules\@modelcontextprotocol" (
    echo ⚠️  MCP SDK not found. Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        exit /b 1
    )
    echo ✅ Dependencies installed
    echo.
)

REM Run diagnostic first
echo 🔍 Running diagnostic checks...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
call npm run mcp:diagnostic
set DIAGNOSTIC_EXIT=%errorlevel%
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

if %DIAGNOSTIC_EXIT% neq 0 (
    echo ⚠️  Diagnostic checks found issues. Attempting to run tests anyway...
    echo.
) else (
    echo ✅ Diagnostic checks passed!
    echo.
)

REM Run the actual tests
echo 🧪 Running MCP integration tests...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
call npm run mcp:test
set TEST_EXIT=%errorlevel%
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

if %TEST_EXIT% equ 0 (
    echo ✅ All tests passed successfully!
    pause
    exit /b 0
) else (
    echo ❌ Tests failed with exit code: %TEST_EXIT%
    echo.
    echo Troubleshooting tips:
    echo   1. Check that GITHUB_TOKEN is valid in .env
    echo   2. Verify GitHub token has required scopes: repo, read:org, workflow
    echo   3. Check network connectivity to GitHub API
    echo   4. Review any error messages above
    pause
    exit /b 1
)
