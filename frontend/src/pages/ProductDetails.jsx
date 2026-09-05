import { useEffect, useState } from "react";

import {
  getProductDetails,
  addToCart as addProductToCart
} from "../api";

function ProductDetails({ navigate, productId }) {
  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [addingToCart, setAddingToCart] =
    useState(false);

  // ==========================================
  // LOAD PRODUCT DETAILS
  // ==========================================

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getProductDetails(productId);

        setProduct(data);
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
          "Failed to load product details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProductDetails();
    } else {
      setError("Product ID is missing");
      setLoading(false);
    }
  }, [productId]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    if (Number(product.stock || 0) <= 0) {
      setError(
        `${product.name} is out of stock`
      );

      return;
    }

    try {
      setAddingToCart(true);
      setError("");

      await addProductToCart(
        product.id,
        1
      );

      alert(
        `${product.name} added to cart`
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Failed to add product to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">

        <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="text-2xl">
              ⚡
            </span>

            <span>
              Agentic Commerce
            </span>
          </div>
        </nav>

        <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl items-center justify-center px-6 py-10">

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 text-gray-500 shadow-sm">

            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-purple-600" />

            Loading product...

          </div>

        </main>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-50">

        <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">

          <div className="flex items-center gap-2 text-xl font-bold text-gray-900">

            <span className="text-2xl">
              ⚡
            </span>

            <span>
              Agentic Commerce
            </span>

          </div>

        </nav>

        <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl flex-col items-center justify-center gap-5 px-6 py-10">

          <div className="w-full max-w-lg rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm font-medium text-red-600">
            {error}
          </div>

          <button
            type="button"
            className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
            onClick={() =>
              navigate("/products")
            }
          >
            ← Back to Products
          </button>

        </main>

      </div>
    );
  }

  // ==========================================
  // PRODUCT DATA
  // ==========================================

  const stock =
    Number(product.stock || 0);

  const outOfStock =
    stock <= 0;

  const fewLeft =
    stock > 0 && stock <= 5;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4 shadow-sm">

        {/* LOGO */}

        <div className="flex items-center gap-2 text-xl font-bold text-gray-900">

          <span className="text-2xl">
            ⚡
          </span>

          <span>
            Agentic Commerce
          </span>

        </div>

        {/* NAV LINKS */}

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-purple-600"
            onClick={() =>
              navigate("/products")
            }
          >
            Products
          </button>

          <button
            type="button"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-purple-600"
            onClick={() =>
              navigate("/orders")
            }
          >
            Orders
          </button>

          <button
            type="button"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-purple-600"
            onClick={() =>
              navigate("/cart")
            }
          >
            🛒 Cart
          </button>

          <button
            type="button"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-purple-600"
            onClick={() =>
              navigate("/ai-assistant")
            }
          >
            🤖 AI Assistant
          </button>

          {/* PROFILE */}

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-lg transition hover:border-purple-400 hover:bg-purple-50"
            onClick={() =>
              navigate("/profile")
            }
            title="Profile"
            aria-label="Profile"
          >
            👤
          </button>

          {/* LOGOUT */}

          <button
            type="button"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            onClick={() => {
              localStorage.removeItem(
                "token"
              );

              localStorage.removeItem(
                "cart"
              );

              navigate("/");
            }}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ==========================================
          PRODUCT DETAILS
      ========================================== */}

      <main className="mx-auto w-full max-w-7xl px-6 py-10">

        {/* BACK BUTTON */}

        <button
          type="button"
          className="mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
          onClick={() =>
            navigate("/products")
          }
        >
          ← Back to Products
        </button>


        {/* ERROR MESSAGE */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}


        {/* PRODUCT DETAILS CARD */}

        <div className="grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg md:grid-cols-2">

          {/* ========================================
              PRODUCT IMAGE
          ======================================== */}

          <div className="flex min-h-[420px] items-center justify-center bg-gradient-to-br from-purple-50 via-white to-gray-100">

            <div className="flex h-64 w-64 items-center justify-center rounded-3xl bg-white text-8xl shadow-md">
              🛍️
            </div>

          </div>


          {/* ========================================
              PRODUCT INFORMATION
          ======================================== */}

          <div className="flex flex-col p-8 md:p-10">

            {/* CATEGORY */}

            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-purple-600">
              {product.category}
            </div>


            {/* NAME */}

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {product.name}
            </h1>


            {/* DESCRIPTION */}

            <p className="mt-5 text-base leading-7 text-gray-600">
              {product.description}
            </p>


            {/* PRICE */}

            <div className="mt-6 text-3xl font-bold text-gray-900">
              ₹{product.price}
            </div>


            {/* STOCK */}

            <div
              className={
                outOfStock
                  ? "mt-3 text-sm font-semibold text-red-600"
                  : fewLeft
                    ? "mt-3 text-sm font-semibold text-orange-500"
                    : "mt-3 text-sm font-semibold text-green-600"
              }
            >
              {outOfStock
                ? "Out of stock"
                : fewLeft
                  ? `Only ${stock} left`
                  : `${stock} in stock`}
            </div>


            {/* =====================================
                STORE INFORMATION
            ===================================== */}

            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">

              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                SOLD BY
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                {product.store?.name ||
                  "Store"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {product.store?.description ||
                  "No store description available."}
              </p>

            </div>


            {/* =====================================
                ADD TO CART
            ===================================== */}

            <button
              type="button"
              className="mt-8 w-full rounded-xl bg-purple-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-purple-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              onClick={handleAddToCart}
              disabled={
                outOfStock ||
                addingToCart
              }
            >
              {addingToCart
                ? "Adding..."
                : outOfStock
                  ? "Out of Stock"
                  : "🛒 Add to Cart"}
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ProductDetails;