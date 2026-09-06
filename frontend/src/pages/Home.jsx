import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FileText, Shield, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react'

export default function Home() {
  const { isAuthenticated, user, isCustomer, isAdmin } = useAuth()

  if (isAuthenticated && isCustomer) {
    return <Navigate to="/apply" replace />
  }

  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/50 via-purple-200/40 to-cyan-200/40 blur-[130px]" />

      <div className="mx-auto max-w-6xl px-6 text-center">
        {/* Dynamic CTA buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {isAuthenticated ? (
            isCustomer ? (
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-95"
              >
                <FileText className="h-5 w-5" />
                Create Your Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : isAdmin ? (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-purple-600/25 transition-all hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-95"
              >
                <Shield className="h-5 w-5" />
                Go to Admin Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-50 transition-all active:scale-95"
              >
                <UserCheck className="h-5 w-5 text-indigo-600" />
                Customer Portal
              </Link>
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-6 py-3.5 text-base font-semibold text-purple-700 shadow-sm hover:border-purple-300 hover:bg-purple-100 transition-all active:scale-95"
              >
                <Shield className="h-5 w-5 text-purple-600" />
                Admin Portal
              </Link>
            </>
          )}
        </div>

        {/* Current status chip */}
        {isAuthenticated && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs text-emerald-800 shadow-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>
              Signed in as <strong className="text-slate-900">{user?.email}</strong> ({user?.role})
            </span>
          </div>
        )}

        {/* Feature cards */}
        <div className="mt-20 grid gap-6 text-left md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md hover:-translate-y-1">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <UserCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Customer Portal</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Login as a Customer to access the customer portal. If not registered yet, just click on the Register button.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md hover:-translate-y-1">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Submit Your Data</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Submit your basic data once and we will remember you.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md hover:-translate-y-1">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Admin Portal</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Login as an Admin to access the admin portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
