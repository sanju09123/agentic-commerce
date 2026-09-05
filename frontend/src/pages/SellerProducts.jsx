import { useEffect, useState } from "react";

import {
  getSellerProducts,
  updateProductStock,
  deleteProduct,
} from "../api";

function SellerProducts({ navigate }) {
  // ==========================================
  // STATE
  // ==========================================

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockValue, setStockValue] = useState("");

  // ==========================================
  // LOAD SELLER PRODUCTS
  // ==========================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSellerProducts();

      console.log("Seller products:", response);

      if (Array.isArray(response)) {
        setProducts(response);
      } else if (Array.isArray(response?.content)) {
        setProducts(response.content);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load seller products"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadProducts();
  }, []);

  // ==========================================
  // BACK - ONE PAGE ONLY
  // ==========================================

  const handleBack = () => {
    navigate(-1);
  };

  // ==========================================
  // START STOCK EDIT
  // ==========================================

  const handleStartStockEdit = (product) => {
    setEditingStockId(product.id);
    setStockValue(String(product.stock ?? 0));
    setError("");
  };

  // ==========================================
  // CANCEL STOCK EDIT
  // ==========================================

  const handleCancelStockEdit = () => {
    setEditingStockId(null);
    setStockValue("");
  };

  // ==========================================
  // UPDATE STOCK
  // ==========================================

  const handleUpdateStock = async (productId) => {
    if (stockValue === "") {
      setError("Please enter stock quantity");
      return;
    }

    const newStock = Number(stockValue);

    if (
      !Number.isInteger(newStock) ||
      newStock < 0
    ) {
      setError(
        "Stock must be a whole number greater than or equal to 0"
      );
      return;
    }

    try {
      setActionLoading(`update-${productId}`);
      setError("");

      await updateProductStock(
        productId,
        newStock
      );

      setEditingStockId(null);
      setStockValue("");

      await loadProducts();
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to update product stock"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(`delete-${product.id}`);
      setError("");

      await deleteProduct(product.id);

      setProducts((previous) =>
        previous.filter(
          (item) => item.id !== product.id
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to delete product"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredProducts = products.filter(
    (product) => {
      const searchValue =
        search.trim().toLowerCase();

      if (!searchValue) {
        return true;
      }

      return (
        String(product.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(product.category || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(product.description || "")
          .toLowerCase()
          .includes(searchValue)
      );
    }
  );

  // ==========================================
  // STOCK STATUS
  // ==========================================

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-100 text-red-700",
      };
    }

    if (stock <= 5) {
      return {
        label: "Low Stock",
        className: "bg-amber-100 text-amber-700",
      };
    }

    return {
      label: "In Stock",
      className: "bg-green-100 text-green-700",
    };
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
          MAIN
      ===================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =====================================
            BACK BUTTON
        ===================================== */}

        <button
          type="button"
          onClick={handleBack}
          className="mb-6 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100"
        >
          ← Back
        </button>

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Products
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Manage your products, stock, and inventory.
              </p>

            </div>

            {/* ADD PRODUCT */}

            <button
              type="button"
              onClick={() =>
                navigate("/seller/products/create")
              }
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
            >
              ➕ Add Product
            </button>

          </div>
        </div>

        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>

          </div>
        )}

        {/* =====================================
            SEARCH + SUMMARY
        ===================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}

            <div className="relative w-full lg:max-w-md">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search your products..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />

            </div>

            {/* SUMMARY */}

            <div className="flex flex-wrap items-center gap-3 text-sm">

              <div className="rounded-lg bg-slate-100 px-3 py-2 text-slate-600">
                Total Products:
                <strong className="ml-1 text-slate-900">
                  {products.length}
                </strong>
              </div>

              <div className="rounded-lg bg-green-50 px-3 py-2 text-green-700">
                In Stock:
                <strong className="ml-1">
                  {
                    products.filter(
                      (product) =>
                        Number(product.stock) > 0
                    ).length
                  }
                </strong>
              </div>

              <div className="rounded-lg bg-red-50 px-3 py-2 text-red-700">
                Out:
                <strong className="ml-1">
                  {
                    products.filter(
                      (product) =>
                        Number(product.stock) === 0
                    ).length
                  }
                </strong>
              </div>

            </div>

          </div>
        </div>

        {/* =====================================
            LOADING
        ===================================== */}

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

            <h2 className="text-lg font-bold text-slate-900">
              Loading Products
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Fetching your products...
            </p>

          </div>
        )}

        {/* =====================================
            EMPTY
        ===================================== */}

        {!loading && products.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm sm:p-14">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100 text-4xl">
              📦
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-900">
              No Products Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't added any products to your store yet.
              Add your first product to start selling.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/seller/products/create")
              }
              className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
            >
              ➕ Add Your First Product
            </button>

          </div>
        )}

        {/* =====================================
            SEARCH EMPTY
        ===================================== */}

        {!loading &&
          products.length > 0 &&
          filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="text-4xl">
                🔍
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No Products Found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                No product matches "{search}".
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
              >
                Clear Search
              </button>

            </div>
          )}

        {/* =====================================
            PRODUCT GRID
        ===================================== */}

        {!loading &&
          filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {filteredProducts.map((product) => {

                const stockStatus =
                  getStockStatus(
                    Number(product.stock)
                  );

                const isUpdating =
                  actionLoading ===
                  `update-${product.id}`;

                const isDeleting =
                  actionLoading ===
                  `delete-${product.id}`;

                const isBusy =
                  isUpdating || isDeleting;

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >

                    {/* PRODUCT TOP */}

                    <div className="border-b border-slate-100 p-5">

                      <div className="mb-4 flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <h2 className="truncate text-lg font-bold text-slate-900">
                            {product.name ||
                              "Unnamed Product"}
                          </h2>

                          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-violet-600">
                            {product.category ||
                              "Uncategorized"}
                          </p>

                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${stockStatus.className}`}
                        >
                          {stockStatus.label}
                        </span>

                      </div>

                      <p className="min-h-12 text-sm leading-6 text-slate-500">
                        {product.description ||
                          "No description available."}
                      </p>

                    </div>

                    {/* PRODUCT INFO */}

                    <div className="grid grid-cols-2 gap-3 p-5">

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-xs font-medium text-slate-500">
                          Price
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          ₹
                          {Number(
                            product.price || 0
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-xs font-medium text-slate-500">
                          Current Stock
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {product.stock ?? 0}
                        </p>

                      </div>

                    </div>

                    {/* STOCK EDIT */}

                    {editingStockId === product.id && (
                      <div className="mx-5 mb-4 rounded-xl border border-violet-200 bg-violet-50 p-4">

                        <label className="mb-2 block text-xs font-bold text-violet-800">
                          Set New Stock
                        </label>

                        <div className="flex gap-2">

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={stockValue}
                            onChange={(e) =>
                              setStockValue(
                                e.target.value
                              )
                            }
                            disabled={isUpdating}
                            className="min-w-0 flex-1 rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-100"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateStock(
                                product.id
                              )
                            }
                            disabled={isUpdating}
                            className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isUpdating
                              ? "..."
                              : "Save"}
                          </button>

                          <button
                            type="button"
                            onClick={
                              handleCancelStockEdit
                            }
                            disabled={isUpdating}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
                          >
                            ×
                          </button>

                        </div>

                      </div>
                    )}

                    {/* ACTIONS */}

                    <div className="border-t border-slate-100 p-5">

                      <div className="grid grid-cols-2 gap-2">

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/seller/products/edit/${encodeURIComponent(
                                product.id
                              )}`
                            )
                          }
                          disabled={isBusy}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ✏️ Edit
                        </button>

                        {/* STOCK */}

                        <button
                          type="button"
                          onClick={() =>
                            handleStartStockEdit(
                              product
                            )
                          }
                          disabled={isBusy}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          📦 Stock
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteProduct(
                              product
                            )
                          }
                          disabled={isBusy}
                          className="col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeleting
                            ? "Deleting..."
                            : "🗑️ Delete"}
                        </button>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </main>
    </div>
  );
}

export default SellerProducts;