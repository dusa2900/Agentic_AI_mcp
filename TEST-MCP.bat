@echo off
cls
echo.
echo ╔═══════════════════════════════════════════════╗
echo ║  MCP Integration Tests - READY TO RUN        ║
echo ╚═══════════════════════════════════════════════╝
echo.
echo All fixes applied:
echo   ✅ Fixed import paths
echo   ✅ Fixed .env loading
echo   ✅ Fixed ts-node execution
echo   ✅ Fixed GitHubMCPClient type exports
echo   ✅ Fixed ESM/CommonJS compatibility
echo.
echo ═══════════════════════════════════════════════
echo.

cd backend

echo [1/3] Checking environment...
if not exist ".env" (
    echo ❌ .env file not found!
    echo Please create backend\.env with GITHUB_TOKEN
    pause
    exit /b 1
)
echo ✅ .env file exists

echo.
echo [2/3] Checking dependencies...
if not exist "node_modules\@modelcontextprotocol" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ npm install failed!
        pause
        exit /b 1
    )
)
echo ✅ Dependencies installed

echo.
echo [3/3] Running MCP Integration Tests...
echo.
echo ═══════════════════════════════════════════════
echo.

call npm run mcp:test

set EXIT_CODE=%errorlevel%

echo.
echo ═══════════════════════════════════════════════
if %EXIT_CODE% equ 0 (
    echo.
    echo ╔═══════════════════════════════════════════════╗
    echo ║  ✅ SUCCESS! ALL TESTS PASSED!               ║
    echo ╚═══════════════════════════════════════════════╝
    echo.
    echo Your MCP server is working correctly!
    echo You can now configure Claude Desktop.
    echo See: CLAUDE_DESKTOP_SETUP.md
) else (
    echo.
    echo ╔═══════════════════════════════════════════════╗
    echo ║  ❌ TESTS FAILED - Exit Code: %EXIT_CODE%
    echo ╚═══════════════════════════════════════════════╝
    echo.
    echo Please check the error messages above.
)
echo.
pause
exit /b %EXIT_CODE%
