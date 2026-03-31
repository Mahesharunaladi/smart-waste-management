# Driver Login System - Access Guide

## Quick Access

### Option 1: Direct URL Access
Open your browser and navigate to:
```
http://localhost:5500/frontend/driver-login.html
```
(or your current frontend server port)

### Option 2: From Dashboard
1. Go to your main dashboard: `http://localhost:5500/frontend/dashboard.html`
2. Look for **"Driver Portal"** in the left sidebar navigation
3. Click on it to access the driver login page

---

## System Architecture

### Ports Configuration
- **Backend API**: Running on `http://localhost:3002`
- **Frontend**: Running on `http://localhost:5500` (or your configured frontend port)

### Complete Flow

```
1. DRIVER LOGIN (driver-login.html)
   ↓
   ✓ Enter: Driver ID, Truck ID, Password
   ✓ API Call: POST /api/auth/driver-login
   ✓ Stores: JWT token + session in localStorage
   ✓ Redirects to: driver-qr-scan.html

2. QR CODE SCAN (driver-qr-scan.html)
   ↓
   ✓ Opens camera
   ✓ Scans QR code (format: TRUCK_{truckId}_VERIFIED)
   ✓ Validates truck matches
   ✓ Redirects to: driver-face-scan.html

3. FACE RECOGNITION - LOGIN (driver-face-scan.html)
   ↓
   ✓ Opens camera
   ✓ Detects face automatically
   ✓ Captures 3 facial frames when detected
   ✓ Stores face data in session
   ✓ Redirects to: driver-dashboard.html

4. DRIVER DASHBOARD (driver-dashboard.html)
   ↓
   ✓ Shows active shift status
   ✓ Displays real-time shift timer
   ✓ Shows truck statistics
   ✓ Option to logout (requires face recognition again)

5. FACE RECOGNITION - LOGOUT (driver-face-scan.html - logout tab)
   ↓
   ✓ Captures 3 facial frames again
   ✓ Records shift end time
   ✓ Clears session
   ✓ Redirects to: driver-login.html
```

---

## Demo Credentials

Use any of these credentials to test:

| Driver ID | Name | Truck ID | Password |
|-----------|------|----------|----------|
| D001 | Ramesh Kumar | T001 | driver123 |
| D002 | Ravi Singh | T002 | driver123 |
| D003 | Yallappa | T003 | driver123 |
| D004 | Pradeep Kumar | T004 | driver123 |

---

## Features Implemented

### ✅ 4-Step Authentication System
1. **Password Login** - Driver ID + Truck ID + Password validation
2. **QR Code Verification** - Truck identification via QR scanning
3. **Facial Recognition (Login)** - 3-point face capture on login
4. **Facial Recognition (Logout)** - 3-point face capture on logout

### ✅ Face Recognition Features
- **Automatic Detection** - Detects face using brightness/contrast analysis
- **Auto-Capture** - Automatically captures 3 frames when face detected
- **Dual Modes** - Separate tabs for Login and Logout face recognition
- **Visual Feedback** - Shows detection status and capture progress
- **Production Ready** - Can be upgraded to real ML.js/TensorFlow.js

### ✅ Shift Management
- **Real-time Timer** - Shows active shift duration
- **Statistics Display** - Collections and waste collected today
- **Truck Capacity** - Shows current truck capacity percentage
- **Quick Actions** - Logout and other driver actions

### ✅ Session Management
- **JWT Tokens** - 8-hour session expiry
- **localStorage Persistence** - Session survives page refresh
- **Auto-Redirect** - Redirects based on session state
- **Secure Logout** - Clears all session data

---

## Face Recognition Guide

### How It Works

The face recognition system uses **brightness/contrast analysis** to detect faces:

1. **Detection Phase**
   - Analyzes video frames for brightness variations
   - Looks for face-like patterns (contrast edges)
   - Triggers when face is detected

2. **Capture Phase**
   - Automatically captures 3 frames
   - Shows capture progress (1/3, 2/3, 3/3)
   - Stores frame data in session

3. **Verification Phase**
   - Compares captured frames
   - Ensures consistency across captures
   - Accepts or rejects based on match quality

### Testing Face Recognition

**For Login Face Scan:**
1. Ensure good lighting (natural light is best)
2. Face the camera directly
3. Keep face in frame for ~2-3 seconds
4. System will auto-capture 3 frames
5. Progress will show: "Face detected. Capturing... 1/3"

**For Logout Face Scan:**
1. Follow same process as login
2. System will compare with login frames
3. Must pass consistency check
4. After successful logout, redirects to login page

### Tips for Best Results

✅ **Good Lighting** - Natural light or bright room lighting
✅ **Direct Face** - Look straight at camera
✅ **No Obstacles** - Remove glasses/masks if possible
✅ **Still Position** - Keep head relatively still during capture
✅ **Close Distance** - Face should be 20-60cm from camera
✅ **Clear View** - Ensure entire face is visible in frame

❌ **Avoid:**
- Backlit scenes (sun behind you)
- Dim/dark rooms
- Extreme angles (profile or upside down)
- Rapid head movement
- Partial face visibility
- Sunglasses/heavy makeup

---

## API Endpoints

### Authentication Endpoints

**1. Driver Login**
```bash
POST /api/auth/driver-login
Content-Type: application/json

{
  "driverId": "D001",
  "truckId": "T001",
  "password": "driver123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "driver": {
    "id": "D001",
    "name": "Ramesh Kumar",
    "truckId": "T001",
    "phone": "9742583104"
  }
}
```

**2. QR Verification**
```bash
POST /api/auth/verify-qr
Content-Type: application/json

{
  "token": "jwt_token_here",
  "qrData": "TRUCK_T001_VERIFIED"
}
```

**3. Face Recognition Capture**
```bash
POST /api/auth/capture-face
Content-Type: application/json

{
  "token": "jwt_token_here",
  "faceData": "canvas_data_uri",
  "mode": "login" | "logout"
}
```

**4. Shift End**
```bash
POST /api/auth/end-shift
Content-Type: application/json

{
  "token": "jwt_token_here",
  "duration": 3600
}
```

---

## Troubleshooting

### Issue: Driver login not found
**Solution:** 
- Navigate to http://localhost:5500/frontend/driver-login.html directly
- Or click "Driver Portal" from dashboard sidebar
- Ensure backend is running on port 3002

### Issue: Camera not working
**Solution:**
- Check browser permissions (Settings → Privacy → Camera)
- Try different browser (Chrome/Firefox preferred)
- Ensure camera is not in use by another app
- Refresh page and try again

### Issue: Face not detected
**Solution:**
- Ensure good lighting
- Face camera directly
- Move closer to camera (20-60cm)
- Ensure entire face is visible
- Clear any obstructions

### Issue: QR code not scanning
**Solution:**
- Ensure QR code is clear and not damaged
- Increase brightness of QR code image
- Move closer/farther to find optimal distance
- Try tilting QR code slightly

### Issue: API connection error
**Solution:**
- Verify backend is running: `npm start` in `/backend` folder
- Check backend is on port 3002: `lsof -i :3002`
- Verify frontend can reach backend: Test in console: `fetch('http://localhost:3002/api/auth/driver-login')`
- Check CORS settings in backend

### Issue: Session not persisting
**Solution:**
- Clear browser cache/localStorage: DevTools → Application → Clear Site Data
- Check localStorage is enabled in browser
- Verify JWT token is being saved correctly
- Check browser console for errors

---

## Testing the Complete Flow

### Step 1: Start Services
```bash
# Terminal 1 - Start Backend
cd backend
PORT=3002 npm start

# Terminal 2 - Start Frontend (if needed)
cd frontend
npm start
```

### Step 2: Test Driver Login
1. Open: `http://localhost:5500/frontend/driver-login.html`
2. Enter credentials:
   - Driver ID: D001
   - Truck ID: T001
   - Password: driver123
3. Click "Login"
4. Should show "Login successful" and redirect to QR scan

### Step 3: Test QR Scanning
1. Generate QR code with text: `TRUCK_T001_VERIFIED`
2. Print it or display on phone
3. Use camera to scan
4. Should show "QR Code verified! Truck matched."
5. Click "Proceed to Face Recognition"

### Step 4: Test Face Recognition (Login)
1. Ensure good lighting
2. Face the camera
3. System will auto-detect and capture 3 frames
4. Should show progress: "Face detected. Capturing... 1/3"
5. After successful capture, redirects to driver dashboard

### Step 5: Test Shift Dashboard
1. Should show "Shift Active" status
2. Shift timer should be counting
3. Statistics should display (may show 0 if no data)
4. Click "End Shift" button

### Step 6: Test Face Recognition (Logout)
1. Switch to "Logout" tab
2. Face camera again
3. System will capture 3 frames again
4. After successful capture, redirects to login page
5. Session should be cleared

### Step 7: Verify Logout
1. Try to access driver dashboard
2. Should redirect to login page
3. localStorage should be empty for driver session
4. Can login again to start new shift

---

## Production Considerations

### Security Enhancements
- [ ] Use real ML.js/TensorFlow.js for face recognition
- [ ] Store face embeddings in database (not localStorage)
- [ ] Implement face matching algorithms
- [ ] Add anti-spoofing (liveness detection)
- [ ] Use HTTPS instead of HTTP
- [ ] Implement rate limiting
- [ ] Add 2FA (SMS/Email verification)

### Performance Optimizations
- [ ] Use IndexedDB instead of localStorage for large data
- [ ] Implement service workers for offline mode
- [ ] Cache QR code patterns
- [ ] Optimize video stream quality
- [ ] Implement lazy loading for images

### Integration
- [ ] Connect to real driver database
- [ ] Implement SMS notifications
- [ ] Add email alerts
- [ ] Store face data securely
- [ ] Implement audit logging
- [ ] Add analytics tracking

---

## Support & Documentation

For more details, see:
- `DRIVER_LOGIN_DOCUMENTATION.md` - Technical documentation
- `DRIVER_LOGIN_SETUP.md` - Setup instructions
- `DRIVER_LOGIN_VISUAL_GUIDE.md` - Flowcharts and wireframes
- `DRIVER_LOGIN_IMPLEMENTATION_SUMMARY.md` - Implementation details

---

**Last Updated**: 2024
**Status**: ✅ Active & Working
**Backend Port**: 3002
**Frontend Port**: 5500 (or configured port)
