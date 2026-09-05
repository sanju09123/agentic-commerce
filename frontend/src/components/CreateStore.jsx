import React, { useState } from "react";
import { createStore } from "../api";

function CreateStore({ navigate }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================================
  // FORM CHANGE
  // =========================================================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // =========================================================================
  // CREATE STORE
  // =========================================================================

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await createStore(form);

      // Show success message
      setSuccess("Store created successfully.");

      // Go directly to My Store page
      setTimeout(() => {
        navigate("/seller/store");
      }, 1200);
    } catch (err) {
      setError(err?.message || "Failed to create store");
    } finally {
      setSaving(false);
    }
  }

  // =========================================================================
  // UI
  // =========================================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* ================================================================
            SINGLE BACK BUTTON
        ================================================================= */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={saving}
          className="mb-8 inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Back
        </button>

        {/* ================================================================
            HEADER
        ================================================================= */}

        <div className="mb-8">
          <span className="text-xs font-bold tracking-[0.18em] text-violet-600">
            SELLER CENTER
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Create Your Store
          </h1>

          <p className="mt-2 text-base text-slate-500">
            Set up your store and start selling your products.
          </p>
        </div>

        {/* ================================================================
            MESSAGES
        ================================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            ✓ {success}
          </div>
        )}

        {/* ================================================================
            FORM
        ================================================================= */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* ==============================================================
              STORE INFORMATION
          ============================================================== */}

          <div className="border-b border-slate-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Store Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add the basic information customers will see about your store.
              </p>
            </div>

            {/* STORE NAME */}

            <div className="mb-6">
              <label
                htmlFor="store-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Store Name
              </label>

              <input
                id="store-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your store name"
                maxLength={150}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="mb-6">
              <label
                htmlFor="store-description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Store Description
              </label>

              <textarea
                id="store-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell customers about your store"
                maxLength={1000}
                rows={5}
                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {/* LOGO */}

            <div>
              <label
                htmlFor="store-logo"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Store Logo URL
              </label>

              <input
                id="store-logo"
                type="url"
                name="logo"
                value={form.logo}
                onChange={handleChange}
                placeholder="https://example.com/store-logo.png"
                maxLength={500}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Add a public image URL for your store logo.
              </p>
            </div>
          </div>

          {/* ==============================================================
              STORE ADDRESS
          ============================================================== */}

          <div className="border-b border-slate-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Store Address
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provide the location details for your store.
              </p>
            </div>

            {/* ADDRESS */}

            <div className="mb-6">
              <label
                htmlFor="store-address"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Address
              </label>

              <textarea
                id="store-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter store address"
                maxLength={500}
                rows={3}
                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {/* CITY / STATE / PINCODE */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

              {/* CITY */}

              <div>
                <label
                  htmlFor="store-city"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  City
                </label>

                <input
                  id="store-city"
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              {/* STATE */}

              <div>
                <label
                  htmlFor="store-state"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  State
                </label>

                <input
                  id="store-state"
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              {/* PINCODE */}

              <div>
                <label
                  htmlFor="store-pincode"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Pincode
                </label>

                <input
                  id="store-pincode"
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  maxLength={20}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>
            </div>
          </div>

          {/* ==============================================================
              CREATE ACTION
          ============================================================== */}

          <div className="flex justify-end bg-slate-50 p-6 sm:p-8">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-violet-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Creating Store..." : "Create Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateStore;