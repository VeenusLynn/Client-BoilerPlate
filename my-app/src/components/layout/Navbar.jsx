/**
 * components/layout/Navbar.jsx
 */
import { Link, useNavigate } from 'react-router-dom'
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
        <Link to="/login" className="text-sm text-blue-600 hover:underline">Login</Link>
      )}
    </nav>
  )
}
