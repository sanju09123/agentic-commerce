import { useEffect, useState } from "react";

import {
  getMyStore,
  updateMyStore,
} from "../api";

function SellerStore({ navigate }) {
  const [store, setStore] = useState(null);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ==========================================
  // LOAD STORE
  // ==========================================

  useEffect(() => {
    loadStore();
  }, []);

  const loadStore = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyStore();

      setStore(data);

      setForm({
        name: data.name || "",
        description: data.description || "",
        logo: data.logo || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
      });
    } catch (err) {
      setError(
        err?.message || "Failed to load your store"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // BACK BUTTON
  // ==========================================

  const handleBack = () => {
    // If currently editing, go back to
    // the store page without changing route.
    if (editing) {
      setEditing(false);
      setError("");
      setSuccess("");
      return;
    }

    // Otherwise leave the store page
    // and go back to seller dashboard.
    navigate("/seller");
  };

  // ==========================================
  // UPDATE STORE
  // ==========================================

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedStore = await updateMyStore(form);

      setStore(updatedStore);

      setForm({
        name: updatedStore.name || "",
        description: updatedStore.description || "",
        logo: updatedStore.logo || "",
        address: updatedStore.address || "",
        city: updatedStore.city || "",
        state: updatedStore.state || "",
        pincode: updatedStore.pincode || "",
      });

      setEditing(false);
      setSuccess("Store updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err?.message || "Failed to update store"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-6xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

              <h3 className="text-lg font-semibold text-slate-900">
                Loading Store...
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Please wait while we load your store.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // NO STORE
  // ==========================================

  if (!store) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-6xl">

          <button
            type="button"
            onClick={() => navigate("/seller")}
            className="mb-8 inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100"
          >
            ← Back
          </button>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-3xl">
                🏪
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Store Not Found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                You don't have a store yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/seller/create-store")
                }
                className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
              >
                🏪 Create Store
              </button>

            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // STORE PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">

        {/* ==========================================
            BACK BUTTON
        ========================================== */}

        <button
          type="button"
          onClick={handleBack}
          className="mb-8 inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100"
        >
          ← Back
        </button>

        {/* ==========================================
            STORE HEADER
        ========================================== */}

        <div className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            {store.logo ? (
              <img
                src={store.logo}
                alt={store.name}
                className="h-20 w-20 shrink-0 rounded-2xl border border-slate-200 bg-white object-cover shadow-sm"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-3xl shadow-sm">
                🏪
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {store.name}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                {store.description ||
                  "Welcome to our store."}
              </p>
            </div>

          </div>
        </div>

        {/* ==========================================
            MESSAGES
        ========================================== */}

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

        {/* ==========================================
            STORE ACTIONS
        ========================================== */}

        {!editing && (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* PRODUCT MANAGEMENT */}

            <button
              type="button"
              onClick={() =>
                navigate("/seller/products")
              }
              className="group flex items-center justify-between rounded-2xl border border-violet-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
                  📦
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Product Management
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage products, stock, and inventory.
                  </p>
                </div>

              </div>

              <span className="text-xl font-semibold text-violet-600 transition group-hover:translate-x-1">
                →
              </span>
            </button>

            {/* EDIT STORE */}

            <button
              type="button"
              onClick={() => {
                setEditing(true);
                setError("");
                setSuccess("");
              }}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  ✏️
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Edit Store
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Update your store information.
                  </p>
                </div>

              </div>

              <span className="text-xl font-semibold text-slate-500 transition group-hover:translate-x-1">
                →
              </span>
            </button>

          </div>
        )}

        {/* ==========================================
            EDIT STORE
        ========================================== */}

        {editing && (
          <form
            onSubmit={handleUpdate}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >

            <div className="border-b border-slate-200 p-6 sm:p-8">
              <div className="text-xs font-bold tracking-[0.16em] text-slate-400">
                EDIT STORE
              </div>

              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Update Store
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-8">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Store Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Store Logo URL
                </label>

                <input
                  type="url"
                  name="logo"
                  value={form.logo}
                  onChange={handleChange}
                  maxLength={500}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Store Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={1000}
                  rows={4}
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  maxLength={500}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  maxLength={20}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

            </div>

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-6 sm:flex-row sm:justify-end sm:p-8">

              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setError("");
                  setSuccess("");
                }}
                disabled={saving}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>
        )}

      </section>
    </div>
  );
}

export default SellerStore;