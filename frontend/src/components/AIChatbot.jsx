import { useState } from "react";

import {
  askAI,
  createPayment,
  verifyPayment,
} from "../api";

function AIChatbot({ navigate, backPath = "/products" }) {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hi! 👋 I'm your AI shopping assistant. How can I help you?",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // OPEN RAZORPAY FOR AI-CREATED ORDER
  // ==========================================

  const openRazorpayForOrder = async (orderId) => {
    try {
      if (!orderId) {
        throw new Error("Order ID is missing");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK is not loaded");
      }

      // ======================================
      // 1. CREATE RAZORPAY PAYMENT ORDER
      // ======================================

      const payment = await createPayment(orderId);

      console.log(
        "AI Razorpay payment created:",
        payment
      );

      // ======================================
      // 2. RAZORPAY OPTIONS
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
          "Agentic Commerce Order #" + orderId,

        order_id:
          payment.razorpayOrderId,

        // ==================================
        // CUSTOMER INFORMATION
        // ==================================

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        // ==================================
        // PAYMENT SUCCESS
        // ==================================

        handler: async function (response) {
          console.log(
            "AI Razorpay response:",
            response
          );

          try {
            // ==============================
            // 3. VERIFY PAYMENT
            // ==============================

            await verifyPayment({
              razorpayOrderId:
                response.razorpay_order_id,

              razorpayPaymentId:
                response.razorpay_payment_id,

              razorpaySignature:
                response.razorpay_signature,
            });

            console.log(
              "AI payment verification successful"
            );

            // ==============================
            // PAYMENT SUCCESS MESSAGE
            // ==============================

            setMessages((previous) => [
              ...previous,
              {
                type: "ai",
                text:
                  `✅ Payment successful!\n\n` +
                  `Order ${orderId} has been confirmed.`,
              },
            ]);
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error
            );

            setMessages((previous) => [
              ...previous,
              {
                type: "ai",
                text:
                  "❌ Payment was received, but payment verification failed. Please check your orders.",
              },
            ]);
          }
        },

        // ==================================
        // RAZORPAY THEME
        // ==================================

        theme: {
          color: "#7c3aed",
        },
      };

      // ======================================
      // 4. CREATE RAZORPAY INSTANCE
      // ======================================

      const razorpay =
        new window.Razorpay(options);

      // ======================================
      // PAYMENT FAILED
      // ======================================

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "AI payment failed:",
            response
          );

          setMessages((previous) => [
            ...previous,
            {
              type: "ai",
              text:
                "❌ Payment failed. Your order is still pending payment.",
            },
          ]);
        }
      );

      // ======================================
      // 5. OPEN RAZORPAY CHECKOUT
      // ======================================

      razorpay.open();
    } catch (error) {
      console.error(
        "Failed to open Razorpay:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text:
            error.message ||
            "Unable to start payment.",
        },
      ]);
    }
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    setMessage("");

    // ------------------------------------------
    // Build recent conversation context
    // ------------------------------------------

    const recentHistory = messages
      .slice(-8)
      .map((item) => {
        const role =
          item.type === "user"
            ? "USER"
            : "ASSISTANT";

        return `${role}: ${item.text}`;
      })
      .join("\n\n");

    // ------------------------------------------
    // Add user message to UI
    // ------------------------------------------

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: userMessage,
      },
    ]);

    setLoading(true);

    try {
      // ========================================
      // BUILD AI CONTEXT
      // ========================================

      const contextualMessage = `
RECENT CONVERSATION:

${recentHistory || "No previous conversation."}

CURRENT USER MESSAGE:

${userMessage}

IMPORTANT:
Resolve references such as "this", "that", "it",
"first one", "second one", etc. using the most
recent relevant product information in the
conversation.
`;

      // ========================================
      // ASK AI
      // ========================================

      const response = await askAI(
        contextualMessage
      );

      console.log(
        "AI response:",
        response
      );

      // ========================================
      // SHOW AI RESPONSE
      // ========================================

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text: response,
        },
      ]);

      // ========================================
      // DETECT AI-CREATED ORDER
      // ========================================
      //
      // Expected AI response contains something
      // like:
      //
      // Order Created Successfully!
      // Order ID: order_9b56938032
      // Status: Pending Payment
      //
      // We extract the real order ID and then
      // start the Razorpay payment flow.
      // ========================================

      const orderMatch =
        response.match(
          /order_[A-Za-z0-9_-]+/
        );

      const createdOrderId =
        orderMatch?.[0];

      const isPendingPayment =
        response
          .toLowerCase()
          .includes("pending payment");

      // ========================================
      // START RAZORPAY
      // ========================================

      if (
        createdOrderId &&
        isPendingPayment
      ) {
        console.log(
          "AI created order:",
          createdOrderId
        );

        await openRazorpayForOrder(
          createdOrderId
        );
      }
    } catch (error) {
      console.error(
        "AI assistant error:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text:
            "Sorry, I couldn't process that request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* =====================================
          HEADER
      ===================================== */}

      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-5 sm:px-6">

          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100"
          >
            ← Back
          </button>

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-3xl">
              🤖
            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                AI Shopping Assistant
              </h1>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Your intelligent shopping companion
              </p>

            </div>

          </div>

        </div>
      </header>

      {/* =====================================
          CHAT AREA
      ===================================== */}

      <main className="mx-auto flex min-h-[calc(100vh-180px)] max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-8">

        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* CHAT MESSAGES */}

          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">

            {messages.map((item, index) => (

              <div
                key={index}
                className={`flex items-end gap-3 ${
                  item.type === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {item.type === "ai" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] ${
                    item.type === "user"
                      ? "rounded-br-md bg-violet-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                  style={{
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.text}
                </div>

              </div>

            ))}

            {loading && (

              <div className="flex items-end gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg">
                  🤖
                </div>

                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">

                  <div className="flex items-center gap-2">

                    <span>
                      Thinking
                    </span>

                    <span className="flex gap-1">

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />

                    </span>

                  </div>

                </div>

              </div>

            )}

          </div>

          {/* =====================================
              INPUT
          ===================================== */}

          <form
            className="border-t border-slate-200 bg-white p-4 sm:p-5"
            onSubmit={sendMessage}
          >

            <div className="flex items-center gap-3">

              <input
                type="text"
                placeholder="Ask me about products, prices, recommendations..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  !message.trim()
                }
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-xl font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                ➤
              </button>

            </div>

            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
              AI Shopping Assistant can help you discover products and answer
              shopping questions.
            </p>

          </form>

        </div>

      </main>

    </div>
  );
}

export default AIChatbot;