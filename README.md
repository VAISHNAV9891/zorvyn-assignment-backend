# 📈 Finance Control Backend

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

A production-grade, highly scalable RESTful API built for managing enterprise-level financial transactions, tracking expenses, and generating complex analytical dashboards in real-time.

> **Note:** If testing the live deployment on a free-tier hosting service (like Render), please allow 30-50 seconds for the initial request to wake up the server.

---

* **🌐 Live Server (Render):** https://zorvyn-assignment-backend-scaa.onrender.com
* **📄 API Documentation (Postman):** https://zorvyn-assignment-backend-scaa.onrender.com/api-docs


## 🏛️ Architecture & System Design
This project strictly follows the **Model-View-Controller (MVC)** architecture to ensure "Separation of Concerns" and maintainability at scale.

- **📂 Models:** Defined using Mongoose schemas with soft-delete capabilities for strict financial audit compliance.
- **🎮 Controllers:** Handles the core business logic, complex MongoDB aggregation pipelines, and cursor pagination algorithms.
- **🛣️ Routes:** Cleanly maps endpoints to controllers and applies role-based security guards.
- **🛡️ Middlewares:** Acts as the gatekeepers for Authentication, Authorization (RBAC), and payload validation.

---

## ✨ Key Technical Features

### 1. 📊 Advanced Dashboard Aggregations (High Performance)
- **Dynamic Time Windows:** Implemented strict date-range filtering (`$match`,'$group' with `$gte` and `$lte`) to power interactive frontend date-pickers.

### 2. 🚀 Scalability: Cursor-Based Pagination
- Implemented efficient cursor-based pagination using the `_id` field (descending order) for the main transaction ledger.
- *Benefit:* Ensures **O(1) read performance** regardless of database size (millions of records). It prevents the "data drift" (missing or duplicate items) commonly seen with traditional `skip/limit` offsets when new transactions are added in real-time.

### 3. 🔐 Strict Role-Based Access Control (RBAC)
Granular permission levels implemented via custom JWT middlewares:
- **👑 Admin:** Complete system control. Can Create, Update, and Delete records, plus view all dashboards.
- **👁️ Analyst:** Read-only access to the complete Ledger list and analytical dashboards.
- **👤 Viewer:** Highly restricted. Can *only* view the aggregated Dashboard metrics (No access to individual records).

### 4. 📄 Dynamic Swagger Documentation
- Integrated `swagger-jsdoc` and `swagger-ui-express` for auto-generating interactive API documentation directly from route comments, ensuring docs are never out-of-sync with the codebase.

---
## 🛡️ Data Integrity & Security
- **NoSQL Injection Protection:** Integrated `express-mongo-sanitize` to actively strip out potentially malicious MongoDB operators (like `$gt`, `$eq`, `.`) from user-supplied data (`req.body`, `req.query`, `req.params`). 
  - *Why?* This is a critical security measure to prevent attackers from bypassing authentication or manipulating database queries using advanced NoSQL injection techniques.
- **Soft Deletes:** Records are never permanently deleted from the DB (`isDeleted: true` flag is toggled). This ensures accurate historical auditing.
- **Regex Text Search:** Implemented case-insensitive partial matching (`$regex` with `i` flag) for smart and intuitive category filtering.

### 🔐 Enterprise-Grade Authentication System
Built with a "Zero-Trust" security mindset, the authentication module goes far beyond basic login logic, ensuring bulletproof user sessions and data safety.
- **Refresh Token Rotation (RTR) & JWT:** Uses short-lived Access Tokens paired with rotating Refresh Tokens. Every time a new access token is requested, the old refresh token is immediately invalidated, completely neutralizing token theft and replay attacks.
- **Two-Factor Authentication (2FA):** Implemented an additional layer of security for account access, ensuring that even if credentials are compromised, unauthorized entry is blocked.
- **Secure Password Recovery:** Fully functional `Forgot Password` and `Reset Password` flows using cryptographically secure, time-bound reset tokens.
- **Transactional Emails (Nodemailer):** Seamlessly integrated `Nodemailer` to handle automated email dispatches for OTP delivery, password reset links, and critical account alerts.

  ### 🛡️ Admin Module 
**Base URL:** `http://localhost:5000/api/zorvyn-fintech/admin`

| Method | Complete Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/create-user` | `Admin` | Create a new user manually from the admin panel. |
| **PATCH** | `/update-user-role` | `Admin` | Modify an existing user's access role (e.g., Viewer to Analyst). |
| **GET** | `/get-all-users` | `Admin` | Fetch the complete list of registered users. |
| **PATCH** | `/update-status` | `Admin` | Freeze/Unfreeze or update a user's account status. |
| **DELETE** | `/delete-user/:id` | `Admin` | Remove a user account permanently or soft-delete it. |

---

### 🔐 Auth & Security Module (Including OAuth)
**Base URL:** `/api/zorvyn-fintech/auth`

| Method | Complete Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/signup` | *Public* | Register a new user account. |
| **POST** | `/signup/verify-email/:rawToken` | *Public* | Verify newly registered user's email via secure link. |
| **POST** | `/login` | *Public* | Standard email/password login to generate JWT tokens. |
| **GET** | `/google` | *Public* | Initiate Google OAuth 2.0 Single Sign-On (SSO). |
| **GET** | `/google/callback` | *Public* | Google OAuth callback for profile extraction & token generation. |
| **POST** | `/enable-2FA` | *Logged In User* | Initialize Two-Factor Authentication setup. |
| **POST** | `/verify2FA-setup` | *Logged In User* | Verify and activate 2FA with the authenticator app. |
| **POST** | `/verify-otp` | *Public* | Verify OTP during the login or sensitive action flow. |
| **GET** | `/get-session-tokens` | *Public* | Refresh Token Rotation (RTR) to get a new access token. |
| **DELETE** | `/logout` | *Public* | Clear current session and invalidate the active token. |
| **DELETE** | `/terminate-all-sessions`| *Public* | Log out from all devices simultaneously. |
| **POST** | `/recover-your-account/:recoverToken` | *Public* | Recover account using the email recovery link token. |
| **POST** | `/reset-frozen-password` | *Public* | Reset password for an account that was frozen/locked. |

---

### 📊 Dashboard & Analytics Module
**Base URL:** `http://localhost:5000/api/zorvyn-fintech/dashboard`

| Method | Complete Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/totals` | `Admin, Analyst, Viewer` | Get total income, expenses, and net balance. |
| **GET** | `/categories` | `Admin, Analyst, Viewer` | Get spending breakdown by category. |
| **GET** | `/trends/monthly` | `Admin, Analyst, Viewer` | Fetch monthly data points for time-series charts. |
| **GET** | `/trends/weekly` | `Admin, Analyst, Viewer` | Fetch weekly data points for granular time-series charts. |
| **GET** | `/recent` | `Admin, Analyst, Viewer` | Get the 5 most recent transactions for the dashboard view. |

---

### 💸 Ledger & Transactions Module
**Base URL:** `http://localhost:5000/api/zorvyn-fintech/transactions`

| Method | Complete Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/create-transaction` | `Admin` | Record a new income or expense entry. |
| **GET** | `/get-transactions` | `Admin, Analyst` | Fetch the paginated list of all transactions. |
| **GET** | `/transaction/:id` | `Admin, Analyst` | Fetch detailed data for a single, specific transaction. |
| **GET** | `/get-by-date` | `Admin, Analyst` | Filter and fetch transactions for a specific day. |
| **PATCH** | `/update-transaction/:id`| `Admin` | Modify an existing transaction (amount, category, etc.). |
| **DELETE** | `/delete-transaction/:id`| `Admin` | Soft-delete a transaction from the ledger. |

### 5. How to try this system ?

**Way 1 -> Test the API endpoints using Swagger Documentation (Live)**
You can directly interact with and test the live endpoints without installing anything on your machine.
👉 [Click here to open Swagger UI](https://zorvyn-assignment-backend-scaa.onrender.com/api-docs) *(Update with live link if deployed)*

**Way 2 -> If you want to test this system locally, follow the steps given below:**

**Step 1: Prerequisites**
Ensure you have [Node.js](https://nodejs.org/) installed on your system. You will also need an API testing client like [Postman](https://www.postman.com/downloads/) or thunder client.

**Step 2: Clone and Install Dependencies**
```bash
git clone https://github.com/VAISHNAV9891/zorvyn-assignment-backend
cd zorvyn-assignment-backend
npm install
```

**Step 3: Create the Environment(.env file)**
```bash
cat <<EOF > .env
PORT=5000
NODE_ENV="development"
MONGO_URL=mongodb://localhost:27017/finance_control
JWT_SECRET_KEY=super_secret_jwt_key_123
JWT_EXPIRES_IN=24h
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SENDGRID_API_KEY=
SENDGRID_FROM=
COOKIE_SECRET=

//FOR DEVELOPMENT MODE ONLY (LOCAL)
EMAIL_USER=
EMAIL_PASS=
EOF
```

**Step 4: Start the server in development mode(locally)**
```bash
node index.js
```



## 🧪 Testing Credentials
To facilitate quick testing of the live API or via the Postman collection, use these pre-configured accounts. Each account is bound to a specific role to demonstrate the **Role-Based Access Control (RBAC)** in action.

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | email : `admin@finance.com` | password : `Admin@123` | Full access (CRUD operations on Ledger + View all Dashboards) |
| **👁️ Analyst**| email : `analyst@finance.com` | password : `Analyst@123` | Read-Only (View paginated Ledger List + View Dashboards) |
| **👤 Viewer** | email : `viewer@finance.com` | password : `Viewer@123` | Restricted (View Dashboards ONLY, no access to individual records) |

> **Tip:** Pass the JWT token received from the `/login` endpoint as a Bearer Token in the `Authorization` header for subsequent requests.


