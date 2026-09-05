import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";

import SellerDashboard from "./pages/SellerDashboard";
import SellerProducts from "./pages/SellerProducts";
import SellerAddProduct from "./pages/SellerAddProduct";

import Profile from "./components/Profile";
import CreateStore from "./components/CreateStore";
import SellerStore from "./components/SellerStore";
import AIChatbot from "./components/AIChatbot";

function App() {
  const [path, setPath] = useState(
    window.location.pathname
  );

  // ==========================================
  // AI RETURN PATH
  // ==========================================

  const [aiReturnPath, setAiReturnPath] = useState(
    "/products"
  );

  // ==========================================
  // NAVIGATION
  // ==========================================

  const navigate = (url) => {
    /*
     * IMPORTANT:
     *
     * navigate(-1)
     * = go exactly one browser-history page back
     *
     * navigate(1)
     * = go one page forward
     */

    if (typeof url === "number") {
      window.history.go(url);
      return;
    }

    /*
     * Normal application navigation
     */
    window.history.pushState({}, "", url);
    setPath(window.location.pathname);
  };

  // ==========================================
  // BROWSER BACK / FORWARD
  // ==========================================

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  // ==========================================
  // LOGIN INFORMATION
  // ==========================================

  const token = localStorage.getItem("token");

  const role =
    localStorage.getItem("role")?.toUpperCase();

  const isLoggedIn = Boolean(token);

  const isSeller = role === "SELLER";

  let page;

  // ==========================================
  // PUBLIC ROUTES
  // ==========================================

  if (path === "/login") {
    page = (
      <Login
        navigate={navigate}
      />
    );
  }

  else if (path === "/register") {
    page = (
      <Register
        navigate={navigate}
      />
    );
  }

  // ==========================================
  // SELLER DASHBOARD
  // ==========================================

  else if (path === "/seller") {
    if (!isLoggedIn) {
      page = (
        <Login
          navigate={navigate}
        />
      );
    }

    else if (!isSeller) {
      page = (
        <Products
          navigate={navigate}
        />
      );
    }

    else {
      page = (
        <SellerDashboard
          navigate={navigate}
        />
      );
    }
  }

  // ==========================================
  // SELLER PRODUCTS
  // ==========================================

  else if (path === "/seller/products") {
    if (!isLoggedIn) {
      page = (
        <Login
          navigate={navigate}
        />
      );
    }

    else if (!isSeller) {
      page = (
        <Products
          navigate={navigate}
        />
      );
    }

    else {
      page = (
        <SellerProducts
          navigate={navigate}
        />
      );
    }
  }

  // ==========================================
  // ADD PRODUCT
  // ==========================================

  else if (
    path === "/seller/products/create"
  ) {
    if (!isLoggedIn) {
      page = (
        <Login
          navigate={navigate}
        />
      );
    }

    else if (!isSeller) {
      page = (
        <Products
          navigate={navigate}
        />
      );
    }

    else {
      page = (
        <SellerAddProduct
          navigate={navigate}
        />
      );
    }
  }

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  else if (
    path.startsWith(
      "/seller/products/edit/"
    )
  ) {
    if (!isLoggedIn) {
      page = (
        <Login
          navigate={navigate}
        />
      );
    }

    else if (!isSeller) {
      page = (
        <Products
          navigate={navigate}
        />
      );
    }

    else {
      const productId =
        decodeURIComponent(
          path.substring(
            "/seller/products/edit/".length
          )
        );

      page = (
        <SellerAddProduct
          navigate={navigate}
          productId={productId}
        />
      );
    }
  }

  // ==========================================
  // CREATE SELLER STORE
  // ==========================================

  else if (
    path === "/seller/create-store"
  ) {
    if (!isLoggedIn) {
      page = (
        <Login
          navigate={navigate}
        />
      );
    }

    else if (!isSeller) {
      page = (
        <Products
          navigate={navigate}
        />
      );
    }

    else {
      page = (
        <CreateStore
          navigate={navigate}
        />
      );
    }
  }

  // ==========================================
  // SELLER STORE
  // ==========================================

  else if (
    path === "/seller/store"
  ) {
    if (!isLoggedIn) {
      page = (
        <Login
          navigate={navigate}
        />
      );
    }

    else if (!isSeller) {
      page = (
        <Products
          navigate={navigate}
        />
      );
    }

    else {
      page = (
        <SellerStore
          navigate={navigate}
        />
      );
    }
  }

  // ==========================================
  // PRODUCT DETAILS
  // ==========================================

  else if (
    path.startsWith("/product/")
  ) {
    if (!isLoggedIn) {
      page = (
        <Login
          navigate={navigate}
        />
      );
    }

    else if (isSeller) {
      page = (
        <SellerDashboard
          navigate={navigate}
        />
      );
    }

    else {
      const productId =
        decodeURIComponent(
          path.substring(
            "/product/".length
          )
        );

      page = (
        <ProductDetails
          navigate={navigate}
          productId={productId}
        />
      );
    }
  }

  // ==========================================
  // PRODUCTS / CUSTOMER STORE
  // ==========================================

  else if (path === "/products") {
    if (!isLoggedIn) {
      page = (
        <Login
          navigate={navigate}
        />
      );
    }

    else {
      page = (
        <Products
          navigate={navigate}
        />
      );
    }
  }

  // ==========================================
  // CUSTOMER CART
  // ==========================================

  else if (path === "/cart") {
    if (!isLoggedIn) {
      page = (
        <Login
          navigate={navigate}
        />
      );
    }

    else if (isSeller) {
      page = (
        <SellerDashboard
          navigate={navigate}
        />
      );
    }

    else {
      page = (
        <Cart
          navigate={navigate}
        />
      );
    }
  }

  // ==========================================
  // CUSTOMER ORDERS
  // ==========================================

  else if (path === "/orders") {
    if (!isLoggedIn) {
      page = (
        <Login
          navigate={navigate}
        />
      );
    }

    else if (isSeller) {
      page = (
        <SellerDashboard
          navigate={navigate}
        />
      );
    }

    else {
      page = (
        <Orders
          navigate={navigate}
        />
      );
    }
  }

  // ==========================================
  // CUSTOMER CHECKOUT
  // ==========================================

  else if (path === "/checkout") {
    if (!isLoggedIn) {
      page = (
        <Login
          navigate={navigate}
        />
      );
    }

    else if (isSeller) {
      page = (
        <SellerDashboard
          navigate={navigate}
        />
      );
    }

    else {
      page = (
        <Checkout
          navigate={navigate}
        />
      );
    }
  }

  // ==========================================
  // USER PROFILE
  // ==========================================

  else if (path === "/profile") {
    if (!isLoggedIn) {
      page = (
        <Login
          navigate={navigate}
        />
      );
    }

    else {
      page = (
        <Profile
          navigate={navigate}
        />
      );
    }
  }

  // ==========================================
  // AI ASSISTANT
  // ==========================================

  else if (path === "/ai-assistant") {
    if (!isLoggedIn) {
      page = (
        <Login
          navigate={navigate}
        />
      );
    }

    else {
      page = (
        <AIChatbot
          navigate={navigate}
          backPath={aiReturnPath}
        />
      );
    }
  }

  // ==========================================
  // HOME
  // ==========================================

  else {
    page = (
      <Home
        navigate={navigate}
      />
    );
  }

  // ==========================================
  // AI FLOATING BUTTON
  // ==========================================

  const showAIButton =
    isLoggedIn &&
    path !== "/" &&
    path !== "/login" &&
    path !== "/register" &&
    path !== "/ai-assistant";

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {page}

      {showAIButton && (
        <button
          type="button"
          onClick={() => {
            setAiReturnPath(path);
            navigate("/ai-assistant");
          }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-200"
        >
          <span className="text-lg">
            🤖
          </span>

          <span>
            AI Assistant
          </span>
        </button>
      )}
    </div>
  );
}

export default App;