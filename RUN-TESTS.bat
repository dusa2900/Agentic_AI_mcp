@echo off
cls
echo.
echo ═══════════════════════════════════════════════
echo  MCP Tests - Direct ts-node Path
echo ═══════════════════════════════════════════════
echo.
echo Fixed: Using direct path to ts-node from 
echo node_modules/.bin/ts-node.cmd
echo.
echo This avoids issues with npx and PATH resolution
echo.
echo ═══════════════════════════════════════════════
echo.

cd backend

echo Testing if ts-node works...
node_modules\.bin\ts-node --version
if errorlevel 1 (
    echo ❌ ts-node not working
    echo.
    echo Installing dependencies...
    npm install
    pause
    exit /b 1
)
echo ✅ ts-node found
echo.

echo Running MCP integration tests...
echo.
npm run mcp:test

echo.
if %errorlevel% equ 0 (
    echo.
    echo ═══════════════════════════════════════════════
    echo  ✅ ALL TESTS PASSED!
    echo ═══════════════════════════════════════════════
) else (
    echo.
    echo ═══════════════════════════════════════════════
    echo  ❌ Tests Failed - See errors above
    echo ═══════════════════════════════════════════════
)
echo.
pause
