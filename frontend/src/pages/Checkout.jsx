import { useEffect, useState } from "react";

import {
  getCart,
  createOrder,
  createPayment,
  verifyPayment
} from "../api";

function Checkout({ navigate }) {
  // ==========================================
  // CART
  // ==========================================

  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);

  // ==========================================
  // CUSTOMER DETAILS
  // ==========================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  // ==========================================
  // PAYMENT
  // ==========================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD CART FROM BACKEND
  // ==========================================

  useEffect(() => {
    const loadCart = async () => {
      try {
        setCartLoading(true);
        setError("");

        const data = await getCart();

        console.log("Checkout cart:", data);

        setCart(data);
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
          "Failed to load cart"
        );
      } finally {
        setCartLoading(false);
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

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50">

        <Navbar />

        <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl items-center justify-center px-6 py-10">

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 text-gray-500 shadow-sm">

            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-purple-600" />

            Loading checkout...

          </div>

        </main>

      </div>
    );
  }

  // ==========================================
  // CART ITEMS
  // ==========================================

  const items = cart?.items || [];

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">

        <Navbar />

        <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl items-center justify-center px-6 py-10">

          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

            <div className="mb-4 text-6xl">
              🛒
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Your cart is empty
            </h1>

            <p className="mt-2 text-gray-500">
              Add some products before checkout.
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
  // TOTAL
  // ==========================================

  const total =
    Number(cart?.totalAmount || 0);

  // ==========================================
  // START CHECKOUT
  // ==========================================

  const handleCheckout = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // ======================================
      // 1. CREATE ORDER IN OUR BACKEND
      // ======================================

      const order = await createOrder();

      console.log(
        "Order created:",
        order
      );


      // ======================================
      // 2. CREATE RAZORPAY ORDER
      // ======================================

      const payment =
        await createPayment(
          order.orderId
        );

      console.log(
        "Razorpay payment created:",
        payment
      );


      // ======================================
      // 3. OPEN RAZORPAY CHECKOUT
      // ======================================

      const options = {
        key:
          import.meta.env
            .VITE_RAZORPAY_KEY_ID,

        amount:
          Number(payment.amount) * 100,

        currency: "INR",

        name: "Agentic Commerce",

        description:
          "Order #" + order.orderId,

        order_id:
          payment.razorpayOrderId,

        // ==================================
        // CUSTOMER INFORMATION
        // ==================================

        prefill: {
          name: name,
          email: email,
          contact: phone
        },

        // ==================================
        // PAYMENT SUCCESS
        // ==================================

        handler: async function (response) {
          console.log(
            "Razorpay response:",
            response
          );

          try {
            // ==============================
            // 4. VERIFY PAYMENT
            // ==============================

            const verificationResult =
              await verifyPayment({
                razorpayOrderId:
                  response.razorpay_order_id,

                razorpayPaymentId:
                  response.razorpay_payment_id,

                razorpaySignature:
                  response.razorpay_signature
              });

            console.log(
              "Payment verification:",
              verificationResult
            );


            // ==============================
            // PAYMENT SUCCESS
            // ==============================

            alert(
              "Payment successful!"
            );

            navigate("/orders");

          } catch (err) {
            console.error(err);

            setError(
              err.message ||
              "Payment verification failed"
            );
          }
        },

        // ==================================
        // RAZORPAY THEME
        // ==================================

        theme: {
          color: "#7c3aed"
        }
      };


      // ======================================
      // CHECK RAZORPAY SDK
      // ======================================

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK is not loaded"
        );
      }


      // ======================================
      // OPEN RAZORPAY
      // ======================================

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();


      // ======================================
      // PAYMENT FAILED
      // ======================================

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment failed:",
            response
          );

          setError(
            "Payment failed. Please try again."
          );
        }
      );

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Unable to start payment"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHECKOUT PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6 py-10">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-10">

          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-600">
            CHECKOUT
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Complete Your Order
          </h1>

          <p className="mt-2 text-gray-500">
            Enter your delivery details and continue
            to payment.
          </p>

        </div>


        {/* =====================================
            CHECKOUT CONTAINER
        ===================================== */}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">


          {/* =================================
              CUSTOMER DETAILS
          ================================= */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">

            <h2 className="text-xl font-bold text-gray-900">
              Delivery Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Where should we deliver your order?
            </p>


            <form
              onSubmit={handleCheckout}
              className="mt-7 space-y-5"
            >

              {/* NAME + EMAIL */}

              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />

                </div>

              </div>


              {/* PHONE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone
                </label>

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

              </div>


              {/* ADDRESS */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Address
                </label>

                <textarea
                  placeholder="Enter your complete address"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  required
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

              </div>


              {/* CITY + PINCODE */}

              <div className="grid gap-5 md:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) =>
                      setCity(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    PIN Code
                  </label>

                  <input
                    type="text"
                    placeholder="PIN Code"
                    value={pincode}
                    onChange={(e) =>
                      setPincode(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />

                </div>

              </div>


              {/* ERROR */}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}


              {/* PAYMENT BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-purple-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-purple-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              >
                {loading
                  ? "Processing..."
                  : "Continue to Payment"}
              </button>

            </form>

          </div>


          {/* =================================
              ORDER SUMMARY
          ================================= */}

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">

            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>


            {/* ITEMS */}

            <div className="mt-6 space-y-4">

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4"
                >

                  <div className="min-w-0">

                    <h3 className="truncate text-sm font-semibold text-gray-900">
                      {item.productName}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>

                  </div>

                  <strong className="shrink-0 text-sm font-bold text-gray-900">

                    ₹
                    {Number(
                      item.subtotal
                    ).toFixed(2)}

                  </strong>

                </div>
              ))}

            </div>


            {/* SUBTOTAL */}

            <div className="mt-5 flex items-center justify-between text-sm text-gray-600">

              <span>
                Subtotal
              </span>

              <span className="font-semibold text-gray-900">
                ₹{total.toFixed(2)}
              </span>

            </div>


            {/* DELIVERY */}

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">

              <span>
                Delivery
              </span>

              <span className="font-semibold text-green-600">
                FREE
              </span>

            </div>


            {/* DIVIDER */}

            <div className="my-5 border-t border-gray-200" />


            {/* TOTAL */}

            <div className="flex items-center justify-between">

              <span className="font-bold text-gray-900">
                Total
              </span>

              <strong className="text-2xl font-bold text-gray-900">
                ₹{total.toFixed(2)}
              </strong>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Checkout;