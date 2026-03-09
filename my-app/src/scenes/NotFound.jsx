import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-gray-500">Page not found</p>
      <Link to="/" className="text-blue-600 hover:underline text-sm">Go home</Link>
    </div>
  )
}
