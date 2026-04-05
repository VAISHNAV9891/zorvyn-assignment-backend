# 📈 Finance Control Backend

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

A production-grade, highly scalable RESTful API built for managing enterprise-level financial transactions, tracking expenses, and generating complex analytical dashboards in real-time.

> **Note:** If testing the live deployment on a free-tier hosting service (like Render), please allow 30-50 seconds for the initial request to wake up the server.

---

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

⚙️ Local Installation & Setup
1. Clone the Repository

Bash
git clone <repository-url>
cd finance-control-backend
2. Install Dependencies

Bash
npm install
3. Environment Variables
Create a .env file in the root directory:

Code snippet
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/finance_control
JWT_SECRET_KEY=super_secret_jwt_key_123
JWT_EXPIRES_IN=24h
4. Start the Server

Bash
# Run in development mode (with Nodemon)
npm run dev
📡 API Documentation & Testing
Once the server is running, you can access the interactive API documentation and test the endpoints directly from your browser:

👉 Swagger UI: http://localhost:5000/api-docs

Demo Credentials for Testing
If you are testing the Role-Based Access Control, use these standard mock profiles:
| Role | Access Capabilities |
| :--- | :--- |
| Admin | Full access (CRUD operations + Dashboards) |
| Analyst| View Ledger List + Dashboards |
| Viewer | View Dashboards ONLY (Cannot view individual transactions) |

🛡️ Data Integrity
Soft Deletes: Records are never permanently deleted from the DB (isDeleted: true flag is toggled). This ensures accurate historical auditing.

Regex Text Search: Implemented case-insensitive partial matching ($regex with i flag) for smart and intuitive category filtering.

