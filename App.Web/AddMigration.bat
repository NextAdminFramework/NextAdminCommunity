@echo off
set /p id="Enter migration name: "
dotnet ef migrations add %id%
pause