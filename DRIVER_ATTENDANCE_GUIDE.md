# Driver Attendance Tracking System - Implementation Guide

## Overview
A complete face recognition-based driver attendance tracking system with real-time login/logout, driver details display, and work hour tracking.

---

## Features Implemented

### 1. **Enhanced Driver Details**
The system now captures and displays:
- ✅ Driver Name
- ✅ Phone Number
- ✅ Aadhar Number
- ✅ Gender
- ✅ Caste
- ✅ Truck ID
- ✅ Email

### 2. **Face Recognition Attendance**
- **Login Functionality**
  - Green button for login
  - Captures 3 face samples for verification
  - Records login time automatically
  - Displays login timestamp

- **Logout Functionality**
  - Red button for logout
  - Captures 3 face samples for verification
  - Records logout time automatically
  - Calculates work duration
  - Displays logout timestamp

### 3. **Color Coding**
- 🟢 **Green Button** - Login button (sign-in-alt icon)
- 🔴 **Red Button** - Logout button (sign-out-alt icon)
- Status indicators with real-time updates

### 4. **Attendance Statistics**
- Daily login count
- Daily logout count
- Total work hours today
- Work hours display in format: "8.5h"

### 5. **Time Display**
- Real-time clock showing current time (HH:MM:SS format)
- Current date display with day name
- Login time stamp with date
- Logout time stamp with date

---

## File Structure

### Backend Files Created/Modified

#### 1. **`backend/models/Attendance.js`** (NEW)
- Stores attendance records in database
- Fields:
  - `driverId`: Driver identifier
  - `truckId`: Assigned truck
  - `driverName`: Driver's name
  - `type`: LOGIN or LOGOUT
  - `timestamp`: Full datetime
  - `date`: Date in string format
  - `time`: Time in string format
  - `faceVerified`: Boolean for face verification status
  - `location`: GPS coordinates
  - `duration`: Work duration for logout records
  - Indexes for efficient querying

#### 2. **`backend/routes/driver-auth.js`** (MODIFIED)
Enhanced with attendance endpoints:

**New Endpoints:**

- `POST /api/auth/attendance/login`
  - Records driver login with face verification
  - Parameters: driverId, truckId, driverName, time, date, faceVerified, location
  - Returns: Attendance record

- `POST /api/auth/attendance/logout`
  - Records driver logout with work duration
  - Parameters: driverId, truckId, driverName, time, date, duration, faceVerified, location
  - Returns: Attendance record with work duration

- `GET /api/auth/attendance/:driverId/:date`
  - Retrieves attendance records for a specific date
  - Returns: Login time, logout time, work hours

- `GET /api/auth/attendance/monthly/:driverId/:month/:year`
  - Retrieves attendance for entire month
  - Returns: Daily breakdown, total days, total hours, average hours

**Updated Endpoint:**

- `POST /api/auth/driver-login`
  - Now includes: aadharNumber, gender, caste, email
  - Returns complete driver profile in response

---

### Frontend Files Created/Modified

#### 1. **`frontend/driver-attendance.html`** (NEW)
Complete attendance tracking interface with:

**Layout:**
- Split panel design (camera + driver details)
- Responsive grid layout (2 columns desktop, 1 column mobile)

**Camera Section:**
- Live video feed from camera
- Face detection indicator
- Real-time status (detecting/detected)
- Progress bar for capture count (0-3)
- Animated spinner during detection

**Driver Panel:**
- Driver information display:
  - Name
  - Phone
  - Aadhar Number
  - Gender
  - Caste
  - Truck ID
- Time display with live clock
- Login/Logout tab buttons
- Action buttons:
  - 🟢 Green "Login" button
  - 🔴 Red "Logout" button
- Attendance records display:
  - Login time record (green background)
  - Logout time record (red background)

**Statistics Dashboard:**
- Today's Logins count
- Today's Logouts count
- Total Work Hours

**Features:**
```javascript
// Real-time clock
- Updates every second
- Shows HH:MM:SS format
- Displays current date with day name

// Face detection
- Uses @vladmandic/face-api.js library
- Continuous detection every 500ms
- Enables buttons when face detected
- Disables when face not detected

// Capture process
- 3 captures per login/logout
- Progress tracking
- Automatic submission after captures

// Time tracking
- Login: Records exact timestamp
- Logout: Calculates work duration
- Stores in localStorage for immediate UI update
- Also sends to backend for database storage
```

#### 2. **`frontend/driver-login.html`** (MODIFIED)
- Updated to save complete driver details (aadharNumber, gender, caste, email)
- Changed from localStorage to sessionStorage
- Redirects to `driver-attendance.html` instead of `driver-qr-scan.html`
- Passes driver profile to attendance page

---

## API Integration

### Database Schema

**Attendance Model:**
```javascript
{
  driverId: String (indexed),
  truckId: String,
  driverName: String,
  type: String (LOGIN|LOGOUT),
  timestamp: Date (indexed),
  date: String (indexed),
  time: String,
  faceVerified: Boolean,
  ipAddress: String,
  location: {
    type: Point,
    coordinates: [Number] // [longitude, latitude]
  },
  duration: String,
  remarks: String,
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

**1. Login Attendance**
```
POST /api/auth/attendance/login
{
  "driverId": "D001",
  "truckId": "T001",
  "driverName": "Ramesh Kumar",
  "time": "09:30:45",
  "date": "04/20/2026",
  "faceVerified": true,
  "location": {
    "type": "Point",
    "coordinates": [76.6394, 12.2958]
  }
}
```

**2. Logout Attendance**
```
POST /api/auth/attendance/logout
{
  "driverId": "D001",
  "truckId": "T001",
  "driverName": "Ramesh Kumar",
  "time": "17:45:30",
  "date": "04/20/2026",
  "duration": "8h 15m",
  "faceVerified": true,
  "location": {
    "type": "Point",
    "coordinates": [76.6394, 12.2958]
  }
}
```

**3. Get Daily Attendance**
```
GET /api/auth/attendance/D001/04/20/2026
Response:
{
  "success": true,
  "records": [
    {
      "type": "LOGIN",
      "time": "09:30:45",
      "timestamp": "2026-04-20T09:30:45.000Z"
    },
    {
      "type": "LOGOUT",
      "time": "17:45:30",
      "timestamp": "2026-04-20T17:45:30.000Z",
      "duration": "8h 15m"
    }
  ],
  "summary": {
    "present": true,
    "loginTime": "09:30:45",
    "logoutTime": "17:45:30",
    "workHours": "8h 15m"
  }
}
```

**4. Get Monthly Attendance**
```
GET /api/auth/attendance/monthly/D001/04/2026
Response:
{
  "success": true,
  "records": {
    "04/01/2026": [...],
    "04/02/2026": [...],
    ...
  },
  "stats": {
    "totalDays": 20,
    "totalHours": "160.5",
    "averageHours": "8.0"
  }
}
```

---

## Frontend Implementation Details

### Session Storage
```javascript
// Stored in sessionStorage after login
{
  id: "D001",
  name: "Ramesh Kumar",
  truckId: "T001",
  phone: "9742583104",
  aadharNumber: "1234-5678-9101-1121",
  gender: "Male",
  caste: "OBC",
  email: "ramesh@smartwaste.com",
  token: "jwt_token_here",
  timestamp: "2026-04-20T09:30:00.000Z"
}
```

### Local Storage for Attendance
```javascript
// currentLogin
{
  type: "LOGIN",
  driverId: "D001",
  truckId: "T001",
  timestamp: "2026-04-20T09:30:45.000Z",
  time: "09:30:45",
  date: "04/20/2026"
}

// currentLogout
{
  type: "LOGOUT",
  driverId: "D001",
  truckId: "T001",
  timestamp: "2026-04-20T17:45:30.000Z",
  time: "17:45:30",
  date: "04/20/2026",
  duration: "8h 15m"
}
```

---

## Usage Flow

### 1. Driver Login Process
```
Step 1: Driver navigates to login page
        ↓
Step 2: Enters Driver ID, Truck, Password
        ↓
Step 3: Successfully authenticates
        ↓
Step 4: Redirected to Attendance Page (driver-attendance.html)
        ↓
Step 5: Driver details displayed in right panel
```

### 2. Attendance Tracking
```
Step 1: Driver sees attendance page with camera
        ↓
Step 2: "Login" tab is active (green button visible)
        ↓
Step 3: Driver positions face in front of camera
        ↓
Step 4: Face detected → Green button enabled
        ↓
Step 5: Driver clicks "Login" button
        ↓
Step 6: System captures 3 face samples
        ↓
Step 7: Progress bar shows 3/3 captures completed
        ↓
Step 8: Login time recorded and displayed
        ↓
Step 9: Automatically switches to "Logout" tab
        ↓
Step 10: Red logout button now visible
```

### 3. Logout Process
```
Step 1: Driver clicks "Logout" tab
        ↓
Step 2: Red logout button visible
        ↓
Step 3: Driver positions face again
        ↓
Step 4: Clicks "Logout" button
        ↓
Step 5: System captures 3 face samples
        ↓
Step 6: Calculates work duration automatically
        ↓
Step 7: Logout time recorded and displayed
        ↓
Step 8: Statistics updated (hours, etc.)
```

---

## Color Scheme

```
Login Button:     🟢 #22c55e (Green)
Logout Button:    🔴 #ef4444 (Red)

Login Record:     #d1fae5 (Light Green background)
Logout Record:    #fee2e2 (Light Red background)

Primary Color:    #667eea (Purple/Blue)
Secondary Color:  #764ba2 (Purple)
```

---

## Technologies Used

### Frontend
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript
- Leaflet.js (for maps, if needed)
- @vladmandic/face-api.js (face detection)

### Backend
- Node.js/Express
- MongoDB
- Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing

---

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

*Note: Face recognition requires HTTPS or localhost with camera permissions*

---

## Installation & Setup

### 1. Install Attendance Model
```bash
# Copy backend/models/Attendance.js to your project
# Already included in workspace
```

### 2. Update Backend Routes
```bash
# driver-auth.js already updated with new endpoints
# Ensure Attendance model is imported
```

### 3. Update Frontend
```bash
# driver-login.html - Updated to redirect to attendance page
# driver-attendance.html - New file created
# Both files ready to use
```

### 4. Database Setup
```bash
# Ensure MongoDB is running
# Attendance collection will be created automatically by Mongoose
```

---

## Testing Guide

### Manual Testing

**Test 1: Login Flow**
1. Open driver-login.html
2. Enter: D001, T001, driver123
3. Should redirect to driver-attendance.html
4. Verify driver details displayed

**Test 2: Face Detection**
1. Allow camera permissions
2. Position face in camera
3. "Face Detected" message should appear
4. Login button should be enabled

**Test 3: Login Recording**
1. Click Login button
2. Wait for 3 captures
3. Verify login time displayed
4. Check localStorage for currentLogin data

**Test 4: Logout Recording**
1. System auto-switches to logout tab
2. Click Logout button
3. Wait for 3 captures
4. Verify logout time and duration displayed

**Test 5: Statistics**
1. After login: todayLogins = 1
2. After logout: todayLogouts = 1, totalHours displayed

---

## Demo Credentials

```
Driver ID: D001
Truck ID: T001
Password: driver123
```

---

## Future Enhancements

- [ ] Real-time GPS tracking during work
- [ ] Photo capture with attendance
- [ ] Biometric fingerprint support
- [ ] Mobile app version
- [ ] SMS notifications
- [ ] Attendance reports export (PDF/Excel)
- [ ] Geofencing alerts
- [ ] Shift scheduling
- [ ] Holiday management
- [ ] Leave application system

---

## Troubleshooting

**Issue: Camera not opening**
- Solution: Check browser permissions for camera access
- Ensure HTTPS or localhost
- Try different browser

**Issue: Face not detected**
- Solution: Ensure good lighting
- Position face clearly in frame
- Check browser compatibility

**Issue: Data not saving**
- Solution: Ensure MongoDB is running
- Check backend server logs
- Verify API endpoints are responding

---

## Support

For issues or questions, refer to:
- Backend logs: `backend.log`
- Browser console for frontend errors
- MongoDB Atlas for database status

---

**System Version:** 1.0  
**Last Updated:** April 20, 2026  
**Status:** Ready for Production
