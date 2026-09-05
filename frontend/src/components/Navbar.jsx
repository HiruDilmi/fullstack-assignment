export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 shadow-md shadow-indigo-500/30">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white font-['Outfit']">
              Portal<span className="text-indigo-400">Hub</span>
            </span>
            <span className="ml-2 inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/30">
              Tailwind CSS v4
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          <a
            href="#overview"
            className="transition-colors hover:text-white"
          >
            Overview
          </a>
          <a
            href="#features"
            className="transition-colors hover:text-white"
          >
            Features
          </a>
          <a
            href="#status"
            className="transition-colors hover:text-white"
          >
            Stack Status
          </a>
          <a
            href="#docs"
            className="transition-colors hover:text-white"
          >
            Documentation
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Vite + Tailwind Ready
          </span>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-400 hover:to-violet-500 hover:shadow-indigo-500/40 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  )
}
