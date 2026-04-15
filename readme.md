# 🎟️ Book My Ticket (Backend)

A simplified movie seat booking backend system built using Node.js, Express, and PostgreSQL.

> 📌 This project was built as an extension of an existing codebase as per hackathon requirements.

---

## 🚀 Features

* 🔐 User Authentication (Register & Login)
* 🍪 JWT-based Auth with Refresh Token (HTTP-only cookies)
* 🛡️ Protected Booking Endpoints
* 🎟️ Seat Booking System
* 🚫 Prevents Duplicate Seat Booking (using DB transactions)
* 👤 Associates bookings with logged-in users
* 📦 Clean MVC Architecture (Routes → Controllers → Models)
* ✅ Input Validation using Joi
* 🗄️ PostgreSQL Database with proper relations

---

## 🧠 Tech Stack

* Node.js
* Express.js
* PostgreSQL
* JWT (jsonwebtoken)
* bcrypt
* Joi (validation)
* cookie-parser

---

## 📁 Project Structure

```
src/
├── config/        # DB connection
├── controllers/   # Business logic
├── data/          # Table creation
├── middlewares/   # Auth, validation, error handling
├── models/        # DB queries
├── routes/        # API routes
├── validators/    # Joi schemas
```

---

## ⚙️ Setup Instructions

### 1. Clone Repo

```bash
git clone https://github.com/joydeepdev/book-my-ticket.git
cd book-my-ticket
```

### 2. Start Docker DB

```bash
npm run db:up
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Environment Variables

Create `.env`:

```env
PORT=8080

DB_USER=postgres
DB_HOST=localhost
DB_PORT=5433
DB_PASSWORD=postgres
DB_NAME=sql_class_2_db

JWT_ACCESS_TOKEN=your_access_secret
JWT_REFRESH_TOKEN=your_refresh_secret
```

### 5. Start Server

```bash
npm run dev
```

---

## 🗄️ Database Tables

### Users

* Stores user credentials and refresh token

### Seats

* Stores seat availability

### Bookings

* Stores booking history linked to users

---

## 🔐 Authentication Flow

1. User logs in → receives:

   * Access Token (short-lived)
   * Refresh Token (stored in HTTP-only cookie)

2. Access token expires → call `/refresh-token`

3. New access token generated securely

---

## 📌 API Reference

### 🔐 Auth Routes

#### Register User

```http
POST /api/auth/register
```

**Body:**

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456"
}
```

---

#### Login User

```http
POST /api/auth/login
```

**Body:**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**

* Returns access token
* Sets refresh token in HTTP-only cookie

---

#### Refresh Token

```http
POST /api/auth/refresh-token
```

* Uses cookie to generate new access token

---

#### Logout

```http
POST /api/auth/logout
```

* Clears refresh token from DB and cookie

---

### 🎟️ Seat Routes

#### Get All Seats

```http
GET /seats
```

---

### 🎟️ Booking Routes (Protected)

> Requires `Authorization` header with access token

#### Book a Seat

```http
PUT /:id/:name
```

**Headers:**

```http
Authorization: <access_token>
```

---

#### Get My Bookings

```http
GET /my-bookings
```

**Headers:**

```http
Authorization: <access_token>
```

**Response:**

```json
[
  {
    "id": 1,
    "user_id": 2,
    "seat_id": 5,
    "created_at": "2026-01-01T10:00:00.000Z"
  }
]
```

---

## 🎟️ Booking Logic

* Uses **database transactions**
* Locks seat using `FOR UPDATE`
* Prevents race conditions
* Ensures only one user can book a seat

---

## 🛡️ Validation

* Joi used for:

  * Register
  * Login
* Sanitizes input and removes unwanted fields

---

## 🧪 Testing

Use:

* Postman
* Thunder Client

### Test Flow:

1. Register
2. Login
3. Book seat
4. Refresh token
5. Logout

---

## 💡 Key Highlights

* Built on top of existing codebase (as per assignment rules)
* Did not break existing endpoints
* Added secure authentication layer
* Implemented production-level booking logic with transactions
* Clean and scalable architecture
* Implemented refresh token flow using HTTP-only cookies

---

## 🏁 Conclusion

This project demonstrates:

* Real-world backend extension skills
* Secure authentication handling
* Database consistency using transactions


