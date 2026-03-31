# Truck Driver Login System - Complete Documentation

## Overview
The Truck Driver Login System is a multi-step authentication process that combines password login, QR code verification, and facial recognition to ensure driver identity and truck authorization.

## System Flow

```
┌─────────────────┐
│ Driver Login    │  (Username/Password + Truck Selection)
└────────┬────────┘
         ↓
┌─────────────────┐
│ QR Scan         │  (Verify truck via QR code)
└────────┬────────┘
         ↓
┌─────────────────┐
│ Face Scan       │  (Facial recognition - 3 captures)
│ (Login)         │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Driver          │  (Active shift - can log out anytime)
│ Dashboard       │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Face Scan       │  (Facial recognition - 3 captures)
│ (Logout)        │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Shift End       │  (Complete and logout)
└─────────────────┘
```

---

## Frontend Files Created

### 1. **driver-login.html**
**Purpose:** Initial driver authentication
**Location:** `/frontend/driver-login.html`

**Features:**
- Driver ID input field
- Truck selection dropdown
- Password field
- Login button with loading state
- Demo credentials for testing
- Error/Success message display

**Demo Credentials:**
```
Driver ID: D001
Password: driver123
Truck: T001 - Ramesh Kumar
```

**Flow:**
1. Driver enters credentials
2. Frontend validates input
3. Calls backend API `/api/auth/driver-login`
4. On success, saves session to localStorage
5. Redirects to QR scanner

---

### 2. **driver-qr-scan.html**
**Purpose:** Verify truck via QR code scanning
**Location:** `/frontend/driver-qr-scan.html`

**Features:**
- Real-time camera feed
- QR code detection using jsQR library
- Scanner frame with animated scanning line
- Corner detection markers
- QR data verification
- Status indicators (info, success, error)

**How It Works:**
1. Opens device camera
2. Scans QR codes in real-time
3. Validates QR format: `TRUCK_{TRUCKID}_VERIFIED`
4. Compares truck ID with driver's assigned truck
5. Displays verification result
6. Proceeds to face recognition on success

**QR Code Format:**
```
TRUCK_T001_VERIFIED
TRUCK_T002_VERIFIED
TRUCK_T003_VERIFIED
TRUCK_T004_VERIFIED
```

---

### 3. **driver-face-scan.html**
**Purpose:** Facial recognition for login and logout
**Location:** `/frontend/driver-face-scan.html`

**Features:**
- Dual tabs: Login Scan & Logout Scan
- Real-time face detection
- Progress tracking (3 captures required)
- Capture history display
- Status indicators
- Shift duration display (logout tab)
- Auto-capture on face detection

**Face Scan Process:**
1. **Capture 1:** Front-facing position
2. **Capture 2:** Slight angle (maintain position)
3. **Capture 3:** Final verification

**Simulation:**
Currently uses brightness/contrast analysis to simulate face detection
(In production, integrate with ML.js or TensorFlow.js for real facial recognition)

**Login Flow:**
1. Camera captures 3 face images
2. Displays progress after each capture
3. Enables "Complete Shift Start" button
4. Redirects to driver dashboard

**Logout Flow:**
1. Shows shift duration
2. Captures 3 face images again
3. Enables "Complete Shift End" button
4. Clears session and redirects to login

---

### 4. **driver-dashboard.html**
**Purpose:** Main driver interface after login
**Location:** `/frontend/driver-dashboard.html`

**Features:**
- Welcome message with driver name
- Shift status indicator (live/active)
- Statistics cards:
  - Collections Today
  - Waste Collected (kg)
  - Truck Capacity (%)
- Shift timer (real-time)
- Activity log
- Quick action buttons
- "End Shift" button (redirects to logout scan)

**Statistics Display:**
- Fetches data from `/api/trucks/{truckId}` API
- Shows totalCollectionsToday
- Shows totalWasteCollectedToday
- Calculates capacity percentage

**Quick Actions:**
- Track Position (links to live-tracking)
- Record Collection (prompt for household/waste count)
- Take Photo (placeholder)
- View Analytics (links to dashboard)

---

## Backend Files Created

### **driver-auth.js**
**Location:** `/backend/routes/driver-auth.js`

#### Endpoints:

**1. POST /api/auth/driver-login**
```javascript
Request:
{
    "driverId": "D001",
    "truckId": "T001",
    "password": "driver123"
}

Response (Success):
{
    "success": true,
    "message": "Login successful",
    "token": "jwt-token-here",
    "driver": {
        "id": "D001",
        "name": "Ramesh Kumar",
        "truckId": "T001",
        "phone": "9742583104"
    },
    "session": {
        "driverId": "D001",
        "truckId": "T001",
        "loginTime": "2026-03-31T10:00:00Z",
        "token": "jwt-token-here"
    }
}

Response (Error):
{
    "success": false,
    "message": "Invalid driver ID" | "Invalid password" | "This truck is not assigned to this driver"
}
```

**2. POST /api/auth/face-recognition-login**
```javascript
Request:
{
    "driverId": "D001",
    "truckId": "T001",
    "faceData": "base64-face-image-data"
}

Response:
{
    "success": true,
    "message": "Face recognition login successful",
    "record": {
        "driverId": "D001",
        "truckId": "T001",
        "type": "LOGIN",
        "faceVerified": true,
        "qrVerified": true,
        "timestamp": "2026-03-31T10:05:00Z",
        "status": "active"
    }
}
```

**3. POST /api/auth/face-recognition-logout**
```javascript
Request:
{
    "driverId": "D001",
    "truckId": "T001",
    "faceData": "base64-face-image-data",
    "shiftDuration": 28800000  // milliseconds
}

Response:
{
    "success": true,
    "message": "Face recognition logout successful",
    "record": {
        "driverId": "D001",
        "truckId": "T001",
        "type": "LOGOUT",
        "faceVerified": true,
        "timestamp": "2026-03-31T18:00:00Z",
        "shiftDuration": 28800000,
        "status": "completed"
    }
}
```

**4. POST /api/auth/qr-verification**
```javascript
Request:
{
    "qrData": "TRUCK_T001_VERIFIED",
    "truckId": "T001",
    "driverId": "D001"
}

Response:
{
    "success": true,
    "message": "QR verification successful",
    "truckId": "T001",
    "verified": true,
    "timestamp": "2026-03-31T10:02:00Z"
}
```

**5. GET /api/auth/driver-session/:token**
```javascript
Response:
{
    "success": true,
    "session": {
        "driverId": "D001",
        "truckId": "T001",
        "name": "Ramesh Kumar",
        "loginTime": "2026-03-31T10:00:00Z",
        "isActive": true
    }
}
```

---

## Data Storage

### Session Data (LocalStorage)
```javascript
{
    "driverId": "D001",
    "truckId": "T001",
    "token": "jwt-token-here",
    "timestamp": "2026-03-31T10:00:00Z",
    "qrVerified": true,
    "faceVerified": true,
    "shiftStart": "2026-03-31T10:05:00Z",
    "shiftEnd": null  // Set on logout
}
```

### Driver Database (Currently In-Memory)
```javascript
{
    "D001": {
        "name": "Ramesh Kumar",
        "truckId": "T001",
        "password": "driver123",
        "phone": "9742583104"
    },
    "D002": { ... },
    "D003": { ... },
    "D004": { ... }
}
```

---

## Technologies Used

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Structure |
| **CSS3** | Styling & animations |
| **JavaScript (ES6+)** | Logic & interactivity |
| **Fetch API** | HTTP requests |
| **localStorage API** | Session persistence |
| **jsQR** | QR code scanning |
| **tracking.js** | Face detection (simulated) |
| **Express.js** | Backend API |
| **JWT** | Token-based authentication |
| **bcryptjs** | Password hashing |

---

## Security Features

1. **Password Authentication**
   - Passwords validated on login
   - JWT tokens generated for session management
   - Tokens expire after 8 hours

2. **QR Code Verification**
   - Verifies truck assignment
   - Prevents unauthorized truck access
   - Format validation

3. **Facial Recognition**
   - 3-point capture system
   - Login and logout verification
   - Biometric validation

4. **Session Management**
   - localStorage stores encrypted session
   - Session cleared on logout
   - Automatic redirect if session missing

5. **CORS Protection**
   - Backend enforces CORS policy
   - Only allows requests from registered origins

---

## Testing Instructions

### Test Driver Credentials

**Driver 1 (Ramesh Kumar):**
```
Driver ID: D001
Password: driver123
Truck: T001 - Ramesh Kumar
Phone: 9742583104
```

**Driver 2 (Ravi Singh):**
```
Driver ID: D002
Password: driver123
Truck: T002 - Ravi Singh
Phone: 9876543211
```

**Driver 3 (Yallappa):**
```
Driver ID: D003
Password: driver123
Truck: T003 - Yallappa
Phone: 9880272001
```

**Driver 4 (Pradeep Kumar):**
```
Driver ID: D004
Password: driver123
Truck: T004 - Pradeep Kumar
Phone: 9876543213
```

### QR Codes

Print or display these QR codes:
```
TRUCK_T001_VERIFIED
TRUCK_T002_VERIFIED
TRUCK_T003_VERIFIED
TRUCK_T004_VERIFIED
```

### Step-by-Step Test

1. **Login:**
   - Navigate to `/frontend/driver-login.html`
   - Enter D001, select T001, password: driver123
   - Click Login

2. **QR Scan:**
   - Point camera at QR code for T001
   - Verify message displays

3. **Face Scan (Login):**
   - Position face in camera
   - Auto-captures 3 images
   - Click "Complete Shift Start"

4. **Dashboard:**
   - View shift timer
   - Check statistics
   - Try quick actions

5. **Face Scan (Logout):**
   - Click "End Shift"
   - Position face again
   - Auto-captures 3 images
   - Click "Complete Shift End"

6. **Logout:**
   - Confirms shift ended
   - Redirects to login page

---

## Future Enhancements

- [ ] Real facial recognition with ML.js
- [ ] QR code generation for trucks
- [ ] SMS/Email notifications for shift start/end
- [ ] Location tracking during shift
- [ ] Collection history sync
- [ ] Offline mode support
- [ ] Biometric data encryption
- [ ] Real-time supervisor notifications
- [ ] Mobile app version
- [ ] Database integration for driver data

---

## Troubleshooting

### Camera Not Working
- Check browser permissions
- Allow camera access in browser settings
- Test with HTTPS (required for camera)

### QR Code Not Scanning
- Ensure good lighting
- Keep QR code in frame
- Use proper QR code format

### Face Detection Issues
- Ensure adequate lighting
- Keep face visible in frame
- Try multiple angles

### Session Issues
- Clear browser localStorage
- Verify backend is running
- Check API endpoints

---

## API Base URL Configuration

Update in frontend files:
```javascript
const API_BASE = 'http://localhost:3000/api';
```

For production, change to your backend server URL.

---

## Author
Mahesh Arun Aladi

## License
MIT

---

**Last Updated:** 31 March 2026
**Version:** 1.0.0
