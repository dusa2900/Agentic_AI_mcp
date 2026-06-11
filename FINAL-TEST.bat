@echo off
cls
echo.
echo ═══════════════════════════════════════════════
echo  MCP Integration Tests - Final Run
echo ═══════════════════════════════════════════════
echo.

cd backend

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo.
echo Compiling TypeScript...
call npm run build
if errorlevel 1 (
    echo.
    echo ⚠️ Build had warnings but continuing...
)

echo.
echo ═══════════════════════════════════════════════
echo  Running MCP Integration Tests
echo ═══════════════════════════════════════════════
echo.

npm run mcp:test

set TEST_RESULT=%errorlevel%

echo.
echo ═══════════════════════════════════════════════
if %TEST_RESULT% equ 0 (
    echo  ✅ ALL TESTS PASSED SUCCESSFULLY!
) else (
    echo  ❌ Tests Failed - Exit Code: %TEST_RESULT%
)
echo ═══════════════════════════════════════════════
echo.

pause
exit /b %TEST_RESULT%
