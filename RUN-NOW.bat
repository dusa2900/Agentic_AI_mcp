@echo off
cls
echo.
echo ╔═══════════════════════════════════════════════╗
echo ║  MCP Tests - Fixed spawn EINVAL Error        ║
echo ╚═══════════════════════════════════════════════╝
echo.
echo Changed from: ts-node.cmd (causes EINVAL)
echo         To: node --require ts-node/register
echo.
echo This avoids spawn issues on Windows.
echo.
echo ═══════════════════════════════════════════════
echo.

cd backend

echo Running tests...
echo.
npm run mcp:test

set RESULT=%errorlevel%

echo.
echo ═══════════════════════════════════════════════
if %RESULT% equ 0 (
    echo  ✅ ALL TESTS PASSED!
    echo ═══════════════════════════════════════════════
    echo.
    echo Next: Configure Claude Desktop
    echo See: CLAUDE_DESKTOP_SETUP.md
) else (
    echo  ❌ Tests failed with exit code: %RESULT%
    echo ═══════════════════════════════════════════════
)
echo.
pause
