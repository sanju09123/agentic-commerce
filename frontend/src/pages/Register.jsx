import { useState } from "react";
import { registerUser } from "../api";

function Register({ navigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("CUSTOMER");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await registerUser(
        name,
        email,
        password,
        role
      );

      console.log(
        "Register response:",
        data
      );

      setSuccess(
        "Registration successful!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= NAVBAR ================= */}

      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">

        <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <span className="text-2xl">
            ⚡
          </span>

          <span>
            Agentic Commerce
          </span>
        </div>

        <nav>
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            onClick={() => navigate("/")}
          >
            ← Back
          </button>
        </nav>

      </header>


      {/* ================= REGISTER ================= */}

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">

        <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">

          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join Agentic Commerce
            </p>

          </div>


          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* NAME */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>


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
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>


            {/* ROLE */}

            <div>

              <label className="mb-3 block text-sm font-medium text-gray-700">
                Register as
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* CUSTOMER */}

                <button
                  type="button"
                  className={
                    role === "CUSTOMER"
                      ? "rounded-lg border-2 border-purple-600 bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-700 transition"
                      : "rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                  }
                  onClick={() =>
                    setRole("CUSTOMER")
                  }
                >
                  🛒 Customer
                </button>


                {/* SELLER */}

                <button
                  type="button"
                  className={
                    role === "SELLER"
                      ? "rounded-lg border-2 border-purple-600 bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-700 transition"
                      : "rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                  }
                  onClick={() =>
                    setRole("SELLER")
                  }
                >
                  🏪 Seller
                </button>

              </div>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Registering..."
                : "Create Account"}
            </button>

          </form>


          {/* ERROR */}

          {error && (
            <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
              {error}
            </p>
          )}


          {/* SUCCESS */}

          {success && (
            <p className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-600">
              {success}
            </p>
          )}

        </section>

      </main>

    </div>
  );
}

export default Register;