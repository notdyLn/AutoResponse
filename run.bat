@echo off
chcp 65001
cls
title AutoResponse

for /f "tokens=1,2 delims==" %%A in ('type .env') do (
    set %%A=%%B
)

echo Debug Mode: %DEBUG_MODE%

node src/client.js

if "%DEBUG_MODE%"=="true" (
    pause
)

call run.bat