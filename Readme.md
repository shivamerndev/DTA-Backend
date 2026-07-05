# D-Table Analytics Backend

This is the backend server for the D-Table Analytics application, built using **Node.js**, **Express**, and **MongoDB** (Mongoose). It manages employee authentication, daily attendance tracking (with photo uploading and geofencing verification), overtime requests, and reporting.

---

## 🛠️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a remote MongoDB Atlas URI)

### Installation & Run
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the root of the `backend` folder and populate it:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/dtableanalytics
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   
   # Optional Geofencing configuration (in meters)
   GEOFENCING_LAT=12.9716
   GEOFENCING_LON=77.5946
   GEOFENCING_RADIUS=500
   ```

3. **Start the application**:
   - **Development mode** (with auto-reload):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```

---

## 📐 Architecture Overview (Repository Pattern + Class Based)

The backend follows a **layered, class-based architecture** combined with the **Repository Pattern** to separate concerns:

- **Routes (`src/routes/`)**: Declares endpoint URIs, maps them to controller methods, and applies security, authentication, and validation middlewares.
- **Controllers (`src/controllers/`)**: Written as ES classes, handlers process HTTP requests, handle cookies, and return responses.
- **Services (`src/services/`)**: Classes encapsulating the core business logic (e.g., calculating working hours, validating distance rules, validating request payload logic).
- **Repositories (`src/repository/`)**: Data access layer classes that abstract Mongoose/MongoDB queries. This decouples business logic from direct database operations.
- **Models (`src/models/`)**: Mongoose schemas defining database collections (`User`, `Attendance`, `OTRequest`).
- **Middlewares (`src/middlewares/`)**: Contains logic for JWT authentication, role authorization, schema validation (Zod/Express-validator), custom response formatting, and global error handling.

---

## ✨ Features Implemented

1. **Authentication & Authorization**:
   - Secure sign-up and login with password hashing via `bcrypt`.
   - Token-based sessions using JWTs stored in HTTP-Only cookies.
   - Role-based Access Control (RBAC) with roles: `employee`, `manager`, and `admin`.

2. **Attendance Tracking**:
   - **Punch-In**: Records user attendance with location coordinates and uploads a webcam selfie (saved locally).
   - **Geofencing**: Verifies proximity to the office coordinates using the Haversine formula (optional).
   - **Punch-Out**: Records end time and automatically calculates total working hours.
   - **Verification**: Allows managers and admins to review, approve, or reject attendance records with remarks.

3. **Overtime (OT) Request Workflow**:
   - Employees can request overtime hours for their completed daily logs.
   - Managers/admins can approve or reject these requests, automatically updating attendance overtime records.

4. **Analytics & Reporting**:
   - Daily logs and reports summarizing working hours, overtime hours, selfies, and verification status.
   - Filters logs based on roles:
     - Employees only view their own logs.
     - Managers view their direct team logs.
     - Admins view all logs.

---

## 💡 Assumptions Made

- **One Log Per Day**: Employees are assumed to punch in and punch out exactly once per calendar date.
- **Selfies Location**: Webcam selfie images are uploaded as Base64 strings from the frontend, decoded, and saved in `src/uploads/attendance/` folder on the local server. They are exposed statically via `/uploads`.
- **Geofencing Setup**: Geofencing is optional. If environment variables `GEOFENCING_LAT` and `GEOFENCING_LON` are not provided, geofence checks are bypassed.
- **Manager-Employee Hierarchy**: Employees are assigned a manager ID during signup or setup, allowing managers to view and approve/review logs for their team.
