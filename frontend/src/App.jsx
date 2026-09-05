import { useState } from 'react'
import Navbar from './components/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <section
          id="overview"
          className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36"
        >
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[550px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-cyan-400/20 blur-[120px]" />
          <div className="pointer-events-none absolute top-1/2 right-10 -z-10 h-72 w-72 rounded-full bg-purple-600/15 blur-[100px]" />

          <div className="mx-auto max-w-6xl px-6 text-center">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
              Tailwind CSS v4 Configured & Ready
            </div>

            {/* Main Headline */}
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl font-['Outfit']">
              Modern Frontend with{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Tailwind CSS v4
              </span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed sm:text-xl">
              Clean, utility-first styling powered by the new CSS-first Vite engine.
              Zero boilerplate configs, instant compilation, and modern aesthetics.
            </p>

            {/* Interactive Counter Showcase */}
            <div className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                Interactive State Demo
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setCount((c) => c + 1)}
                  className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-95"
                >
                  <svg
                    className="h-5 w-5 transition-transform group-hover:rotate-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Increment Counter
                </button>
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 font-mono text-xl font-bold text-indigo-300 min-w-[70px]">
                  {count}
                </div>
                {count > 0 && (
                  <button
                    type="button"
                    onClick={() => setCount(0)}
                    className="text-xs text-slate-500 hover:text-rose-400 transition-colors underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Click to test React state updates and Tailwind reactive utility states.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section
          id="features"
          className="border-t border-slate-900 bg-slate-950/60 py-20 backdrop-blur-sm"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl font-['Outfit']">
                Setup Highlights
              </h2>
              <p className="mt-2 text-slate-400">
                What makes this Tailwind CSS v4 setup fast and modern
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Card 1 */}
              <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-indigo-500/10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/30">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  @tailwindcss/vite Plugin
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Tailwind CSS v4 integrates directly into Vite as a native plugin.
                  No separate PostCSS pipeline or tailwind.config file needed.
                </p>
              </div>

              {/* Card 2 */}
              <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-purple-500/10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  CSS-First Configuration
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Themes, custom fonts, and extensions live directly in CSS via{' '}
                  <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-purple-300 font-mono">
                    @theme
                  </code>{' '}
                  rules in <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-purple-300 font-mono">index.css</code>.
                </p>
              </div>

              {/* Card 3 */}
              <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-cyan-500/10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Bootstrap Fully Replaced
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Clean responsive layout utilities, flexbox, grid, glassmorphism,
                  and modern dark aesthetic without any heavy external UI libraries.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-sm text-slate-500">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Fullstack Portal. Styled with Tailwind CSS v4.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-indigo-400"
            >
              Tailwind Docs
            </a>
            <a
              href="https://vite.dev"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-indigo-400"
            >
              Vite Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
