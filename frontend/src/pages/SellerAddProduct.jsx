import { useState } from "react";
import { createProduct } from "../api";

function SellerAddProduct({ navigate }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE PRODUCT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ==========================================
    // FRONTEND VALIDATION
    // ==========================================

    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!form.description.trim()) {
      setError("Product description is required");
      return;
    }

    if (!form.category.trim()) {
      setError("Product category is required");
      return;
    }

    if (form.price === "" || Number(form.price) <= 0) {
      setError("Price must be greater than zero");
      return;
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      setError("Stock cannot be negative");
      return;
    }

    try {
      setSaving(true);

      const response = await createProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
      });

      console.log("Product created:", response);

      navigate("/seller/products?created=true");
    } catch (err) {
      console.error(err);

      setError(
        err?.message || "Failed to create product"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">

          {/* LOGO ONLY */}

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

        </div>
      </nav>

      {/* =====================================
          PAGE
      ===================================== */}

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8">

          {/* BACK BUTTON */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Add Product
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Add a new product to your store.
          </p>

        </div>

        {/* =====================================
            FORM CARD
        ===================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* ERROR */}

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div
              role="status"
              className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
            >
              ✓ {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =====================================
                PRODUCT NAME
            ===================================== */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Product Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Samsung A22 5G"
                maxLength={150}
                disabled={saving}
                autoComplete="off"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            {/* =====================================
                DESCRIPTION
            ===================================== */}

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows={5}
                maxLength={1000}
                disabled={saving}
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            {/* =====================================
                CATEGORY
            ===================================== */}

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Smartphones"
                maxLength={100}
                disabled={saving}
                autoComplete="off"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            {/* =====================================
                PRICE + STOCK
            ===================================== */}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

              {/* PRICE */}

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Price (₹)
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="999.00"
                  disabled={saving}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              {/* STOCK */}

              <div>
                <label
                  htmlFor="stock"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Initial Stock
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="10"
                  disabled={saving}
                  inputMode="numeric"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

            </div>

            {/* =====================================
                INFO
            ===================================== */}

            <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-4">

              <div className="flex gap-3">

                <span
                  className="text-lg"
                  aria-hidden="true"
                >
                  💡
                </span>

                <div>

                  <p className="text-sm font-semibold text-violet-800">
                    Seller Product
                  </p>

                  <p className="mt-1 text-xs leading-5 text-violet-700">
                    Your product will automatically be linked
                    to your seller account through your JWT.
                  </p>

                </div>

              </div>

            </div>

            {/* =====================================
                BUTTONS
            ===================================== */}

            <div className="flex justify-end border-t border-slate-100 pt-6">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:bg-violet-300"
              >
                {saving
                  ? "Creating Product..."
                  : "➕ Create Product"}
              </button>

            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default SellerAddProduct;