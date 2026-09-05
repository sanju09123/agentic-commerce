import { useEffect, useState } from "react";
import { getMyOrders } from "../api";

function Orders({ navigate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();

        setOrders(data);
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
          "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // ==========================================
  // NAVBAR
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");

    navigate("/");
  };

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
          className="rounded-lg bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-700"
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
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      {/* ==========================================
          ORDERS
      ========================================== */}

      <main className="mx-auto w-full max-w-7xl px-6 py-10">

        {/* HEADER */}

        <div className="mb-8">

          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-purple-600">
            PURCHASE HISTORY
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            My Orders
          </h2>

        </div>


        {/* ==========================================
            LOADING
        ========================================== */}

        {loading && (
          <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-12 shadow-sm">

            <div className="flex items-center gap-3 text-gray-500">

              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-purple-600" />

              Loading orders...

            </div>

          </div>
        )}


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}


        {/* ==========================================
            EMPTY
        ========================================== */}

        {!loading &&
          !error &&
          orders.length === 0 && (

            <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">

              <div className="mb-4 text-6xl">
                📦
              </div>

              <h3 className="text-xl font-bold text-gray-900">
                No orders yet
              </h3>

              <p className="mt-2 max-w-md text-gray-500">
                Your completed orders will appear
                here.
              </p>

              <button
                type="button"
                className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                onClick={() =>
                  navigate("/products")
                }
              >
                Start Shopping
              </button>

            </div>
          )}


        {/* ==========================================
            ORDER LIST
        ========================================== */}

        {!loading &&
          !error &&
          orders.length > 0 && (

            <div className="space-y-6">

              {orders.map((order) => (

                <div
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  key={order.orderId}
                >

                  {/* ==================================
                      ORDER HEADER
                  ================================== */}

                  <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <div className="mb-1 text-xs font-bold uppercase tracking-widest text-purple-600">
                        ORDER
                      </div>

                      <h3 className="text-lg font-bold text-gray-900">
                        #{order.orderId}
                      </h3>

                    </div>


                    {/* STATUS */}

                    <span
                      className={`
                        inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide
                        ${
                          String(order.status).toLowerCase() ===
                          "paid"
                            ? "bg-green-100 text-green-700"
                            : String(order.status).toLowerCase() ===
                              "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : String(order.status).toLowerCase() ===
                                "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                        }
                      `}
                    >
                      {order.status}
                    </span>

                  </div>


                  {/* ==================================
                      ORDER ITEMS
                  ================================== */}

                  <div className="divide-y divide-gray-100 px-6">

                    {order.items.map((item) => (

                      <div
                        className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
                        key={item.id}
                      >

                        <div className="min-w-0">

                          <h4 className="text-base font-semibold text-gray-900">
                            {item.productName}
                          </h4>

                          <p className="mt-1 text-sm text-gray-500">
                            ₹{item.price} ×{" "}
                            {item.quantity}
                          </p>

                        </div>


                        <strong className="shrink-0 text-base font-bold text-gray-900">
                          ₹
                          {Number(
                            item.subtotal
                          ).toFixed(2)}
                        </strong>

                      </div>

                    ))}

                  </div>


                  {/* ==================================
                      ORDER TOTAL
                  ================================== */}

                  <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-5">

                    <span className="font-semibold text-gray-700">
                      Total
                    </span>

                    <strong className="text-xl font-bold text-gray-900">
                      ₹
                      {Number(
                        order.totalAmount
                      ).toFixed(2)}
                    </strong>

                  </div>

                </div>

              ))}

            </div>
          )}

      </main>

    </div>
  );
}

export default Orders;