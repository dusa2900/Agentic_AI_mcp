@echo off
echo.
echo ═══════════════════════════════════════════════
echo  Quick Fix: Install MCP SDK
echo ═══════════════════════════════════════════════
echo.

cd backend

echo Checking node_modules...
if not exist "node_modules" (
    echo ❌ node_modules not found
    echo.
    echo Installing all dependencies...
    npm install
    if errorlevel 1 (
        echo.
        echo ❌ npm install failed!
        pause
        exit /b 1
    )
    echo.
    echo ✅ Dependencies installed
) else (
    echo ✅ node_modules exists
)

echo.
echo Checking MCP SDK...
if not exist "node_modules\@modelcontextprotocol\sdk" (
    echo ❌ MCP SDK not found
    echo.
    echo Installing MCP SDK...
    npm install @modelcontextprotocol/sdk@^0.5.0
    if errorlevel 1 (
        echo.
        echo ❌ Failed to install MCP SDK!
        pause
        exit /b 1
    )
    echo.
    echo ✅ MCP SDK installed
) else (
    echo ✅ MCP SDK exists
)

echo.
echo ═══════════════════════════════════════════════
echo  Running diagnostic again...
echo ═══════════════════════════════════════════════
echo.

npm run mcp:diagnostic

echo.
pause
