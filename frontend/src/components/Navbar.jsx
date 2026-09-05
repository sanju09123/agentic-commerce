import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 transition hover:text-violet-600"
        >
          <span className="text-xl">⚡</span>
          <span>Agentic Commerce</span>
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-600"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-600"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
          >
            Register
          </Link>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;