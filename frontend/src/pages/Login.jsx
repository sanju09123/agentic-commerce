import { useState } from "react";
import { loginUser } from "../api";

function Login({ navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(
        email,
        password
      );

      console.log(
        "Login successful:",
        data
      );

      // ==========================================
      // SAVE LOGIN INFORMATION
      // ==========================================

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      // Save user ID
      if (data.userId) {
        localStorage.setItem(
          "userId",
          data.userId
        );
      }

      // Save user name
      if (data.name) {
        localStorage.setItem(
          "userName",
          data.name
        );
      }

      // ==========================================
      // SAVE ROLE
      // ==========================================

      if (data.role) {
        localStorage.setItem(
          "role",
          data.role.toUpperCase()
        );
      }

      // ==========================================
      // REDIRECT BASED ON ROLE
      // ==========================================

      if (
        data.role?.toUpperCase() ===
        "SELLER"
      ) {
        navigate("/seller");
      } else {
        navigate("/products");
      }

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">

        <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <span className="text-2xl">
            ⚡
          </span>

          <span>
            Agentic Commerce
          </span>
        </div>

        <button
          type="button"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

      </nav>


      {/* ==========================================
          LOGIN
      ========================================== */}

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">

        <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">

          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Login
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Welcome back to Agentic Commerce
            </p>

          </div>


          <form
            className="space-y-5"
            onSubmit={handleLogin}
          >

            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>


            {/* PASSWORD */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>


            {/* LOGIN */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>


          {/* ERROR */}

          {error && (
            <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
              {error}
            </p>
          )}

        </section>

      </main>

    </div>
  );
}

export default Login;