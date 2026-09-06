# Full-Stack Web Application Technical Assignment
A full-stack web application featuring Role-Based Access Control (RBAC) (CUSTOMER, ADMIN, SUPER_ADMIN), customer application submission and management, and an administrative dashboard with real-time filtering, search, and admin user administration.

## Table of Contents
1. [Project Description](#-project-description)
2. [Key Features](#-key-features)
3. [Tech Stack Used](#-tech-stack-used)
4. [Environment Variables Required](#-environment-variables-required)
5. [Setup Instructions (How to Run Locally)](#-setup-instructions-how-to-run-locally)
6. [Default Seeded Credentials](#-default-seeded-credentials)
7. [Postman Collection](#-postman-collection)
8. [API Endpoint Documentation](#-api-endpoint-documentation)
   - [Authentication Endpoints (`/api/auth`)](#1-authentication-endpoints-apiauth)
   - [Submissions Endpoints (`/api/submissions`)](#2-submissions-endpoints-apisubmissions)
   - [Admin Management Endpoints (`/api/admin`)](#3-admin-management-endpoints-apiadmin)
   - [System Health Check (`/health`)](#4-system-health-check-health)
9. [Error Handling & Responses](#-error-handling--responses)


## Project Description
This project is a multi-tiered full-stack portal designed to handle customer application submissions and administrative oversight with strict security standards.


### User Roles & Permissions:
- `CUSTOMER`:
  - Sign up and log in via dedicated customer authentication flows.
  - Complete and submit a detailed application form (First Name, Last Name, Email, Gender, Mobile Number, Address, Feedback).
  - View their submitted application (auto-loaded upon login).
  - Edit/update their own submitted application details.
- `ADMIN`:
  - Securely log in through a dedicated administrative portal.
  - View all customer submissions in an interactive data table.
  - Search submissions by customer first/last name with real-time updates.
  - Filter submissions by gender (`MALE`, `FEMALE`, `OTHER`, or `ALL`).
  - View full details of any submission in a modal dialog.
  - Edit or update any customer submission.
  - Delete customer submissions with confirmation prompts.
- `SUPER_ADMIN`:
  - Inherits all `ADMIN` operational capabilities.
  - Create new Admin accounts with automated secure password generation.
  - View lists of currently `Active` and `Inactive` administrators.   
  - Deactivate (inactivate) administrator accounts.
  - Reactivate previously inactivated administrator accounts.


## Key Features
- Automated Database Setup: Upon starting the backend server, the database schema, tables, foreign keys, and default Super Admin are automatically verified and created if they do not exist—zero manual SQL import required.
- Dual JWT Authentication: Short-lived Access Tokens, paired with Refresh Tokens for secure, persistent sessions.
- Password Security: Strong password hashing using `bcryptjs`.
- Comprehensive Input Validation: Robust field validation, email syntax checking, phone number regex matching, and payload sanitization powered by `express-validator`.
- Modern Responsive UI: Built with React 19, Vite, and Tailwind CSS v4, providing an intuitive, polished user interface with smooth transitions, Lucide icons, and modal dialogs.
- Role-Guarded Protected Routes: Frontend routes and backend API endpoints enforce strict role checks to prevent unauthorized access or privilege escalation.


## Tech Stack Used

### Backend
- Runtime: [Node.js] (v18.x or higher recommended)
- Framework: [Express.js] v5
- Database Driver: [mysql2] (Connection Pool with Promises)
- Security & Authentication:
  - [jsonwebtoken] (Access & Refresh JWTs)
  - [bcryptjs] (One-way password hashing)
- Validation: [express-validator]
- CORS Management: [cors]
- Environment Handling: [dotenv]
- Development Tooling: [nodemon]

### Frontend
- Framework: [React] v19
- Build Tool & Dev Server: [Vite] v6+
- Styling: [Tailwind CSS] v4
- Routing: [React Router] v7 (`react-router-dom`)
- HTTP Client: [Axios] (Centralized instance with request interceptors)
- Iconography: [Lucide React]

### Database
- Engine: [MySQL] 8.0+ (Fully compatible with XAMPP MySQL)
- Schema: Relational tables with foreign key constraints, unique constraints, indices, and timestamps (`created_at`, `updated_at`).


## Environment Variables Required

### 1. Backend (`backend/.env`)
Create a file named `.env` inside the `backend/` directory based on `backend/.env.example`:

```env
# Server Port
PORT=5000

# Database Configuration (MySQL / XAMPP)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=full-stack-assignment

# JWT Authentication Secrets & Lifespans
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_change_in_production
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_change_in_production
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

# Initial Super Admin (Auto-seeded on server startup)
INITIAL_ADMIN_EMAIL=superadmin@example.com
INITIAL_ADMIN_PASSWORD=SuperAdmin@123

# Frontend Client Origin (for CORS)
CLIENT_URL=http://localhost:5173
```

### 2. Frontend (`frontend/.env`)
Create a file named `.env` inside the `frontend/` directory based on `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```


## Setup Instructions (How to Run Locally)
Follow these step-by-step instructions to set up and run the full-stack application on your local machine.

### Prerequisites
Ensure you have the following installed on your machine:
1. Node.js: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
2. npm: `v9.0.0` or higher (bundled with Node.js)
3. MySQL Server: Either standalone MySQL Server 8+ or XAMPP / WampServer with the MySQL service started.
4. Git: Installed for repository cloning.


### Step 1: Clone the Repository
```bash
git clone https://github.com/HiruDilmi/fullstack-assignment.git
cd fullstack-assignment
```

### Step 2: Database Setup
Start your MySQL database service:
- If using XAMPP: Open the XAMPP Control Panel and click Start next to MySQL.
- If using standalone MySQL / Service: Ensure the `mysql` service is active on `localhost:3306`.

> Zero Manual SQL Needed!
> You do not need to manually create the database or run SQL queries. When you start the backend, it will automatically connect, create the `full-stack-assignment` database, create all required tables, and seed the initial Super Admin account.
> (Optional) If you prefer manual SQL setup, you can import `database/schema.sql` into phpMyAdmin (`http://localhost/phpmyadmin`).


### Step 3: Backend Setup & Launch
1. Open a terminal and navigate into the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create the environment configuration file:
   - Windows (PowerShell):
     ```powershell
     copy .env.example .env
     ```
   - macOS / Linux:
     ```bash
     cp .env.example .env
     ```

4. Adjust `backend/.env` if your MySQL port or root password differs from the defaults.

5. (Optional) Run the database initialization script explicitly:
   ```bash
   npm run db:init
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```

### Step 4: Frontend Setup & Launch
1. Open a new, separate terminal window and navigate into the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create the frontend environment configuration file:
   - Windows (PowerShell):
     ```powershell
     copy .env.example .env
     ```
   - macOS / Linux:
     ```bash
     cp .env.example .env
     ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your web browser and navigate to:
   ```text
   http://localhost:5173
   ```

##  Default Seeded Credentials
When the backend starts, an initial Super Admin is automatically created:

| Role | Portal URL | Email | Password |
| :--- | :--- | :--- | :--- |
| SUPER_ADMIN | `http://localhost:5173/admin/login` | `superadmin@example.com` | `SuperAdmin@123` |

### Testing Customer Flow:
- Go to `http://localhost:5173/register` to create a new customer account.
- Log in at `http://localhost:5173/login` using your registered customer credentials.
- Submit or edit your application at `http://localhost:5173/apply`.


## Postman Collection
A complete Postman collection is available to test and inspect all API endpoints directly:

 Shared Collection Link:  
[https://universal-eclipse-252556.postman.co/workspace/8d3e38ad-77cb-4d2e-a8c1-2a6dcea5ef18/collection/32413155-dbce6359-1a7f-4c67-8a42-215d11f3300a?action=share&source=copy-link&creator=32413155]

### How to Use the Postman Collection:
1. Open Postman.
2. Click Import in the top-left corner.
3. Paste the Shared Collection Link above into the URL field (or click the link directly in your browser to fork or view the collection).
4. Set up an environment or collection variables in Postman:
   - `base_url`: `http://localhost:5000/api`
   - `customer_token`: *(set after running Customer Login)*
   - `admin_token`: *(set after running Admin Login)*
5. For protected requests, set the request Authorization tab to:
   - Type: `Bearer Token`
   - Token: `{access token}`


##  API Endpoint Documentation
Base API URL: `http://localhost:5000/api`  
All JSON requests must include the header:
```http
Content-Type: application/json
```
All protected endpoints require the header:
```http
Authorization: Bearer <access_token>
```

---

### 1. Authentication Endpoints (`/api/auth`)

#### 1.1 Customer Registration
Registers a new customer account.

- Method: `POST`
- URL: `/api/auth/customer/register`
- Access: Public
- Request Body:
  ```json
  {
    "email": "customer@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }
  ```
- Success Response (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Customer registered successfully.",
    "data": {
      "userId": 2,
      "email": "customer@example.com",
      "role": "CUSTOMER"
    }
  }
  ```

#### 1.2 Customer Login
Authenticates a customer and returns access & refresh tokens.

- Method: `POST`
- URL: `/api/auth/customer/login`
- Access: Public (Customer Only)
- Request Body:
  ```json
  {
    "email": "customer@example.com",
    "password": "Password123"
  }
  ```
- Success Response (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Customer logged in successfully.",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 2,
        "email": "customer@example.com",
        "role": "CUSTOMER"
      }
    }
  }
  ```

#### 1.3 Admin Login
Authenticates an Administrator (`ADMIN` or `SUPER_ADMIN`).

- Method: `POST`
- URL: `/api/auth/admin/login`
- Access: Public (Admins Only)
- Request Body:
  ```json
  {
    "email": "superadmin@example.com",
    "password": "SuperAdmin@123"
  }
  ```
- Success Response (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Admin logged in successfully.",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "email": "superadmin@example.com",
        "role": "SUPER_ADMIN"
      }
    }
  }
  ```

#### 1.4 Refresh Token
Generates a new access token using an active refresh token.

- Method: `POST`
- URL: `/api/auth/refresh`
- Access: Public
- Request Body:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- Success Response (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Access token refreshed successfully.",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### 1.5 Logout
Revokes the refresh token and terminates the session.

- Method: `POST`
- URL: `/api/auth/logout`
- Access: Protected
- Success Response (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Logged out successfully."
  }
  ```

### 2. Submissions Endpoints (`/api/submissions`)

#### 2.1 Submit Application
Creates a new customer application.

- Method: `POST`
- URL: `/api/submissions/submit`
- Access: Protected (`CUSTOMER` only)
- Request Body:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "gender": "MALE",
    "mobileNumber": "0712345678",
    "address": "123 Galle Road, Colombo 03",
    "feedback": "Looking forward to hearing from you!"
  }
  ```
- Validation Rules:
  - `firstName`, `lastName`: Required, max 100 characters.
  - `email`: Required, valid email format, unique across submissions.
  - `gender`: Required, one of `['MALE', 'FEMALE', 'OTHER']`.
  - `mobileNumber`: Required, matches standard Sri Lankan / local format (e.g. `07XXXXXXXX` or `+947XXXXXXXX`).
  - `address`: Required, max 255 characters.
  - `feedback`: Optional, max 1000 characters.
- Success Response (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Form submitted successfully.",
    "data": {
      "submission": {
        "submission_id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "johndoe@example.com",
        "gender": "MALE",
        "mobile_number": "0712345678",
        "address": "123 Galle Road, Colombo 03",
        "feedback": "Looking forward to hearing from you!",
        "user_created": 2,
        "date_created": "2026-09-06T09:00:00.000Z",
        "user_modified": null,
        "date_modified": null
      }
    }
  }
  ```

#### 2.2 Get Own Application
Fetches the logged-in customer's existing application (used to auto-populate form).

- Method: `GET`
- URL: `/api/submissions/my-application`
- Access: Protected (`CUSTOMER`, `ADMIN`, `SUPER_ADMIN`)
- Success Response (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "submission": {
        "submission_id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "johndoe@example.com",
        "gender": "MALE",
        "mobile_number": "0712345678",
        "address": "123 Galle Road, Colombo 03",
        "feedback": "Looking forward to hearing from you!"
      },
      "hasSubmission": true
    }
  }
  ```

#### 2.3 Get All Submissions (with Search & Filters)
Lists all submissions with optional gender filtering and search query.

- Method: `GET`
- URL: `/api/submissions`
- Access: Protected (`ADMIN`, `SUPER_ADMIN`)
- Query Parameters:
  - `gender` *(optional)*: `MALE`, `FEMALE`, or `OTHER`
  - `search` *(optional)*: Case-insensitive search matching `first_name` or `last_name`
- Example: `/api/submissions?gender=FEMALE&search=Jane`
- Success Response (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Submissions retrieved successfully.",
    "count": 1,
    "data": {
      "submissions": [
        {
          "submission_id": 2,
          "first_name": "Jane",
          "last_name": "Smith",
          "email": "janesmith@example.com",
          "gender": "FEMALE",
          "mobile_number": "0771234567",
          "address": "45 Kandy Road, Peradeniya",
          "feedback": "Great service.",
          "user_created": 3,
          "date_created": "2026-09-06T10:15:00.000Z"
        }
      ]
    }
  }
  ```

#### 2.4 Get Single Submission by ID
Retrieves details for a specific submission.

- Method: `GET`
- URL: `/api/submissions/get-single/:id`
- Access: Protected (`ADMIN`, `SUPER_ADMIN`, or Owner `CUSTOMER`)
- Success Response (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "submission": {
        "submission_id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "johndoe@example.com",
        "gender": "MALE",
        "mobile_number": "0712345678",
        "address": "123 Galle Road, Colombo 03",
        "feedback": "Updated feedback",
        "date_created": "2026-09-06T09:00:00.000Z"
      }
    }
  }
  ```

#### 2.5 Update Submission
Updates an existing submission by ID.

- Method: `PUT`
- URL: `/api/submissions/update/:id`
- Access: Protected (`ADMIN`, `SUPER_ADMIN`, or Owner `CUSTOMER`)
- Request Body:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "gender": "MALE",
    "mobileNumber": "0712345678",
    "address": "456 Marine Drive, Colombo 03",
    "feedback": "Updated address details."
  }
  ```
- Success Response (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Submission updated successfully.",
    "data": {
      "submission": {
        "submission_id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "johndoe@example.com",
        "gender": "MALE",
        "mobile_number": "0712345678",
        "address": "456 Marine Drive, Colombo 03",
        "feedback": "Updated address details.",
        "date_modified": "2026-09-06T11:20:00.000Z"
      }
    }
  }
  ```

#### 2.6 Delete Submission
Permanently removes a submission from the database.

- Method: `DELETE`
- URL: `/api/submissions/delete/:id`
- Access: Protected (`ADMIN`, `SUPER_ADMIN`)
- Success Response (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Submission with ID 1 deleted successfully."
  }
  ```

### 3. Admin Management Endpoints (`/api/admin`)

#### 3.1 Create Admin Account
Creates a new administrator account with a cryptographically secure, auto-generated password.

- Method: `POST`
- URL: `/api/admin/create-admin`
- Access: Protected (`SUPER_ADMIN` only)
- Request Body:
  ```json
  {
    "email": "admin2@example.com"
  }
  ```
- Success Response (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Admin account created successfully.",
    "data": {
      "userId": 4,
      "email": "admin2@example.com",
      "role": "ADMIN",
      "generatedPassword": "Kj9#mQ2$pL9!"
    }
  }
  ```

#### 3.2 Fetch Active Admins
Lists all currently active administrator accounts.

- Method: `GET`
- URL: `/api/admin/fetch-active-admins`
- Access: Protected (`SUPER_ADMIN` only)
- Success Response (`201 OK`):
  ```json
  {
    "success": true,
    "message": "Admins fetched successfully.",
    "data": {
      "admins": [
        {
          "user_id": 1,
          "email": "superadmin@example.com",
          "role": "SUPER_ADMIN",
          "status": 1,
          "created_at": "2026-09-06T08:00:00.000Z"
        },
        {
          "user_id": 4,
          "email": "admin2@example.com",
          "role": "ADMIN",
          "status": 1,
          "created_at": "2026-09-06T11:30:00.000Z"
        }
      ]
    }
  }
  ```

#### 3.3 Fetch Inactive Admins
Lists all deactivated administrator accounts.

- Method: `GET`
- URL: `/api/admin/fetch-inactive-admins`
- Access: Protected (`SUPER_ADMIN` only)
- Success Response (`201 OK`):
  ```json
  {
    "success": true,
    "message": "Admins fetched successfully.",
    "data": {
      "admins": [
        {
          "user_id": 5,
          "email": "deactivated_admin@example.com",
          "role": "ADMIN",
          "status": 0,
          "created_at": "2026-09-05T12:00:00.000Z"
        }
      ]
    }
  }
  ```

#### 3.4 Inactivate Admin Account
Deactivates an active admin account and clears their refresh tokens. *(Super Admin accounts cannot be inactivated).*

- Method: `PATCH` or `PUT`
- URL: `/api/admin/inactivate-admin/:id`
- Access: Protected (`SUPER_ADMIN` only)
- Success Response (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Administrator admin2@example.com has been inactivated.",
    "data": {
      "userId": 4,
      "email": "admin2@example.com",
      "status": 0
    }
  }
  ```

#### 3.5 Reactivate Admin Account
Re-enables a previously deactivated admin account.

- Method: `PATCH` or `PUT`
- URL: `/api/admin/activate-admin/:id`
- Access: Protected (`SUPER_ADMIN` only)
- Success Response (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Administrator admin2@example.com has been reactivated.",
    "data": {
      "userId": 4,
      "email": "admin2@example.com",
      "status": 1
    }
  }
  ```

### 4. System Health Check (`/health`)

- Method: `GET`
- URL: `/health`
- Access: Public
- Success Response (`200 OK`):
  ```json
  {
    "status": "OK",
    "timestamp": "2026-09-06T14:40:00.000Z"
  }
  ```


##  Error Handling & Responses
The API uses standardized JSON error formats and standard HTTP status codes:

### Validation Error (`400 Bad Request`)
```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Please provide a valid email address.",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Authentication Error (`401 Unauthorized`)
```json
{
  "success": false,
  "message": "Authentication required. Please provide a valid Bearer token."
}
```

### Expired Token Error (`401 Unauthorized`)
```json
{
  "success": false,
  "code": "TOKEN_EXPIRED",
  "message": "Access token has expired. Please refresh your token."
}
```

### Authorization / Forbidden Error (`403 Forbidden`)
```json
{
  "success": false,
  "message": "Forbidden: Access restricted to [SUPER_ADMIN] role(s)."
}
```

### Not Found Error (`404 Not Found`)
```json
{
  "success": false,
  "message": "Cannot find GET /api/unknown on this server."
}
```