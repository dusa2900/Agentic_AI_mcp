@echo off
cls
echo.
echo ═══════════════════════════════════════════════
echo  MCP Tests - ts-node ENOENT Fix Applied
echo ═══════════════════════════════════════════════
echo.
echo Fixed: Changed 'ts-node' to 'npx ts-node' 
echo This uses the local ts-node from node_modules
echo.
echo ═══════════════════════════════════════════════
echo.

cd backend

echo Running tests...
echo.
npm run mcp:test

echo.
pause
