# Driver Attendance System - Visual Guide & Screenshots Description

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DRIVER ATTENDANCE SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER (Browser)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Driver Login Page (driver-login.html)           │   │
│  │  • Driver ID input                                         │   │
│  │  • Truck selection                                         │   │
│  │  • Password entry                                          │   │
│  │  • Demo credentials display                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                        ↓ (Redirect)                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │      Driver Attendance Page (driver-attendance.html)      │   │
│  │  ┌────────────────────┬──────────────────────────────┐   │   │
│  │  │  Camera Section    │   Driver Details Panel       │   │   │
│  │  │                    │                              │   │   │
│  │  │  • Live Video      │   • Name                     │   │   │
│  │  │  • Face Indicator  │   • Phone                    │   │   │
│  │  │  • Status Display  │   • Aadhar Number           │   │   │
│  │  │  • Progress Bar    │   • Gender                   │   │   │
│  │  │                    │   • Caste                    │   │   │
│  │  │                    │   • Truck ID                 │   │   │
│  │  ├────────────────────┤                              │   │   │
│  │  │ Login │ Logout     │   ┌─────────────────────┐    │   │   │
│  │  │ (Tabs)             │   │ Real-time Clock     │    │   │   │
│  │  │                    │   │ HH:MM:SS            │    │   │   │
│  │  │ 🟢 Login Button    │   │ Date with day name  │    │   │   │
│  │  │                    │   └─────────────────────┘    │   │   │
│  │  │ 🔴 Logout Button   │                              │   │   │
│  │  │                    │   ✓ Login Record (Green)     │   │   │
│  │  │                    │   ✓ Logout Record (Red)      │   │   │
│  │  └────────────────────┴──────────────────────────────┘   │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │        Statistics Dashboard                          │ │   │
│  │  │  • Today's Logins: [ 1 ]                            │ │   │
│  │  │  • Today's Logouts: [ 1 ]                           │ │   │
│  │  │  • Work Hours: [ 8.5h ]                             │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │                                                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│                 API Calls ↔ Backend Services                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER (Node.js/Express)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Routes (driver-auth.js)                        │   │
│  │                                                             │   │
│  │  POST /api/auth/driver-login                              │   │
│  │  └─ Authenticate driver → Return profile                 │   │
│  │                                                             │   │
│  │  POST /api/auth/attendance/login                          │   │
│  │  └─ Record login timestamp                               │   │
│  │                                                             │   │
│  │  POST /api/auth/attendance/logout                         │   │
│  │  └─ Record logout + calculate duration                   │   │
│  │                                                             │   │
│  │  GET /api/auth/attendance/:driverId/:date                 │   │
│  │  └─ Retrieve daily attendance                            │   │
│  │                                                             │   │
│  │  GET /api/auth/attendance/monthly/:driverId/:month/:year  │   │
│  │  └─ Retrieve monthly statistics                          │   │
│  │                                                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                        ↓                                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Models (Mongoose Schemas)                      │   │
│  │                                                             │   │
│  │  • Attendance Model (New)                                 │   │
│  │    - driverId, truckId, driverName                       │   │
│  │    - type (LOGIN/LOGOUT)                                 │   │
│  │    - timestamp, date, time                               │   │
│  │    - faceVerified, location, duration                    │   │
│  │                                                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                        ↓                                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (MongoDB)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Collections                                      │   │
│  │                                                             │   │
│  │  Attendance Collection                                     │   │
│  │  ├─ Document: { driverId, type: "LOGIN", time, ... }     │   │
│  │  ├─ Document: { driverId, type: "LOGOUT", duration, ...} │   │
│  │  ├─ Index: driverId + date                               │   │
│  │  └─ Index: driverId + timestamp (desc)                   │   │
│  │                                                             │   │
│  │  Indexes:                                                  │   │
│  │  • { driverId: 1, date: 1 } - Fast date queries          │   │
│  │  • { driverId: 1, timestamp: -1 } - Latest records       │   │
│  │                                                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Attendance Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎥 Driver Attendance System                    [← Back Button]   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────┬──────────────────────┐
│                                          │                      │
│     CAMERA SECTION                       │  DRIVER PANEL        │
│     Face Recognition Camera              │                      │
│                                          │  👤 Driver Details   │
│  ┌────────────────────────────────────┐  │                      │
│  │                                    │  │  Name:               │
│  │                                    │  │  Ramesh Kumar        │
│  │    🎥 LIVE VIDEO FEED              │  │                      │
│  │                                    │  │  Phone:              │
│  │  ✓ Face Detected                   │  │  9742583104          │
│  │  Status: Face Detected - Ready     │  │                      │
│  │                                    │  │  Aadhar:             │
│  │                                    │  │  1234-5678-9101-1121 │
│  └────────────────────────────────────┘  │                      │
│                                          │  Gender:             │
│  STATUS SECTION                          │  Male                │
│  🟢 Detecting Face                       │                      │
│  Detecting Face...                       │  Caste:              │
│                                          │  OBC                 │
│  PROGRESS: ▰▰▰░░░░░░░░░░░░░░░░░░░░░ 0%│                      │
│                                          │  Truck ID:           │
│                                          │  T001                │
├──────────────────────────────────────────┤                      │
│                                          │  ┌──────────────────┐│
│                                          │  │ 🕐 Time Display  ││
│                                          │  │                  ││
│                                          │  │ 09:30:45         ││
│                                          │  │ Saturday,        ││
│                                          │  │ April 20, 2026   ││
│                                          │  └──────────────────┘│
│                                          │                      │
│                                          │ [Login] [Logout]    │
│                                          │ (tabs)              │
│                                          │                      │
│                                          │ ┌──────────────────┐│
│                                          │ │ 🟢 GREEN LOGIN  ││
│                                          │ │ BUTTON           ││
│                                          │ └──────────────────┘│
│                                          │                      │
│                                          │ ✓ Logged In At      │
│                                          │ 09:30:45            │
│                                          │ 04/20/2026          │
│                                          │                      │
└──────────────────────────────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   STATISTICS DASHBOARD                           │
│  ┌─────────────────┬──────────────────┬──────────────────┐      │
│  │ 📊 Today's      │ 📊 Today's       │ ⏱️ Work Hours   │      │
│  │ Logins          │ Logouts          │ Today            │      │
│  │                 │                  │                  │      │
│  │ 🔢 1            │ 🔢 0             │ ⏱️ 0h            │      │
│  └─────────────────┴──────────────────┴──────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Color Scheme Reference

```
┌─────────────────────────────────────────────────┐
│          ATTENDANCE SYSTEM COLORS               │
├─────────────────────────────────────────────────┤
│                                                 │
│  LOGIN BUTTON (Active)                          │
│  ┌────────────────────────────┐                │
│  │ 🟢 LOGIN  #22c55e (Green)   │                │
│  │ Background: #22c55e         │                │
│  │ Hover: #16a34a              │                │
│  └────────────────────────────┘                │
│                                                 │
│  LOGOUT BUTTON (Inactive)                       │
│  ┌────────────────────────────┐                │
│  │ 🔴 LOGOUT #ef4444 (Red)     │                │
│  │ Background: #ef4444         │                │
│  │ Hover: #dc2626              │                │
│  └────────────────────────────┘                │
│                                                 │
│  LOGIN RECORD DISPLAY                           │
│  ┌────────────────────────────┐                │
│  │ ✓ Logged In At              │                │
│  │ 09:30:45                    │ Light Green    │
│  │ 04/20/2026                  │ #f0fdf4        │
│  │ Border: #22c55e             │                │
│  └────────────────────────────┘                │
│                                                 │
│  LOGOUT RECORD DISPLAY                          │
│  ┌────────────────────────────┐                │
│  │ ✓ Logged Out At             │                │
│  │ 17:45:30                    │ Light Red      │
│  │ 04/20/2026                  │ #fef2f2        │
│  │ Duration: 8h 15m            │ Border: #ef4444│
│  └────────────────────────────┘                │
│                                                 │
│  PRIMARY COLORS                                 │
│  • Primary: #667eea (Purple/Blue)               │
│  • Secondary: #764ba2 (Dark Purple)             │
│  • Background: #f9fafb (Light Gray)             │
│  • Text: #333 (Dark)                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## User Workflow - Visual Steps

```
STEP 1: DRIVER LOGIN PAGE
┌─────────────────────────────────┐
│ Truck Driver Portal             │
│ SmartWaste Management System    │
│                                 │
│ Driver ID: [_____________]      │
│ Truck ID: [Select your truck▼]  │
│ Password: [_____________]       │
│                                 │
│ [LOGIN] ▶ Authentication        │
└─────────────────────────────────┘


STEP 2: REDIRECT TO ATTENDANCE PAGE
    ↓ (Session saved to sessionStorage)
    ↓ (Driver data included)


STEP 3: ATTENDANCE PAGE - INITIAL STATE
┌───────────────────────────────────────┐
│ 🎥 Driver Attendance System           │
├─────────────────────────┬─────────────┤
│ [Camera Feed]           │ Driver Info │
│ 🎥 Allow Camera Access  │ • Loaded    │
│                         │             │
│ Status: Detecting...    │ Truck: T001 │
│                         │ Phone: 9742 │
│                         │ Aadhar: ... │
│                         │ Gender: ... │
│                         │ Caste: ...  │
│                         │             │
│                         │ Time: 09:20 │
│                         │             │
│                         │ [LOGIN tab] │
│                         │ [Logout]    │
│                         │             │
│                         │ 🟢 [LOGIN]  │
│                         │ (Disabled)  │
│                         │             │
│                         │ Stats: 0    │
├─────────────────────────┴─────────────┤
│ [Waiting for face detection...]       │
└───────────────────────────────────────┘


STEP 4: FACE DETECTED
┌───────────────────────────────────────┐
│ 🎥 Driver Attendance System           │
├─────────────────────────┬─────────────┤
│ [Camera Feed]           │             │
│ ✓ Face Detected         │ 🟢 [LOGIN]  │
│ Status: Ready           │ (ENABLED)   │
│                         │             │
│ Progress: ▰▰░░░░░░░░   │ Click to    │
│           (0/3)         │ start       │
└───────────────────────────────────────┘


STEP 5: LOGIN BUTTON CLICKED
┌───────────────────────────────────────┐
│ 🎥 Driver Attendance System           │
├─────────────────────────┬─────────────┤
│ [Camera Feed]           │             │
│ 🎥 Capturing...         │ 🟢 [LOGIN]  │
│ Status: In Progress     │ (Disabled)  │
│                         │             │
│ Progress: ▰▰▰░░░░░░░░  │             │
│           (1/3)         │             │
│                         │             │
│ Progress: ▰▰▰▰▰▰░░░░  │             │
│           (2/3)         │             │
│                         │             │
│ Progress: ▰▰▰▰▰▰▰▰▰░░ │             │
│           (3/3)         │             │
└───────────────────────────────────────┘


STEP 6: LOGIN RECORDED
┌───────────────────────────────────────┐
│ ✓ Login recorded successfully!       │
├─────────────────────────┬─────────────┤
│ [Camera Feed]           │ ✓ LOGGED IN  │
│ Status: Ready           │ at 09:30:45  │
│                         │ 04/20/2026   │
│                         │              │
│                         │ [LOGIN]      │
│                         │ [Logout]     │
│                         │              │
│                         │ 🔴 [LOGOUT]  │
│                         │ (ENABLED)    │
│                         │              │
│                         │ Stats:       │
│                         │ Logins: 1    │
│                         │ Logouts: 0   │
│                         │ Hours: 0h    │
├─────────────────────────┴─────────────┤
│ [Auto-switched to Logout tab]         │
└───────────────────────────────────────┘


STEP 7: LOGOUT BUTTON CLICKED
┌───────────────────────────────────────┐
│ 🎥 Driver Attendance System           │
├─────────────────────────┬─────────────┤
│ [Camera Feed]           │             │
│ 🎥 Capturing...         │ 🔴 [LOGOUT] │
│ Status: In Progress     │ (Disabled)  │
│                         │             │
│ Progress: ▰▰▰▰▰▰▰▰▰▰░░ │             │
│           (3/3)         │             │
└───────────────────────────────────────┘


STEP 8: LOGOUT RECORDED
┌───────────────────────────────────────┐
│ ✓ Logout recorded! Work: 8h 15m      │
├─────────────────────────┬─────────────┤
│ [Camera Feed]           │ ✓ LOGGED IN  │
│ Status: Ready           │ at 09:30:45  │
│                         │ 04/20/2026   │
│                         │              │
│                         │ ✓ LOGGED OUT │
│                         │ at 17:45:30  │
│                         │ 04/20/2026   │
│                         │              │
│                         │ [LOGIN]      │
│                         │ [Logout]     │
│                         │              │
│                         │ Stats:       │
│                         │ Logins: 1    │
│                         │ Logouts: 1   │
│                         │ Hours: 8.2h  │
└───────────────────────────────────────┘
```

---

## Database Record Structure

```
LOGIN RECORD (MongoDB Document)
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "driverId": "D001",
  "truckId": "T001",
  "driverName": "Ramesh Kumar",
  "type": "LOGIN",
  "timestamp": ISODate("2026-04-20T09:30:45.000Z"),
  "date": "04/20/2026",
  "time": "09:30:45",
  "faceVerified": true,
  "ipAddress": "192.168.1.100",
  "location": {
    "type": "Point",
    "coordinates": [76.6394, 12.2958]
  },
  "createdAt": ISODate("2026-04-20T09:30:45.000Z"),
  "updatedAt": ISODate("2026-04-20T09:30:45.000Z")
}

LOGOUT RECORD (MongoDB Document)
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "driverId": "D001",
  "truckId": "T001",
  "driverName": "Ramesh Kumar",
  "type": "LOGOUT",
  "timestamp": ISODate("2026-04-20T17:45:30.000Z"),
  "date": "04/20/2026",
  "time": "17:45:30",
  "duration": "8h 15m",
  "faceVerified": true,
  "ipAddress": "192.168.1.100",
  "location": {
    "type": "Point",
    "coordinates": [76.6394, 12.2958]
  },
  "createdAt": ISODate("2026-04-20T17:45:30.000Z"),
  "updatedAt": ISODate("2026-04-20T17:45:30.000Z")
}
```

---

## Button States & Transitions

```
LOGIN PAGE
┌──────────────────┐
│ [SIGN IN] Button │
│ Color: Purple    │
│ Status: Active   │
└──────────────────┘
        ↓ (Click)
        ↓ (Verify)
        
ATTENDANCE PAGE (Login Tab)
┌──────────────────┐
│ 🟢 [LOGIN]       │
│ Color: Green     │
│ Status: Disabled │ ← Waiting for face
└──────────────────┘
        ↓ (Face detected)
        ↓
┌──────────────────┐
│ 🟢 [LOGIN]       │
│ Color: Green     │
│ Status: Enabled  │ ← Ready to click
└──────────────────┘
        ↓ (Click)
        ↓ (Capturing)
        
┌──────────────────┐
│ 🟢 [LOGIN]       │
│ Color: Green     │
│ Status: Disabled │ ← Processing
└──────────────────┘
        ↓ (Records)
        ↓
        
ATTENDANCE PAGE (Logout Tab)
┌──────────────────┐
│ 🔴 [LOGOUT]      │
│ Color: Red       │
│ Status: Disabled │ ← Waiting for face
└──────────────────┘
        ↓ (Face detected)
        ↓
┌──────────────────┐
│ 🔴 [LOGOUT]      │
│ Color: Red       │
│ Status: Enabled  │ ← Ready to click
└──────────────────┘
```

---

## Time Display Format Examples

```
Real-time Clock Update (Every 1 second):
09:30:45 → 09:30:46 → 09:30:47 ... → 09:30:59 → 09:31:00

Date Display (Static):
Saturday, April 20, 2026

Login Record Display:
✓ Logged In At
09:30:45
04/20/2026

Logout Record Display:
✓ Logged Out At
17:45:30
04/20/2026

Work Duration Calculation:
Login:  09:30:45 (9 hours, 30 minutes, 45 seconds)
Logout: 17:45:30 (5 hours, 45 minutes, 30 seconds PM)
Duration: 8 hours, 14 minutes, 45 seconds ≈ 8h 15m
```

---

## Statistics Update Timeline

```
Initial State:
📊 Today's Logins: 0
📊 Today's Logouts: 0
⏱️ Work Hours: 0h

After Login:
📊 Today's Logins: 1 ✓ Updated
📊 Today's Logouts: 0
⏱️ Work Hours: 0h

After Logout:
📊 Today's Logins: 1
📊 Today's Logouts: 1 ✓ Updated
⏱️ Work Hours: 8.2h ✓ Updated
```

---

**Visual Guide Version:** 1.0  
**Last Updated:** April 20, 2026  
**Status:** Complete ✓
