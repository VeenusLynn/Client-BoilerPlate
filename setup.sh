#!/usr/bin/env bash
#
# Scaffold a MERN client project from the CLI.
#
# Creates a new Vite + React project, then downloads and runs the
# Client-BoilerPlate setup script to add your standard stack
# (Tailwind, Zustand, React Router, etc.).
#
# Usage:
#   ./setup.sh [project-name]
#
# Examples:
#   ./setup.sh my-app
#   ./setup.sh
#
#   # Run without downloading:
#   bash <(curl -fsSL https://raw.githubusercontent.com/VeenusLynn/Client-BoilerPlate/main/setup.sh) my-app

set -euo pipefail

BASE_URL="https://raw.githubusercontent.com/VeenusLynn/Client-BoilerPlate/main"
SCRIPT_FILE="setup-boilerplate.mjs"
NAME="${1:-my-app}"

DOWNLOAD_URL="$BASE_URL/$SCRIPT_FILE"

# ── Pre-flight checks ─────────────────────────────────────────────────────────

if ! command -v node &> /dev/null; then
    echo "  ❌  Node.js is not installed. Install it from https://nodejs.org"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "  ❌  npm is not installed. Install Node.js from https://nodejs.org"
    exit 1
fi

if ! command -v curl &> /dev/null && ! command -v wget &> /dev/null; then
    echo "  ❌  curl or wget is required."
    exit 1
fi

# ── Create Vite + React project ───────────────────────────────────────────────

echo ""
echo "  ⚡  Creating Vite + React project: $NAME"

npx -y create-vite@latest "$NAME" -- --template react

cd "$NAME"

# ── Install Vite dependencies ─────────────────────────────────────────────────

echo "  📦  Installing Vite dependencies..."
npm install > /dev/null 2>&1

# ── Download the setup script ─────────────────────────────────────────────────

echo "  ⬇️   Downloading $SCRIPT_FILE..."
if command -v curl &> /dev/null; then
    curl -fsSL "$DOWNLOAD_URL" -o "$SCRIPT_FILE"
else
    wget -q "$DOWNLOAD_URL" -O "$SCRIPT_FILE"
fi

# ── Run the setup script ──────────────────────────────────────────────────────

echo "  ⚙️   Running boilerplate setup..."
node "$SCRIPT_FILE"

# ── Cleanup ────────────────────────────────────────────────────────────────────

rm -f "$SCRIPT_FILE"

echo ""
echo "  ✅  Done! Your client is ready."
echo ""
echo "  Next steps:"
echo "    cd '$NAME'  &&  npm run dev"
echo ""
echo "  Port layout:"
echo "    Client → http://localhost:5173  (this project, Vite default)"
echo "    API    → http://localhost:5000  (Express default)"
echo "    VITE_API_URL is pre-set to http://localhost:5000/api in .env.local"
echo "    Vite proxy forwards /api/* to localhost:5000 — no CORS issues in dev"
echo ""
