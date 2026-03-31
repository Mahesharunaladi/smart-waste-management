# Truck Driver Login System - Visual Guide & Flow Diagram

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   TRUCK DRIVER LOGIN SYSTEM                             │
│                     Smart Waste Management                              │
└─────────────────────────────────────────────────────────────────────────┘

                            ┌──────────────────┐
                            │  DRIVER LOGIN    │
                            │ (driver-login)   │
                            └────────┬─────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
              Enter ID          Select Truck      Enter Password
           (D001-D004)         (T001-T004)        (driver123)
                    │                │                │
                    └────────────────┼────────────────┘
                                     │
                          ✅ Credentials Valid?
                          /                    \
                        YES                     NO
                        │                       │
                        │                  ❌ Error Message
                        │                       │
                        │                  Retry Login
                        │
                    ┌───▼──────────────┐
                    │  QR SCANNER      │
                    │ (driver-qr-scan) │
                    └───┬──────────────┘
                        │
                   📷 Open Camera
                        │
                   Point at QR Code
                        │
              QR Format: TRUCK_{ID}_VERIFIED
                        │
                ✅ Code matches truck?
                /                       \
              YES                        NO
              │                          │
              │                    ❌ Wrong QR
              │                     Try Again
              │
          Store: qrVerified=true
          
          ┌──▼──────────────────────┐
          │  FACE SCAN LOGIN        │
          │ (driver-face-scan Tab 1)│
          └──┬───────────────────────┘
             │
        📷 Open Camera (User Facing)
             │
        Detect Face (3 captures)
             │
    ┌─────────┬─────────┬─────────┐
    │         │         │         │
  Capture   Capture   Capture   Complete
     1        2         3
    │         │         │         │
    └─────────┴─────────┴─────────┘
             │
    Progress: ████████████ 100%
             │
   ✅ All 3 captures done
             │
    Store: faceVerified=true
    Store: shiftStart=timestamp
             │
         ┌───▼──────────────────┐
         │ DRIVER DASHBOARD     │
         │(driver-dashboard)    │
         └───┬──────────────────┘
             │
        Show:
        • Welcome Message
        • Shift Status (LIVE)
        • Shift Timer ⏱️
        • Statistics
        • Quick Actions
             │
    ◄─────────┤ Continue Working... ├─────────►
    │         │                     │         │
  Track    Record              End Shift    Logout
  Position  Collection
             │
             │
        ┌────▼──────────────────┐
        │ FACE SCAN LOGOUT      │
        │(driver-face-scan Tab 2)│
        └────┬──────────────────┘
             │
        Show Shift Duration
             │
        📷 Open Camera (User Facing)
             │
        Detect Face (3 captures)
             │
    ┌─────────┬─────────┬─────────┐
    │         │         │         │
  Capture   Capture   Capture   Complete
     1        2         3
    │         │         │         │
    └─────────┴─────────┴─────────┘
             │
    Progress: ████████████ 100%
             │
   ✅ All 3 captures done
             │
    Store: shiftEnd=timestamp
    Calculate: shiftDuration = end - start
             │
         Success Message
             │
    Clear Session Data
             │
    Redirect to Login
             │
        ┌────▼──────────────────┐
        │ BACK TO LOGIN         │
        │ (driver-login)        │
        └───────────────────────┘
```

---

## Page Wireframes

### Page 1: Driver Login
```
╔════════════════════════════════════════╗
║                                        ║
║   TRUCK DRIVER PORTAL                 ║
║   SmartWaste Management System        ║
║                                        ║
╠════════════════════════════════════════╣
║                                        ║
║  Driver ID ___________________        ║
║                                        ║
║  Truck ID ▼ T001 - Ramesh Kumar      ║
║           ▼ T002 - Ravi Singh        ║
║           ▼ T003 - Yallappa          ║
║           ▼ T004 - Pradeep Kumar    ║
║                                        ║
║  Password ___________________         ║
║                                        ║
║  ┌─ LOGIN ─────────────────────┐     ║
║  │ After login you'll scan QR   │     ║
║  └──────────────────────────────┘     ║
║                                        ║
║  Demo Credentials:                     ║
║  Driver ID: D001                       ║
║  Password: driver123                   ║
║                                        ║
╚════════════════════════════════════════╝
```

### Page 2: QR Code Scanner
```
╔════════════════════════════════════════╗
║                                        ║
║   QR CODE SCANNER                     ║
║   Scan the QR code on your truck      ║
║                                        ║
╠════════════════════════════════════════╣
║                                        ║
║  Point your camera at the QR code     ║
║  ┌──────────────────────────────────┐ ║
║  │                                  │ ║
║  │     ╔═══════════════════╗        │ ║
║  │     ║ ┌─ QR FRAME ─┐  ║        │ ║
║  │     ║ │ ┌────────┐ │  ║        │ ║
║  │  📷 ║ │ │ ▯ ▯ ▯  │ │  ║ 📷    │ ║
║  │     ║ │ └────────┘ │  ║        │ ║
║  │     ║ └─ scanning ─┘  ║        │ ║
║  │     ╚═══════════════════╝        │ ║
║  │                                  │ ║
║  │    ✓ Face Detected               │ ║
║  └──────────────────────────────────┘ ║
║                                        ║
║  QR Data: TRUCK_T001_VERIFIED ✓      ║
║                                        ║
║  ┌──────────────────────────────────┐ ║
║  │ Continue to Face Scan │ Logout   │ ║
║  └──────────────────────────────────┘ ║
║                                        ║
╚════════════════════════════════════════╝
```

### Page 3: Face Recognition (Login)
```
╔════════════════════════════════════════╗
║                                        ║
║   FACE RECOGNITION                    ║
║   SmartWaste Driver Authentication    ║
║                                        ║
╠════════════════════════════════════════╣
║  [LOGIN SCAN] [LOGOUT SCAN]            ║
╠════════════════════════════════════════╣
║                                        ║
║  Position your face for login         ║
║  ┌──────────────────────────────────┐ ║
║  │                                  │ ║
║  │         📷 Camera Feed          │ ║
║  │        ┌──────────────┐          │ ║
║  │        │ Face Detected│ 😊       │ ║
║  │        └──────────────┘          │ ║
║  │                                  │ ║
║  └──────────────────────────────────┘ ║
║                                        ║
║  Face Detected!                        ║
║  Hold steady for capture 1/3           ║
║  Progress: ████░░░░░░ 33%             ║
║                                        ║
║  Capture Progress:                     ║
║  ✓ Capture 1 (12:45:30)                ║
║  ✓ Capture 2 (12:45:35)                ║
║  ✓ Capture 3 (12:45:40)                ║
║                                        ║
║  ✓ Face Verification Complete!        ║
║                                        ║
║  ┌──────────────────────────────────┐ ║
║  │ Complete Shift Start  │ Cancel   │ ║
║  └──────────────────────────────────┘ ║
║                                        ║
║  Tip: Maintain good lighting for best  ║
║  results.                              ║
║                                        ║
╚════════════════════════════════════════╝
```

### Page 4: Driver Dashboard
```
╔════════════════════════════════════════╗
║  TRUCK DRIVER PORTAL          12:46:15 ║ (Shift Timer)
║  [Shift: 00:01:30] [END SHIFT]         ║
╠════════════════════════════════════════╣
║                                        ║
║  Welcome, Ramesh Kumar!                ║
║  Truck ID: T001                        ║
║                                   LIVE ║
║  ⚪ Shift Active                       ║
║                                        ║
║  ┌──────────────┬──────────────┐      ║
║  │ Collections  │ Waste        │      ║
║  │ Today        │ Collected    │      ║
║  │ 12           │ 245          │      ║
║  │ households   │ kg           │      ║
║  └──────────────┴──────────────┘      ║
║                                        ║
║  ┌──────────────┐                      ║
║  │ Truck        │                      ║
║  │ Capacity     │                      ║
║  │ 45%          │                      ║
║  │ ███░░░░░░░░ │                      ║
║  └──────────────┘                      ║
║                                        ║
║  Today's Activities                    ║
║  ✓ Shift Started at 12:45              ║
║                                        ║
║  ┌─ Track Position ─ Record Collection ─┐
║  │ Take Photo │ View Analytics           │
║  └────────────────────────────────────┘  ║
║                                        ║
║  Remember: Your shift started at 12:45  ║
║  Scan your face before logging out!    ║
║                                        ║
╚════════════════════════════════════════╝
```

---

## Data Flow Diagram

```
┌─────────────────┐
│  FRONTEND       │
│                 │
│ • Login Page    │  User Input:
│ • QR Scanner    │  • Credentials
│ • Face Scan     │  • QR Code
│ • Dashboard     │  • Face Data
│                 │
└────────┬────────┘
         │
         │ HTTP Requests (JSON)
         │ /api/auth/driver-login
         │ /api/auth/qr-verification
         │ /api/auth/face-recognition-login
         │ /api/auth/face-recognition-logout
         │
┌────────▼────────────────────────────┐
│  BACKEND (Express.js)               │
│                                     │
│  Routes: /backend/routes/           │
│  • driver-auth.js                   │
│                                     │
│  Validations:                       │
│  • Password check                   │
│  • Truck assignment                 │
│  • QR format                        │
│  • JWT generation                   │
│                                     │
└────────┬────────────────────────────┘
         │
         │ Token & Session Data
         │
    ┌────▼────────────┐
    │  FRONTEND       │
    │  localStorage   │
    │                 │
    │ • driverId      │
    │ • truckId       │
    │ • token         │
    │ • shiftStart    │
    │ • qrVerified    │
    │ • faceVerified  │
    │                 │
    └─────────────────┘
```

---

## State Management

```
LOGIN PAGE
├── Initial State
│   └── No session data
│
├── User Action: Submit Login
│   ├── Validate input
│   ├── API call
│   ├── Store session
│   └── Navigate to QR

QR SCANNER
├── Session Data
│   ├── driverId ✓
│   ├── truckId ✓
│   └── token ✓
│
├── User Action: Scan QR
│   ├── Verify format
│   ├── Check truck match
│   ├── Store qrVerified=true
│   └── Navigate to Face Scan

FACE SCAN (LOGIN)
├── Session Data
│   ├── driverId ✓
│   ├── truckId ✓
│   ├── token ✓
│   └── qrVerified=true ✓
│
├── User Action: Complete 3 captures
│   ├── Store faceVerified=true
│   ├── Store shiftStart=timestamp
│   └── Navigate to Dashboard

DASHBOARD
├── Session Data: COMPLETE
│   ├── driverId ✓
│   ├── truckId ✓
│   ├── token ✓
│   ├── qrVerified=true ✓
│   ├── faceVerified=true ✓
│   ├── shiftStart=timestamp ✓
│   └── shiftEnd=null
│
├── Display Mode: ACTIVE SHIFT
│   └── Enable End Shift button

FACE SCAN (LOGOUT)
├── Session Data: COMPLETE
│   └── (same as above)
│
├── User Action: Complete 3 captures
│   ├── Set shiftEnd=timestamp
│   ├── Calculate shiftDuration
│   └── Clear session

BACK TO LOGIN
└── Session Data: CLEARED
    └── Start new cycle
```

---

## API Response Flow

```
STEP 1: LOGIN
Client                           Server
  │                                │
  ├─ POST /api/auth/driver-login   │
  │   {driverId, truckId, pwd}   ──>│
  │                                 │
  │                          Validate
  │                          Generate JWT
  │                                 │
  │<─ 200 OK                        │
  │   {success: true, token}        │
  │                                 │
  Store in localStorage

STEP 2: QR VERIFICATION
  │                                 │
  ├─ POST /api/auth/qr-verification│
  │   {qrData, truckId}           ──>│
  │                                 │
  │                          Validate format
  │                          Check truck
  │                                 │
  │<─ 200 OK                        │
  │   {success: true, verified}     │
  │                                 │
  Update session: qrVerified=true

STEP 3: FACE LOGIN
  │                                 │
  ├─ POST /api/auth/face-rec-login │
  │   {driverId, truckId, faces}  ──>│
  │                                 │
  │                          Create activity
  │                          record
  │                                 │
  │<─ 200 OK                        │
  │   {success: true, record}       │
  │                                 │
  Update session: faceVerified=true
  Store: shiftStart=now

DASHBOARD
  (Update every 5 seconds)
  ├─ GET /api/trucks/{truckId}     │
  │   (Fetch stats)               ──>│
  │                                 │
  │<─ 200 OK                        │
  │   {truck stats}                 │
  │                                 │
  Update dashboard

STEP 4: FACE LOGOUT
  │                                 │
  ├─ POST /api/auth/face-rec-logout│
  │   {driverId, truckId, faces}  ──>│
  │                                 │
  │                          Create activity
  │                          record
  │                                 │
  │<─ 200 OK                        │
  │   {success: true, record}       │
  │                                 │
  Clear session
  Redirect to login
```

---

## Security Flow

```
INPUT VALIDATION
├── Frontend
│   ├── Check fields not empty
│   ├── Check password length
│   ├── Validate format
│   └── Sanitize input
│
└── Backend
    ├── Validate again
    ├── Check database
    ├── Hash comparison
    └── Log attempts

AUTHENTICATION
├── Check driver exists
├── Check truck assigned
├── Verify password
├── Generate JWT
└── Issue token with 8h expiry

AUTHORIZATION
├── Check QR format
├── Verify truck ID
├── Validate QR matches driver assignment
└── Allow/Deny access

SESSION MANAGEMENT
├── Store in localStorage (frontend)
├── Validate token (backend)
├── Clear on logout
└── Auto-expire after 8h

DATA PROTECTION
├── HTTPS recommended
├── JWT for API calls
├── CORS policy enforced
└── Passwords never logged
```

---

**Visual Guide Version:** 1.0.0
**Last Updated:** 31 March 2026
