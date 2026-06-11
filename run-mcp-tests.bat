@echo off
cls
echo.
echo ═══════════════════════════════════════════════
echo  MCP Test - ESM/CommonJS Fix Applied
echo ═══════════════════════════════════════════════
echo.
echo The MCP SDK is an ESM package, but our project
echo uses CommonJS. Added .js extensions to MCP SDK
echo imports to resolve the conflict.
echo.
echo ═══════════════════════════════════════════════
echo.

cd backend

echo Running MCP Tests...
echo.

npm run mcp:test

echo.
if %errorlevel% equ 0 (
    echo ═══════════════════════════════════════════════
    echo  ✅ Tests Completed Successfully!
    echo ═══════════════════════════════════════════════
) else (
    echo ═══════════════════════════════════════════════
    echo  ❌ Tests Failed - Check errors above
    echo ═══════════════════════════════════════════════
)
echo.
pause
