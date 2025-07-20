# Finura API Documentation

## Overview

Finura is a RESTful API for an interactive budget visualizer app. It allows users to register, log in, manage monthly budgets, and track expenses. All endpoints return JSON responses. JWT authentication is required for all budget and expense routes.

**Base URL:**  
`http://<your-server-domain>:<PORT>/api/`

---

## Authentication

### Register

- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - `201 Created`
  ```json
  {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "JWT_TOKEN"
  }
  ```
- **Errors:**
  - `400 Bad Request` – Missing fields or user already exists.

---

### Login

- **Endpoint:** `POST /api/auth/login`
- **Description:** Log in an existing user.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - `200 OK`
  ```json
  {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "JWT_TOKEN"
  }
  ```
- **Errors:**
  - `401 Unauthorized` – Invalid email or password.

---

## Authentication Middleware

- All routes below require the `Authorization` header:
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- If the token is missing or invalid, a `401 Unauthorized` error is returned.

---

## Budget Endpoints

### Create Budget

- **Endpoint:** `POST /api/budget`
- **Description:** Create a new monthly budget.
- **Request Body:**
  ```json
  {
    "month": "July 2025",
    "income": 5000,
    "categories": [
      { "name": "Food", "limit": 600 },
      { "name": "Rent", "limit": 1500 }
    ]
  }
  ```
- **Response:**
  - `201 Created`
  ```json
  {
    "_id": "budgetId",
    "user": "userId",
    "month": "July 2025",
    "income": 5000,
    "categories": [
      { "_id": "catId1", "name": "Food", "limit": 600 },
      { "_id": "catId2", "name": "Rent", "limit": 1500 }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```
- **Errors:**
  - `400 Bad Request` – Missing or invalid fields.

---

### Get All Budgets

- **Endpoint:** `GET /api/budget`
- **Description:** Get all budgets for the authenticated user.
- **Response:**
  - `200 OK`
  ```json
  [
    {
      "_id": "budgetId",
      "user": "userId",
      "month": "July 2025",
      "income": 5000,
      "categories": [ ... ],
      "createdAt": "...",
      "updatedAt": "..."
    },
    ...
  ]
  ```

---

### Get Single Budget

- **Endpoint:** `GET /api/budget/:id`
- **Description:** Get a specific budget by ID.
- **Response:**
  - `200 OK`
  ```json
  {
    "_id": "budgetId",
    "user": "userId",
    "month": "July 2025",
    "income": 5000,
    "categories": [ ... ],
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```
- **Errors:**
  - `404 Not Found` – Budget not found or does not belong to user.

---

### Update Budget

- **Endpoint:** `PUT /api/budget/:id`
- **Description:** Update a budget by ID.
- **Request Body:** (any updatable fields)
  ```json
  {
    "income": 6000,
    "categories": [
      { "name": "Food", "limit": 700 }
    ]
  }
  ```
- **Response:**
  - `200 OK`
  ```json
  {
    "_id": "budgetId",
    "user": "userId",
    "month": "July 2025",
    "income": 6000,
    "categories": [ ... ],
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```
- **Errors:**
  - `404 Not Found` – Budget not found or does not belong to user.

---

### Delete Budget

- **Endpoint:** `DELETE /api/budget/:id`
- **Description:** Delete a budget by ID.
- **Response:**
  - `200 OK`
  ```json
  { "message": "Budget removed" }
  ```
- **Errors:**
  - `404 Not Found` – Budget not found or does not belong to user.

---

## Expense Endpoints

### Add Expense

- **Endpoint:** `POST /api/expenses`
- **Description:** Add an expense to a budget.
- **Request Body:**
  ```json
  {
    "budgetId": "budgetId",
    "category": "Food",
    "amount": 50,
    "date": "2025-07-10T00:00:00.000Z",
    "note": "Groceries"
  }
  ```
- **Response:**
  - `201 Created`
  ```json
  {
    "_id": "expenseId",
    "budget": "budgetId",
    "category": "Food",
    "amount": 50,
    "date": "2025-07-10T00:00:00.000Z",
    "note": "Groceries",
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```
- **Errors:**
  - `400 Bad Request` – Missing or invalid fields.

---

### Get Expenses for a Budget

- **Endpoint:** `GET /api/expenses?budgetId=budgetId`
- **Description:** Get all expenses for a specific budget.
- **Response:**
  - `200 OK`
  ```json
  [
    {
      "_id": "expenseId",
      "budget": "budgetId",
      "category": "Food",
      "amount": 50,
      "date": "2025-07-10T00:00:00.000Z",
      "note": "Groceries",
      "createdAt": "...",
      "updatedAt": "..."
    },
    ...
  ]
  ```
- **Errors:**
  - `400 Bad Request` – Missing budgetId.

---

### Delete Expense

- **Endpoint:** `DELETE /api/expenses/:id`
- **Description:** Delete an expense by ID.
- **Response:**
  - `200 OK`
  ```json
  { "message": "Expense removed" }
  ```
- **Errors:**
  - `404 Not Found` – Expense not found.

---

## Error Handling

- All errors return a JSON response:
  ```json
  {
    "message": "Error description",
    "stack": "..." // Only in development mode
  }
  ```
- Common status codes: `400`, `401`, `404`, `500`.

---

## Other Details

- **CORS:** Enabled for all origins.
- **Logging:** Uses `morgan` in development mode.
- **Content-Type:** All endpoints expect and return `application/json`.
- **Authentication:** All `/api/budget` and `/api/expenses` endpoints require a valid JWT in the `Authorization` header.

---

## Example Usage

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"yourpassword"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"yourpassword"}'
```

**Create Budget (Authenticated):**
```bash
curl -X POST http://localhost:5000/api/budget \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"month":"July 2025","income":5000,"categories":[{"name":"Food","limit":600}]}'
```

---

## Environment Variables

- `PORT` – Server port (default: 5000)
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – Secret for JWT signing

---

If you need this in another format or want a Postman collection, let me know! 