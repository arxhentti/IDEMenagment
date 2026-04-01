param(
    [string]$BackendPath = "C:\Project\IDEMenagment\IDEMenagment"
)

$ErrorActionPreference = "Stop"

$frontendRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $frontendRoot "dist"
$wwwrootPath = Join-Path $BackendPath "wwwroot"

Write-Host "Building frontend..." -ForegroundColor Cyan
Push-Location $frontendRoot
try {
    npm run build
}
finally {
    Pop-Location
}

if (-not (Test-Path $distPath)) {
    throw "Frontend build output not found at $distPath"
}

Write-Host "Publishing frontend to $wwwrootPath" -ForegroundColor Cyan

if (Test-Path $wwwrootPath) {
    Remove-Item $wwwrootPath -Recurse -Force
}

New-Item -ItemType Directory -Path $wwwrootPath | Out-Null
Copy-Item (Join-Path $distPath "*") $wwwrootPath -Recurse -Force

Write-Host "Frontend published successfully." -ForegroundColor Green
