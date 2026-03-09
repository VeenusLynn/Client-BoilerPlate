<#
.SYNOPSIS
    Scaffold a MERN client project from the CLI.

.DESCRIPTION
    Creates a new Vite + React project, then downloads and runs the
    Client-BoilerPlate setup script to add your standard stack
    (Tailwind, Zustand, React Router, etc.).

.EXAMPLE
    # Run without downloading:
    & ([scriptblock]::Create((irm https://raw.githubusercontent.com/VeenusLynn/Client-BoilerPlate/main/setup.ps1))) -Name my-app

    # Or download and run:
    irm https://raw.githubusercontent.com/VeenusLynn/Client-BoilerPlate/main/setup.ps1 -OutFile setup.ps1
    .\setup.ps1 -Name my-app
#>
param(
    [Parameter(Position = 0)]
    [string]$Name = "my-app"
)

$ErrorActionPreference = "Stop"

$BASE_URL   = "https://raw.githubusercontent.com/VeenusLynn/Client-BoilerPlate/main"
$ScriptFile = "setup-boilerplate.mjs"
$DownloadUrl = "$BASE_URL/$ScriptFile"

# ── Pre-flight checks ─────────────────────────────────────────────────────────

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Install it from https://nodejs.org"
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm is not installed. Install Node.js from https://nodejs.org"
    exit 1
}

# ── Create Vite + React project ───────────────────────────────────────────────

Write-Host ""
Write-Host "  Creating Vite + React project: $Name" -ForegroundColor Cyan

npx -y create-vite@latest $Name -- --template react

Push-Location $Name

try {
    # ── Install Vite dependencies ──────────────────────────────────────────────
    Write-Host "  Installing Vite dependencies..." -ForegroundColor Cyan
    npm install

    # ── Download the setup script ──────────────────────────────────────────────
    Write-Host "  Downloading $ScriptFile..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $ScriptFile -UseBasicParsing

    # ── Run the setup script ───────────────────────────────────────────────────
    Write-Host "  Running boilerplate setup..." -ForegroundColor Cyan
    node $ScriptFile

    # ── Cleanup ────────────────────────────────────────────────────────────────
    Remove-Item $ScriptFile -Force

    Write-Host ""
    Write-Host "  Done! cd into '$Name' and run 'npm run dev'" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Error "Setup failed: $_"
    exit 1
}
finally {
    Pop-Location
}
