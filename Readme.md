# D-Table Analytics - Backend API

This is the backend API for **D-Table Analytics**, built with **Node.js**, **Express**, and **MongoDB (Mongoose)**. It handles authentication, geofenced attendance tracking with selfie verification, overtime requests, and report generation.

---

## 🚀 Setup

Follow these steps to run the backend server locally:

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18.x or higher recommended)
* [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas URI)

### 2. Install Dependencies
Navigate to the `backend` directory and run:
```bash
npm install
```

### 3. Environment Variables
Create a file named `.env` in the root of the `backend` folder and add the following configurations:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/dtableanalytics
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173

# Optional: Geofencing Configuration (latitude/longitude of the office & radius in meters)
GEOFENCING_LAT=12.9716
GEOFENCING_LON=77.5946
GEOFENCING_RADIUS=500
```

### 4. Running the Server
* **Development Mode** (auto-reloads on file changes):
  ```bash
  npm run dev
  ```
* **Production Mode**:
  ```bash
  npm start
  ```

Once started, the server will log `✅ Server running on port 3000` (or your configured port).

---

## 🏗️ Architecture

The backend follows a clean, modular **Service-Repository** pattern. This separates business logic from database interactions and keeps controller classes lean.

```
backend/
├── server.js               # Entry point of the application
└── src/
    ├── app.js              # Express app setup & middleware configuration
    ├── config/             # DB connection, Env loading, and file configs
    ├── routes/             # Express API routing definition
    ├── controllers/        # Request handling and standard API responses
    ├── validations/        # Request payload validation schemas using Zod
    ├── middlewares/        # Authentication, role authorization, and error handling
    ├── services/           # Core business logic processing
    ├── repository/         # DB query abstractions (separation from models)
    ├── models/             # Mongoose/MongoDB data schemas
    ├── uploads/            # Local storage folder for uploaded selfies
    └── utils/              # Helper utilities (token signs, math formulas, file handlers)
```

### Key Modules:
* **`controllers/`**: Receives requests, triggers validations, calls services, and uses custom response middlewares to send structured JSON.
* **`services/`**: Implements business rules (e.g., checking if already punched in, validating distance).
* **`repository/`**: Directly queries MongoDB database models.
* **`middlewares/`**:
  * `auth.middleware.js`: Custom authentication checks & Role-Based Access Control (RBAC).
  * `validate.middleware.js`: Generic Zod schema validation middleware.
  * `response.middleware.js`: Attaches `res.success` helper to standardise responses.
  * `error.middleware.js`: Catches errors globally and formats them.

---

## ✨ Features

1. **Authentication & User Management**:
   * JWT-based secure signup, login, and logout.
   * Role-based permissions supporting three roles: `employee`, `manager`, and `admin`.

2. **Geofenced Attendance with Face/Selfie Verification**:
   * **Punch In / Punch Out**: Records clock-in/out times.
   * **Geofencing**: Uses the Haversine formula to compute distance in meters between user's current GPS location and office coordinates. Blocks punch-in if too far away.
   * **Webcam Selfie Upload**: Processes and stores clock-in photos.

3. **Overtime (OT) Requests**:
   * Employees can request overtime hours for daily attendance logs.
   * Managers and Admins can view, review (approve/reject), and add remarks to requests.

4. **Reporting & Insights**:
   * Daily report API endpoint showing attendance, punch times, working hours, and OT statuses.
   * Scoped visibility: Employees see their own history, Managers see their direct team logs, and Admins see all logs.

---

## 📝 Assumptions

* **Database Connection**: MongoDB must be running before starting the server, otherwise the startup sequence will throw an error.
* **Geofencing**: If `GEOFENCING_LAT` and `GEOFENCING_LON` environment variables are omitted or blank, the GPS distance check is bypassed.
* **Image Storage**: Selfie pictures are sent from the client as Base64 strings. The backend decodes, converts, and saves them locally under the `src/uploads/attendance/` folder, returning a relative path.
* **One Attendance Log Per Day**: Employees are only allowed to punch in once per calendar date (in local server time format `YYYY-MM-DD`). A database compound index enforces this constraint.