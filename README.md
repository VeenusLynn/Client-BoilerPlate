# Client-BoilerPlate
A personal boiler plate for Vite+React Apps

## Quick Start

### PowerShell (Windows)
```powershell
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/VeenusLynn/Client-BoilerPlate/main/setup.ps1))) -Name my-app
```

### Bash (macOS / Linux)
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/VeenusLynn/Client-BoilerPlate/main/setup.sh) my-app
```

### What it does
1. Creates a new **Vite + React** project with `create-vite`
2. Installs base dependencies
3. Applies the boilerplate (Tailwind, Zustand, React Router, Axios, etc.)
4. Cleans up the setup script

Once finished:
```bash
cd my-app
npm run dev
```
