import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItemQuantity,
  removeCartItem
} from "../api";

function Cart({ navigate }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItem, setUpdatingItem] = useState(null);

  // ==========================================
  // LOAD CART FROM BACKEND
  // ==========================================

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCart();

        setCart(data);
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
          "Failed to load cart"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ==========================================
  // INCREASE / DECREASE QUANTITY
  // ==========================================

  const handleQuantityChange = async (
    item,
    newQuantity
  ) => {
    // Quantity can never go below 1
    if (newQuantity < 1) {
      return;
    }

    try {
      setUpdatingItem(item.id);
      setError("");

      // Backend remains source of truth.
      // Stock is intentionally NOT checked here.
      const updatedCart =
        await updateCartItemQuantity(
          item.id,
          newQuantity
        );

      setCart(updatedCart);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Failed to update quantity"
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const handleRemoveItem = async (itemId) => {
    try {
      setUpdatingItem(itemId);
      setError("");

      const updatedCart =
        await removeCartItem(itemId);

      setCart(updatedCart);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Failed to remove item"
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  // ==========================================
  // NAVBAR
  // ==========================================

  const Navbar = () => (
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
          className="rounded-lg bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-700"
          onClick={() =>
            navigate("/cart")
          }
        >
          🛒 Cart
        </button>

        <button
          type="button"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    </nav>
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">

        <Navbar />

        <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl items-center justify-center px-6 py-10">

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 text-gray-500 shadow-sm">

            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-purple-600" />

            Loading cart...

          </div>

        </main>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !cart) {
    return (
      <div className="min-h-screen bg-gray-50">

        <Navbar />

        <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl items-center justify-center px-6 py-10">

          <div className="w-full max-w-lg rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm font-medium text-red-600">
            {error}
          </div>

        </main>

      </div>
    );
  }

  const items = cart?.items || [];

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">

        <Navbar />

        <main className="mx-auto w-full max-w-7xl px-6 py-10">

          <div className="mb-8">

            <div className="mb-1 text-xs font-bold uppercase tracking-widest text-purple-600">
              SHOPPING CART
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Your Cart
            </h2>

          </div>


          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">

            <div className="mb-4 text-6xl">
              🛒
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Your cart is empty
            </h3>

            <p className="mt-2 text-gray-500">
              Add some products to your cart.
            </p>

            <button
              type="button"
              className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
              onClick={() =>
                navigate("/products")
              }
            >
              Continue Shopping
            </button>

          </div>

        </main>

      </div>
    );
  }

  // ==========================================
  // CART TOTAL
  // ==========================================

  const total =
    Number(cart.totalAmount || 0);

  const totalItems =
    items.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0
    );

  // ==========================================
  // CHECK STOCK
  // ==========================================

  const hasInsufficientStock =
    items.some((item) => {
      const currentStock =
        Number(item.stock ?? 0);

      const quantity =
        Number(item.quantity ?? 0);

      return quantity > currentStock;
    });

  // ==========================================
  // CART PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      {/* ======================================
          CART SECTION
      ====================================== */}

      <main className="mx-auto w-full max-w-7xl px-6 py-10">

        <div className="mb-8">

          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-purple-600">
            SHOPPING CART
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Your Cart
          </h2>

        </div>


        {/* ======================================
            UPDATE ERROR
        ====================================== */}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}


        {/* ======================================
            GLOBAL STOCK WARNING
        ====================================== */}

        {hasInsufficientStock && (
          <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 px-4 py-4 text-sm font-medium text-orange-700">

            ⚠️ Some items have insufficient stock.
            Please reduce the quantity before
            proceeding to checkout.

          </div>
        )}


        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* ==================================
              CART ITEMS
          ================================== */}

          <div className="space-y-4">

            {items.map((item) => {
              const isUpdating =
                updatingItem === item.id;

              const currentStock =
                Number(item.stock ?? 0);

              const currentQuantity =
                Number(item.quantity ?? 0);

              const insufficientStock =
                currentQuantity >
                currentStock;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                    {/* PRODUCT IMAGE */}

                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-gray-100 text-4xl">
                      🛍️
                    </div>


                    {/* PRODUCT INFO */}

                    <div className="min-w-0 flex-1">

                      <h3 className="text-lg font-bold text-gray-900">
                        {item.productName}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-gray-500">
                        ₹
                        {Number(
                          item.price
                        ).toFixed(2)}
                      </p>


                      {/* STOCK WARNING */}

                      {insufficientStock && (
                        <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">

                          ⚠️ Insufficient stock

                          <br />

                          Only{" "}
                          <strong>
                            {currentStock}
                          </strong>{" "}
                          available

                        </div>
                      )}

                    </div>


                    {/* QUANTITY CONTROLS */}

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">

                      <div className="flex items-center rounded-xl border border-gray-300 bg-white">

                        {/* MINUS */}

                        <button
                          type="button"
                          disabled={
                            isUpdating ||
                            currentQuantity <= 1
                          }
                          className="flex h-10 w-10 items-center justify-center text-xl font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() =>
                            handleQuantityChange(
                              item,
                              currentQuantity - 1
                            )
                          }
                        >
                          −
                        </button>


                        {/* CURRENT QUANTITY */}

                        <span className="flex h-10 min-w-10 items-center justify-center border-x border-gray-300 px-3 text-sm font-bold text-gray-900">
                          {currentQuantity}
                        </span>


                        {/* PLUS */}

                        <button
                          type="button"
                          disabled={isUpdating}
                          className="flex h-10 w-10 items-center justify-center text-xl font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() =>
                            handleQuantityChange(
                              item,
                              currentQuantity + 1
                            )
                          }
                        >
                          +
                        </button>

                      </div>


                      {/* REMOVE */}

                      <button
                        type="button"
                        disabled={isUpdating}
                        className="text-sm font-semibold text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                        onClick={() =>
                          handleRemoveItem(
                            item.id
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>


                    {/* SUBTOTAL */}

                    <div className="min-w-28 text-left sm:text-right">

                      <div className="text-lg font-bold text-gray-900">
                        ₹
                        {Number(
                          item.subtotal
                        ).toFixed(2)}
                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>


          {/* ==================================
              SUMMARY
          ================================== */}

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">

            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>


            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between text-sm text-gray-600">

                <span>
                  Items
                </span>

                <span className="font-semibold text-gray-900">
                  {totalItems}
                </span>

              </div>


              <div className="flex items-center justify-between border-t border-gray-200 pt-4">

                <span className="font-semibold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-gray-900">
                  ₹{total.toFixed(2)}
                </span>

              </div>

            </div>


            {/* CHECKOUT */}

            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-purple-600 px-5 py-3.5 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              disabled={
                hasInsufficientStock
              }
              onClick={() =>
                navigate("/checkout")
              }
            >
              {hasInsufficientStock
                ? "Fix Stock Before Checkout"
                : "Proceed to Checkout"}
            </button>


            <button
              type="button"
              className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              onClick={() =>
                navigate("/products")
              }
            >
              Continue Shopping
            </button>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Cart;