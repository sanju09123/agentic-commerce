import { useEffect, useState } from "react";

import {
  getProducts,
  searchProducts,
  addToCart as addProductToCart
} from "../api";

function Products({ navigate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addingProductId, setAddingProductId] =
    useState(null);

  // ==========================================
  // SEARCH STATE
  // ==========================================

  const [searchKeyword, setSearchKeyword] =
    useState("");

  const [searching, setSearching] =
    useState(false);

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(
          err.message ||
          "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ==========================================
  // SEARCH PRODUCTS
  // ==========================================

  const handleSearch = async (e) => {
    e.preventDefault();

    const keyword =
      searchKeyword.trim();

    // ------------------------------------------
    // EMPTY SEARCH
    // ------------------------------------------

    if (!keyword) {
      try {
        setSearching(true);
        setError("");

        const data =
          await getProducts();

        setProducts(data);
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
          "Failed to load products"
        );
      } finally {
        setSearching(false);
      }

      return;
    }

    // ------------------------------------------
    // SEARCH BACKEND
    // ------------------------------------------

    try {
      setSearching(true);
      setError("");

      const data =
        await searchProducts({
          keyword: keyword
        });

      setProducts(data);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Failed to search products"
      );
    } finally {
      setSearching(false);
    }
  };

  // ==========================================
  // ADD PRODUCT TO BACKEND CART
  // ==========================================

  const handleAddToCart = async (product) => {
    // ------------------------------------------
    // FRONTEND STOCK CHECK
    // ------------------------------------------

    if (Number(product.stock || 0) <= 0) {
      setError(
        `${product.name} is out of stock`
      );

      return;
    }

    try {
      setError("");
      setAddingProductId(product.id);

      // ----------------------------------------
      // ADD TO BACKEND CART
      // ----------------------------------------

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
      setAddingProductId(null);
    }
  };

  // ==========================================
  // OPEN PRODUCT DETAILS
  // ==========================================

  const handleProductClick = (productId) => {
    navigate(
      `/product/${encodeURIComponent(productId)}`
    );
  };

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
          PRODUCTS
      ========================================== */}

      <section className="mx-auto w-full max-w-7xl px-6 py-10">

        {/* SECTION HEADER */}

        <div className="mb-6">

          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-purple-600">
            SHOP
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Products
          </h2>

        </div>


        {/* ==========================================
            SEARCH
        ========================================== */}

        <form
          className="mb-8 flex w-full flex-col gap-3 sm:flex-row"
          onSubmit={handleSearch}
        >

          <input
            type="text"
            placeholder="Search products..."
            value={searchKeyword}
            onChange={(e) =>
              setSearchKeyword(
                e.target.value
              )
            }
            className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />

          <button
            type="submit"
            disabled={searching}
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {searching
              ? "Searching..."
              : "🔍 Search"}
          </button>

        </form>


        {/* ==========================================
            LOADING
        ========================================== */}

        {loading && (
          <div className="flex min-h-40 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-purple-600" />
              Loading products...
            </div>
          </div>
        )}


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}


        {/* ==========================================
            NO PRODUCTS
        ========================================== */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500">
              No products found.
            </div>
          )}


        {/* ==========================================
            PRODUCT GRID
        ========================================== */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {products.map((product) => {

            // --------------------------------------
            // LIVE STOCK STATUS
            // --------------------------------------

            const stock =
              Number(product.stock || 0);

            const outOfStock =
              stock <= 0;

            const fewLeft =
              stock > 0 && stock <= 5;

            return (
              <div
                key={product.id}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                onClick={() =>
                  handleProductClick(
                    product.id
                  )
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" ||
                    e.key === " "
                  ) {
                    e.preventDefault();

                    handleProductClick(
                      product.id
                    );
                  }
                }}
              >

                {/* PRODUCT IMAGE */}

                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-purple-50 to-gray-100 text-6xl transition group-hover:from-purple-100">
                  🛍️
                </div>


                {/* PRODUCT INFO */}

                <div className="flex flex-1 flex-col p-5">

                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-600">
                    {product.category}
                  </div>

                  <h3 className="mb-2 line-clamp-1 text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>

                  <p className="mb-5 line-clamp-3 flex-1 text-sm leading-6 text-gray-500">
                    {product.description}
                  </p>


                  {/* PRODUCT BOTTOM */}

                  <div className="flex items-end justify-between gap-3">

                    <div className="min-w-0">

                      <span className="block text-xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>


                      {/* STOCK STATUS */}

                      <span
                        className={
                          outOfStock
                            ? "mt-1 inline-block text-xs font-semibold text-red-600"
                            : fewLeft
                              ? "mt-1 inline-block text-xs font-semibold text-orange-500"
                              : "mt-1 inline-block text-xs font-semibold text-green-600"
                        }
                      >
                        {outOfStock
                          ? "Out of stock"
                          : fewLeft
                            ? "Only few left"
                            : "In stock"}
                      </span>

                    </div>


                    {/* ADD TO CART */}

                    <button
                      type="button"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-lg text-white shadow-sm transition hover:bg-purple-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                      onClick={(e) => {
                        e.stopPropagation();

                        handleAddToCart(
                          product
                        );
                      }}
                      disabled={
                        outOfStock ||
                        addingProductId ===
                        product.id
                      }
                      title={
                        outOfStock
                          ? "Out of stock"
                          : "Add to cart"
                      }
                    >
                      {addingProductId ===
                      product.id
                        ? "..."
                        : outOfStock
                          ? "🚫"
                          : "🛒"}
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </section>

    </div>
  );
}

export default Products;