function Home({ navigate }) {
  return (
    <div className="min-h-screen bg-white">

      {/* ================= NAVBAR ================= */}

      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">

        <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <span className="text-2xl">⚡</span>
          <span>Agentic Commerce</span>
        </div>

        <nav className="flex items-center gap-3">

          <button
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
            onClick={() => navigate("/register")}
          >
            Register
          </button>

        </nav>

      </header>


      {/* ================= HERO ================= */}

      <main>

        <section className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6">

          <div className="text-center">

            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">

              Welcome to{" "}

              <span className="text-purple-600">
                Agentic Commerce
              </span>

            </h1>

            <p className="mt-5 text-xl text-gray-500">
              Shop smarter with AI
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Home;