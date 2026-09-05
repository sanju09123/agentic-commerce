# 🤖 Agentic Commerce

### AI-Powered Conversational Shopping & Agentic Payment Platform

Agentic Commerce is a full-stack AI-powered e-commerce platform built using **Java Spring Boot**, **React**, **PostgreSQL**, **Spring AI**, **Google Gemini**, and **Razorpay**.

The application enables users to discover products, manage their shopping cart, create orders, and initiate payments using natural language through an AI-powered conversational shopping assistant.

---

## 🚀 Features

- 🤖 AI-powered conversational shopping assistant
- 🔎 Natural-language product search
- 🧠 Context-aware AI conversations
- 🛒 AI-powered cart management
- 📦 AI-powered order creation
- 💳 Razorpay payment integration
- ✅ Secure payment verification
- 🔐 JWT authentication and authorization
- 🏪 Seller store management
- 📦 Product management
- 📊 Product stock management
- 🗄️ PostgreSQL database
- 🧰 AI Tool Calling using Spring AI
- 📚 REST APIs documented with Swagger/OpenAPI
- 🎨 React + Vite frontend
- 🔐 Environment variable-based configuration
- 🏗️ Full-stack AI commerce architecture

---

## 🏗️ System Architecture

```text
                         React Frontend
                                │
                                ▼
                       Spring Boot Backend
                                │
                                ▼
                         AI Assistant
                                │
                                ▼
                         Spring AI
                                │
                                ▼
                        Google Gemini
                                │
                       AI Tool Calling
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
       Search Products      Cart Tool        Order Tool
              │                 │                 │
              └─────────────────┼─────────────────┘
                                │
                                ▼
                           PostgreSQL
                                │
                                ▼
                            Razorpay
                                │
                                ▼
                       Payment Verification
```

---

## 🛠️ Tech Stack

### Backend
- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Security
- JWT Authentication
- Bean Validation
- Lombok
- Maven

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript

### AI
- Spring AI
- Google Gemini
- Gemini 3.6 Flash
- AI Tool Calling
- Context-aware conversational AI

### Database
- PostgreSQL
- Spring Data JPA
- Hibernate

### Payment Gateway
- Razorpay
- Razorpay Test Mode
- Razorpay Checkout
- Payment Verification

### API Documentation
- Swagger
- OpenAPI

### Development Tools
- Git
- GitHub
- IntelliJ IDEA
- Maven
- npm
- Postman

---

## ⚙️ Environment Variables

Configure the following environment variables for the application.

### Backend
```env
DB_PASSWORD=your_database_password

GOOGLE_API_KEY=your_google_ai_api_key

RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret

JWT_SECRET=your_jwt_secret
```

### Frontend
```env
VITE_API_BASE_URL=http://localhost:8080

VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id
```

> **Note:** Never commit real API keys, Razorpay secrets, database passwords, or JWT secrets to GitHub.

---

## ▶️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/sanju09123/agentic-commerce.git
cd agentic-commerce
```

### 2. Configure Environment Variables
Configure the required environment variables using the values shown above.

### 3. Create PostgreSQL Database
Create a PostgreSQL database:
```
agentic_commerce
```
Make sure PostgreSQL is running before starting the backend.

### 4. Start the Backend
Navigate to the backend:
```bash
cd agentic-commerce
```

**Windows:**
```bash
mvnw.cmd spring-boot:run
```

**Linux/macOS:**
```bash
./mvnw spring-boot:run
```

### 5. Start the Frontend
Open another terminal:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the frontend:
```bash
npm run dev
```

---

## 🌐 Application URLs

| Service | URL |
|---|---|
| React Frontend | http://localhost:4793 |
| Spring Boot Backend | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| PostgreSQL | localhost:5432 |

---

## 🔄 Agentic Commerce Workflow

1. User opens the React frontend.
2. User logs into the application.
3. User opens the AI shopping assistant.
4. User searches for a product using natural language.
5. AI calls the product search tool.
6. Backend searches the real PostgreSQL product database.
7. AI returns the available products.
8. User asks the AI to add a selected product to the cart.
9. AI calls the cart tool using the real product ID.
10. Product is added to the user's cart.
11. User asks the AI to show the cart.
12. AI retrieves the user's real cart.
13. User asks the AI to checkout the cart.
14. AI creates an order using the order tool.
15. Backend creates the order.
16. Razorpay payment is initiated.
17. User completes the payment using Razorpay Checkout.
18. Backend verifies the payment.
19. Payment status is updated successfully.

---

## 🤖 AI Assistant Workflow

The AI assistant supports real commerce actions through controlled backend tools.

### Product Search
```text
User
  ↓
Natural Language Query
  ↓
Google Gemini
  ↓
searchProducts Tool
  ↓
PostgreSQL
  ↓
Real Product Results
```

### Add To Cart
```text
User
  ↓
"Add the first one to my cart"
  ↓
AI Resolves Product Context
  ↓
Real Product ID
  ↓
addToCart Tool
  ↓
User Cart Updated
```

### Checkout
```text
User
  ↓
"Checkout my cart"
  ↓
AI
  ↓
createOrder Tool
  ↓
Order Created
  ↓
Razorpay
  ↓
Payment
  ↓
Payment Verification
```

---

## 🧪 Example AI Interaction

**User:**
> Find me a 5G smartphone under ₹30,000

**AI:**
> Here are the available smartphones...

**User:**
> Add the first one to my cart

**AI:**
> The selected product has been added to your cart.

**User:**
> Show my cart

**AI:**
> Your cart contains...

**User:**
> Checkout my cart

**AI:**
> Your order has been created. Proceeding to payment...

```text
Razorpay Checkout
        ↓
      Payment
        ↓
Payment Verification
        ↓
Payment Successful
```

---

## 🔐 Security

The application uses Spring Security and JWT authentication to protect authenticated operations.

User-specific operations are performed using the currently authenticated user.

**Protected operations include:**
- User authentication
- Cart management
- Order management
- AI commerce operations
- Seller operations

The AI does not have unrestricted database access.

Instead, commerce operations are exposed through controlled backend tools such as:
- `searchProducts`
- `getCart`
- `addToCart`
- `createOrder`

---

## 🎯 Agentic Commerce

Traditional e-commerce requires users to manually navigate through multiple screens:

```text
Search → Product → Add to Cart → Cart → Checkout → Payment
```

Agentic Commerce converts natural-language intent into real commerce actions:

```text
Natural Language
       ↓
   AI Assistant
       ↓
   Tool Calling
       ↓
Real Commerce Action
       ↓
      Cart
       ↓
     Order
       ↓
   Razorpay
       ↓
    Payment
```

The AI is not limited to product recommendations.

It can understand user intent and execute controlled commerce operations using real application data.

---

## 🏆 Razorpay AI Buildathon

This project is built for the **Razorpay AI Buildathon 2026** under the:

**AI Growth & Agentic Commerce Track**

The project demonstrates an AI-driven commerce experience where users can interact with an e-commerce platform using natural language and perform real commerce actions.

### Core Demo

```text
"Find me a 5G smartphone under ₹30,000"
                    ↓
              AI Product Search
                    ↓
       "Add the first one to my cart"
                    ↓
              AI Cart Action
                    ↓
             "Show my cart"
                    ↓
              AI Cart Retrieval
                    ↓
          "Checkout my cart"
                    ↓
             Order Creation
                    ↓
          Razorpay Checkout
                    ↓
          Payment Verification
```

---

## 🔮 Future Enhancements

- AI-powered product recommendations
- Personalized upselling and cross-selling
- AI-powered merchant growth insights
- Automated marketing campaigns
- AI-generated product descriptions
- Agent-readable product catalog
- Inventory forecasting
- AI-based fraud detection
- Multi-agent commerce workflows
- Production payment deployment
- Advanced analytics
- Kubernetes deployment
- CI/CD pipeline
- Monitoring with Prometheus & Grafana

---

## 👨‍💻 Author

**Sanju Chauhan**

Backend Developer | Java | Spring Boot | AI | Microservices

---

## 📄 License

This project is intended for educational, hackathon, and portfolio purposes.

Razorpay is configured in Test Mode for demonstration purposes.