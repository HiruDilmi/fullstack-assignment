import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, LogOut, User, FileText } from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, user, isAdmin, isCustomer, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl transition-all shadow-xs relative">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        <Link to="/" className="flex items-center gap-3 group">
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 font-['Outfit'] hover:text-indigo-600 transition-colors">
              Home
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 transition-colors text-purple-600 hover:text-purple-700"
            >
              <Shield className="h-4 w-4 text-purple-600" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          {isCustomer && (
            <Link
              to="/application"
              className="flex items-center gap-1.5 transition-colors text-indigo-600 hover:text-indigo-700"
            >
              <FileText className="h-4 w-4 text-indigo-600" />
              <span>My Profile</span>
            </Link>
          )}
        </nav>

        {/* Action / Auth Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="hidden sm:flex flex-col items-end sm:mr-28 2xl:mr-0">
              <span className="text-xs font-semibold text-slate-800">{user?.email}</span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isAdmin ? 'text-purple-600' : 'text-indigo-600'
                }`}
              >
                {user?.role}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95 shadow-xs"
              >
                <User className="h-3.5 w-3.5 text-slate-500" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-95"
              >
                Register
              </Link>
              <Link
                to="/admin/login"
                className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-all shadow-xs"
                title="Admin Login"
              >
                <Shield className="h-3.5 w-3.5 text-purple-600" />
                <span>Admin</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Logout button at right corner */}
      {isAuthenticated && (
        <div className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer shadow-xs"
            title="Log out"
          >
            <LogOut className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  )
}
