/**
 * theme.js — Design tokens
 * Keep in sync with CSS variables in index.css.
 * Use these in JS logic (e.g. chart colors, dynamic styles).
 */
const theme = {
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
