#!/usr/bin/env node

/**
 * MERN Client Boilerplate Setup
 * Runs on an existing Vite + React project to add your standard stack.
 *
 * Workflow:
 *   1. npm create vite@latest my-app   (pick React + JavaScript)
 *   2. cd my-app
 *   3. node path/to/setup-boilerplate.mjs
 */

import { execSync } from "child_process";
import { mkdirSync, writeFileSync, existsSync, rmSync } from "fs";
import { join, resolve } from "path";

// ── Helpers ───────────────────────────────────────────────────────────────────

const run = (cmd) => execSync(cmd, { stdio: "inherit", cwd: projectDir });
const write = (filePath, content) => writeFileSync(filePath, content, "utf8");
const mkdir = (...parts) => mkdirSync(join(...parts), { recursive: true });

const projectDir = resolve(process.cwd());
const projectName = projectDir.split(/[\\/]/).pop();

// Guard: make sure we're inside a Vite project
if (
  !existsSync(join(projectDir, "vite.config.js")) &&
  !existsSync(join(projectDir, "vite.config.ts"))
) {
  console.error("\n❌  No vite.config.js found.");
  console.error("    Run this script from inside your Vite project folder.\n");
  process.exit(1);
}

console.log(`\n⚡  Setting up boilerplate in: ${projectName}`);
console.log("=".repeat(52));

// ── 1. Install dependencies ───────────────────────────────────────────────────

console.log("\n📦  Installing dependencies...");
run("npm install react-router-dom axios zustand react-hot-toast clsx");
run("npm install -D tailwindcss @tailwindcss/vite");

// ── 2. Clean up Vite defaults we don't need ───────────────────────────────────

console.log("\n🧹  Cleaning up Vite defaults...");
const toDelete = ["src/App.css", "src/assets/react.svg", "public/vite.svg"];
toDelete.forEach((f) => {
  const full = join(projectDir, f);
  if (existsSync(full)) rmSync(full);
});

// ── 3. Create folder structure ────────────────────────────────────────────────

console.log("\n📁  Creating folder structure...");
mkdir(projectDir, "src/assets");
mkdir(projectDir, "src/components/ui");
mkdir(projectDir, "src/components/layout");
mkdir(projectDir, "src/hooks");
mkdir(projectDir, "src/state");
mkdir(projectDir, "src/services");
mkdir(projectDir, "src/scenes");
mkdir(projectDir, "src/utils");

// ── 4. Config files ───────────────────────────────────────────────────────────

console.log("\n✍️   Writing config files...");

write(
  join(projectDir, "tailwind.config.js"),
  `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          900: 'var(--color-primary-900)',
        },
        surface:    'var(--color-surface)',
        background: 'var(--color-background)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
    },
  },
  plugins: [],
}
`,
);

write(
  join(projectDir, "vite.config.js"),
  `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
`,
);

// ── 5. CSS + theme ────────────────────────────────────────────────────────────

write(
  join(projectDir, "src/index.css"),
  `@import "tailwindcss";

/* ─────────────────────────────────────────────
   CSS Custom Properties — edit in theme.js too
   ───────────────────────────────────────────── */
:root {
  --color-primary-50:  #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-900: #1e3a8a;
  --color-surface:     #ffffff;
  --color-background:  #f8fafc;

  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;

  --navbar-height: 64px;
}

.dark {
  --color-surface:    #1e293b;
  --color-background: #0f172a;
}

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background-color: var(--color-background);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
`,
);

write(
  join(projectDir, "src/theme.js"),
  `const theme = {
  colors: {
    primary: {
      50:  '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    surface:    '#ffffff',
    background: '#f8fafc',
  },
  fontFamily: {
    sans: "'Inter', system-ui, sans-serif",
    mono: "'Fira Code', monospace",
  },
  navbar: { height: '64px' },
}

export default theme
`,
);

// ── 6. Services ───────────────────────────────────────────────────────────────

write(
  join(projectDir, "src/services/api.js"),
  `import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = \`Bearer \${token}\`
    return config
  },
  (error) => Promise.reject(error)
)

// Global response error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(new Error(message))
  }
)

export default api
`,
);

// ── 7. Hooks ──────────────────────────────────────────────────────────────────

write(
  join(projectDir, "src/hooks/useApi.js"),
  `import { useState, useEffect, useCallback } from 'react'

export function useApi(apiFn, ...args) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const execute = useCallback(async (...overrideArgs) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFn(...(overrideArgs.length ? overrideArgs : args))
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line

  useEffect(() => { if (apiFn && args.length) execute() }, []) // eslint-disable-line

  return { data, loading, error, execute }
}
`,
);

write(
  join(projectDir, "src/hooks/useLocalStorage.js"),
  `import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
`,
);

// ── 8. State ──────────────────────────────────────────────────────────────────

write(
  join(projectDir, "src/state/useAuthStore.js"),
  `import { create } from 'zustand'
import api from '@/services/api'

const useAuthStore = create((set) => ({
  user:  JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,

  register: async (data) => {
    const { user, token } = await api.post('/auth/register', data)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token })
  },

  login: async (credentials) => {
    const { user, token } = await api.post('/auth/login', credentials)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  setUser: (user) => set({ user }),
}))

export default useAuthStore
`,
);

// ── 9. Components ─────────────────────────────────────────────────────────────

write(
  join(projectDir, "src/components/ui/Button.jsx"),
  `import clsx from 'clsx'

const variants = {
  primary:   'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400',
  danger:    'bg-red-600  text-white hover:bg-red-700  focus:ring-red-500',
  ghost:     'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2   text-sm',
  lg: 'px-6 py-3   text-base',
}

export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  className,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
`,
);

write(
  join(projectDir, "src/components/layout/Navbar.jsx"),
  `import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '@/state/useAuthStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-6">
      <Link to="/" className="font-bold text-lg text-blue-600">MyApp</Link>
      <div className="flex-1" />
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.name || user.email}</span>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-900">
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/register" className="text-sm text-blue-600 hover:underline">Register</Link>
          <Link to="/login"    className="text-sm text-gray-600 hover:underline">Login</Link>
        </div>
      )}
    </nav>
  )
}
`,
);

write(
  join(projectDir, "src/components/layout/PageWrapper.jsx"),
  `export default function PageWrapper({ children, className = '' }) {
  return (
    <main className={\`max-w-7xl mx-auto px-4 sm:px-6 py-8 \${className}\`}>
      {children}
    </main>
  )
}
`,
);

// ── 10. Scenes ────────────────────────────────────────────────────────────────

write(
  join(projectDir, "src/scenes/Home.jsx"),
  `import PageWrapper from '@/components/layout/PageWrapper'

export default function Home() {
  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold text-gray-900">Home</h1>
      <p className="mt-2 text-gray-500">Your app starts here.</p>
    </PageWrapper>
  )
}
`,
);

write(
  join(projectDir, "src/scenes/Login.jsx"),
  `import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '@/state/useAuthStore'
import Button from '@/components/ui/Button'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const { login }  = useAuthStore()
  const navigate   = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign in</h1>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <Button onClick={handleSubmit} loading={loading} className="w-full">
            Sign in
          </Button>
        </div>
        <p className=\"mt-4 text-sm text-center text-gray-500\">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}
`,
);

write(
  join(projectDir, "src/scenes/Register.jsx"),
  `import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '@/state/useAuthStore'
import Button from '@/components/ui/Button'

export default function Register() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const { register } = useAuthStore()
  const navigate     = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      await register({ name, email, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create account</h1>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <Button onClick={handleSubmit} loading={loading} className="w-full">
            Create account
          </Button>
        </div>
        <p className="mt-4 text-sm text-center text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
`,
);

write(
  join(projectDir, "src/scenes/NotFound.jsx"),
  `import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-gray-500">Page not found</p>
      <Link to="/" className="text-blue-600 hover:underline text-sm">Go home</Link>
    </div>
  )
}
`,
);

// ── 11. Utils ─────────────────────────────────────────────────────────────────

write(
  join(projectDir, "src/utils/index.js"),
  `/** Format ISO date → "Jan 1, 2024" */
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

/** Truncate a string to maxLen chars */
export const truncate = (str, maxLen = 60) =>
  str.length > maxLen ? str.slice(0, maxLen) + '…' : str

/** Capitalize first letter */
export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1)

/** Sleep helper */
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms))
`,
);

// ── 12. App.jsx + main.jsx ────────────────────────────────────────────────────

write(
  join(projectDir, "src/App.jsx"),
  `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar    from '@/components/layout/Navbar'
import Home      from '@/scenes/Home'
import Login     from '@/scenes/Login'
import Register  from '@/scenes/Register'
import NotFound  from '@/scenes/NotFound'
import useAuthStore from '@/state/useAuthStore'

function PrivateRoute({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/register" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/"         element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="*"         element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
`,
);

write(
  join(projectDir, "src/main.jsx"),
  `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
);

// ── 13. .env files ────────────────────────────────────────────────────────────

if (!existsSync(join(projectDir, ".env.local"))) {
  write(
    join(projectDir, ".env.local"),
    "VITE_API_URL=http://localhost:5000/api\n",
  );
}
write(
  join(projectDir, ".env.example"),
  "VITE_API_URL=http://localhost:5000/api\n",
);

// ── Done ──────────────────────────────────────────────────────────────────────

console.log(`
✅  Boilerplate applied to: ${projectName}

Next steps:
  npm run dev   →  http://localhost:5173

Port layout:
  Client → http://localhost:5173  (this project, Vite default)
  API    → http://localhost:5000  (Express default)
  VITE_API_URL is pre-set to http://localhost:5000/api in .env.local
  Vite proxy forwards /api/* to localhost:5000 — no CORS issues in dev
`);
