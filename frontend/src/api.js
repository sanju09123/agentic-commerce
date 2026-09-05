// =========================================================================
// API CLIENT
// =========================================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

const getToken = () =>
  localStorage.getItem("token");

// =========================================================================
// CORE REQUEST HELPER
// =========================================================================

async function request(
  path,
  {
    method = "GET",
    body,
    auth = false,
    responseType = "json",
    errorMessage = "Request failed",
  } = {}
) {
  const headers = {};

  // JSON body
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  // JWT authentication
  if (auth) {
    headers["Authorization"] =
      `Bearer ${getToken()}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      method,
      headers,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    }
  );

  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => "");

    throw new Error(
      errorText || errorMessage
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  if (responseType === "text") {
    return response.text();
  }

  return response.json();
}

// =========================================================================
// PRODUCTS
// =========================================================================

export function getProducts() {
  return request(
    "/api/products",
    {
      errorMessage:
        "Failed to fetch products",
    }
  );
}

export function getProductDetails(productId) {
  return request(
    `/api/products/${encodeURIComponent(productId)}`,
    {
      errorMessage:
        "Failed to fetch product details",
    }
  );
}

export function searchProducts({
  keyword = "",
  category = "",
  minPrice = "",
  maxPrice = "",
  inStock = "",
} = {}) {
  const params = new URLSearchParams();

  if (keyword) {
    params.append("keyword", keyword);
  }

  if (category) {
    params.append("category", category);
  }

  if (
    minPrice !== "" &&
    minPrice !== null &&
    minPrice !== undefined
  ) {
    params.append("minPrice", minPrice);
  }

  if (
    maxPrice !== "" &&
    maxPrice !== null &&
    maxPrice !== undefined
  ) {
    params.append("maxPrice", maxPrice);
  }

  if (
    inStock !== "" &&
    inStock !== null &&
    inStock !== undefined
  ) {
    params.append("inStock", inStock);
  }

  const queryString = params.toString();

  return request(
    `/api/products/search${
      queryString
        ? `?${queryString}`
        : ""
    }`,
    {
      errorMessage:
        "Failed to search products",
    }
  );
}

// =========================================================================
// SELLER PRODUCTS
// =========================================================================

export function createProduct(productData) {
  return request(
    "/api/products",
    {
      method: "POST",

      body: productData,

      auth: true,

      errorMessage:
        "Failed to create product",
    }
  );
}

export function getSellerProducts() {
  return request(
    "/api/products/seller",
    {
      auth: true,

      errorMessage:
        "Failed to fetch seller products",
    }
  );
}

// ========================================================================
// UPDATE STOCK
// ========================================================================
// IMPORTANT:
// This sets the stock directly.
//
// Example:
// Current stock = 5
// updateProductStock(productId, 8)
// Result = 8
//
// It does NOT increase/decrease the existing stock.
// ========================================================================

export function updateProductStock(
  productId,
  stock
) {
  return request(
    `/api/products/${encodeURIComponent(
      productId
    )}/stock`,
    {
      method: "PUT",

      body: {
        stock,
      },

      auth: true,

      errorMessage:
        "Failed to update product stock",
    }
  );
}

export function deleteProduct(productId) {
  return request(
    `/api/products/${encodeURIComponent(
      productId
    )}`,
    {
      method: "DELETE",

      auth: true,

      errorMessage:
        "Failed to delete product",
    }
  );
}

// =========================================================================
// AUTH
// =========================================================================

export function loginUser(
  email,
  password
) {
  return request(
    "/api/auth/login",
    {
      method: "POST",

      body: {
        email,
        password,
      },

      errorMessage:
        "Login failed",
    }
  );
}

export function registerUser(
  name,
  email,
  password,
  role
) {
  return request(
    "/api/auth/register",
    {
      method: "POST",

      body: {
        name,
        email,
        password,
        role,
      },

      errorMessage:
        "Registration failed",
    }
  );
}

// =========================================================================
// CART
// =========================================================================

export function addToCart(
  productId,
  quantity
) {
  return request(
    "/api/cart/items",
    {
      method: "POST",

      body: {
        productId,
        quantity,
      },

      auth: true,

      errorMessage:
        "Failed to add product to cart",
    }
  );
}

export function getCart() {
  return request(
    "/api/cart",
    {
      auth: true,

      errorMessage:
        "Failed to fetch cart",
    }
  );
}

export function updateCartItemQuantity(
  cartItemId,
  quantity
) {
  return request(
    `/api/cart/items/${encodeURIComponent(
      cartItemId
    )}?quantity=${encodeURIComponent(
      quantity
    )}`,
    {
      method: "PUT",

      auth: true,

      errorMessage:
        "Failed to update cart quantity",
    }
  );
}

export function removeCartItem(
  cartItemId
) {
  return request(
    `/api/cart/items/${encodeURIComponent(
      cartItemId
    )}`,
    {
      method: "DELETE",

      auth: true,

      errorMessage:
        "Failed to remove cart item",
    }
  );
}

// =========================================================================
// ORDERS
// =========================================================================

export function createOrder() {
  return request(
    "/api/orders",
    {
      method: "POST",

      auth: true,

      errorMessage:
        "Failed to create order",
    }
  );
}

export function getMyOrders() {
  return request(
    "/api/orders",
    {
      auth: true,

      errorMessage:
        "Failed to fetch orders",
    }
  );
}

// =========================================================================
// RAZORPAY PAYMENTS
// =========================================================================

export function createPayment(
  orderId
) {
  return request(
    "/api/payments",
    {
      method: "POST",

      body: {
        orderId,
      },

      auth: true,

      errorMessage:
        "Failed to create payment",
    }
  );
}

export function verifyPayment({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  return request(
    "/api/payments/verify",
    {
      method: "POST",

      body: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      },

      auth: true,

      responseType: "text",

      errorMessage:
        "Payment verification failed",
    }
  );
}

// =========================================================================
// AI SHOPPING ASSISTANT
// =========================================================================

export function askAI(message) {
  return request(
    `/api/ai/assistant?message=${encodeURIComponent(
      message
    )}`,
    {
      method: "POST",

      auth: true,

      responseType: "text",

      errorMessage:
        "AI assistant request failed",
    }
  );
}

// =========================================================================
// NORMAL AI QUESTION
// =========================================================================

export function askAIQuestion(prompt) {
  return request(
    `/api/ai/ask?prompt=${encodeURIComponent(
      prompt
    )}`,
    {
      auth: true,

      responseType: "text",

      errorMessage:
        "AI question failed",
    }
  );
}

// =========================================================================
// AI SEARCH PARSER
// =========================================================================

export function parseAISearch(query) {
  return request(
    `/api/ai/search/parse?query=${encodeURIComponent(
      query
    )}`,
    {
      method: "POST",

      auth: true,

      errorMessage:
        "AI search parsing failed",
    }
  );
}

// =========================================================================
// AI PRODUCT SEARCH
// =========================================================================

export function searchProductsUsingAI(query) {
  return request(
    `/api/ai/search?query=${encodeURIComponent(
      query
    )}`,
    {
      method: "POST",

      auth: true,

      errorMessage:
        "AI product search failed",
    }
  );
}

// =========================================================================
// USER PROFILE
// =========================================================================

export function getUserProfile() {
  return request(
    "/api/users/profile",
    {
      auth: true,

      errorMessage:
        "Failed to fetch user profile",
    }
  );
}

export function updateUserProfile({
  name,
  phoneNumber,
  profilePicture,
  address,
  city,
  state,
  pincode,
}) {
  return request(
    "/api/users/profile",
    {
      method: "PUT",

      body: {
        name,
        phoneNumber,
        profilePicture,
        address,
        city,
        state,
        pincode,
      },

      auth: true,

      errorMessage:
        "Failed to update user profile",
    }
  );
}

export function updateUserLocation(
  latitude,
  longitude
) {
  return request(
    `/api/users/profile/location?latitude=${encodeURIComponent(
      latitude
    )}&longitude=${encodeURIComponent(
      longitude
    )}`,
    {
      method: "PUT",

      auth: true,

      errorMessage:
        "Failed to update current location",
    }
  );
}

// =========================================================================
// SELLER STORE
// =========================================================================

export function createStore({
  name,
  description,
  logo,
  address,
  city,
  state,
  pincode,
}) {
  return request(
    "/api/stores",
    {
      method: "POST",

      body: {
        name,
        description,
        logo,
        address,
        city,
        state,
        pincode,
      },

      auth: true,

      errorMessage:
        "Failed to create store",
    }
  );
}

export function getMyStore() {
  return request(
    "/api/stores/my-store",
    {
      auth: true,

      errorMessage:
        "Failed to fetch store",
    }
  );
}

export function updateMyStore({
  name,
  description,
  logo,
  address,
  city,
  state,
  pincode,
}) {
  return request(
    "/api/stores/my-store",
    {
      method: "PUT",

      body: {
        name,
        description,
        logo,
        address,
        city,
        state,
        pincode,
      },

      auth: true,

      errorMessage:
        "Failed to update store",
    }
  );
}