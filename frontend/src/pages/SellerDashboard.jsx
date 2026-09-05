function SellerDashboard({ navigate }) {
  const sellerName =
    localStorage.getItem("userName") || "Seller";

  const sellerId =
    localStorage.getItem("userId") || "N/A";

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          {/* LOGO */}

          <button
            type="button"
            onClick={() => navigate("/seller")}
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 transition hover:text-violet-600"
          >
            <span className="text-xl">
              ⚡
            </span>

            <span>
              Agentic Commerce
            </span>
          </button>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* ==========================================
          MAIN SELLER DASHBOARD
      ========================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome, {sellerName}
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Manage your products and orders from one place.
          </p>

        </div>

        {/* ==========================================
            SELLER INFO + ACTIONS
        ========================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* ==========================================
              SELLER PROFILE
          ========================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                👤
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Seller Profile
                </h2>

                <p className="text-sm text-slate-500">
                  Your seller account information
                </p>
              </div>

            </div>

            <div className="space-y-4">

              {/* SELLER NAME */}

              <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">

                <span className="text-sm text-slate-500">
                  Seller Name
                </span>

                <strong className="text-sm font-semibold text-slate-900">
                  {sellerName}
                </strong>

              </div>

              {/* SELLER ID */}

              <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">

                <span className="text-sm text-slate-500">
                  Seller ID
                </span>

                <strong className="break-all text-sm font-semibold text-slate-900">
                  {sellerId}
                </strong>

              </div>

              {/* ROLE */}

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-500">
                  Role
                </span>

                <strong className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                  SELLER
                </strong>

              </div>

            </div>

          </section>

          {/* ==========================================
              SELLER ACTIONS
          ========================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                ⚙️
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Seller Actions
                </h2>

                <p className="text-sm text-slate-500">
                  Manage your seller activities
                </p>
              </div>

            </div>

            <div className="space-y-3">

              {/* ==========================================
                  MY STORE
              ========================================== */}

              <button
                type="button"
                onClick={() =>
                  navigate("/seller/store")
                }
                className="group flex w-full items-center justify-between rounded-xl bg-violet-600 px-4 py-3 text-left text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
              >
                <span>
                  🏪 My Store
                </span>

                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </button>

              {/* ==========================================
                  VIEW ORDERS - COMING SOON
              ========================================== */}

              <button
                type="button"
                disabled
                title="Seller Orders coming soon"
                className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-400 opacity-70"
              >
                <span>
                  🧾 View Orders
                </span>

                <span className="text-xs font-bold uppercase tracking-wide">
                  Soon
                </span>
              </button>

            </div>

          </section>

        </div>

      </main>
    </div>
  );
}

export default SellerDashboard;