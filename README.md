# Smart Waste Management System

An attractive, real-time web application for monitoring and managing waste collection in residential colonies. Track garbage trucks, monitor household waste disposal, manage drivers with biometric authentication, and analyze collection data with an intuitive dashboard.

## Current Status: Production Ready ✅

**Latest Features**:
- Driver Login System with 4-step authentication (Password → QR Code → Face Recognition Login → Face Recognition Logout)
- Real-time truck tracking with live GPS updates
- Household waste monitoring and management
- Advanced analytics and reporting
- Multi-language support ready
- Responsive design for all devices

## Features

### Driver Login System (NEW)
- **4-Step Multi-Factor Authentication**:
  1. Password-based driver authentication
  2. QR code truck verification
  3. Facial recognition on login (auto-capture 3 frames)
  4. Facial recognition on logout (auto-capture 3 frames)
- **Automatic Face Detection**: No manual clicks needed - system auto-detects and captures faces
- **Shift Management**: Real-time shift timer, live statistics, truck capacity monitoring
- **Session Management**: JWT tokens (8-hour expiry), localStorage persistence, auto-redirect
- **Security Features**: Password hashing, CORS protection, biometric verification

**Quick Access**:
- Direct URL: `http://localhost:5500/frontend/driver-login.html`
- From Dashboard: Click "Driver Portal" in sidebar

**Demo Credentials**:
```
Driver ID: D001, Truck ID: T001, Password: driver123 (Ramesh Kumar)
Driver ID: D002, Truck ID: T002, Password: driver123 (Ravi Singh)
Driver ID: D003, Truck ID: T003, Password: driver123 (Yallappa)
Driver ID: D004, Truck ID: T004, Password: driver123 (Pradeep Kumar)
```

### Dashboard
- **Real-time Statistics**: View active trucks, total waste collected, household count, and daily collections
- **Activity Feed**: Monitor recent activities including collections, truck movements, and alerts
- **Quick Actions**: Fast access to truck tracking, household management, driver portal, and report generation
- **Driver Portal Link**: Easy navigation to driver authentication system

### Live Truck Tracking
- **Real-time GPS Tracking**: Monitor garbage truck locations on an interactive map
- **Truck Details**: View truck ID, driver name, capacity level, route, and last collection time
- **Status Filtering**: Filter trucks by status (All, Active, Idle)
- **Live Updates**: Automatic position updates every 5 seconds
- **Interactive Map**: Click on trucks or households for detailed information

### Household Management
- **Comprehensive Profiles**: Track each household's waste disposal history
- **Search & Filter**: Easily find households by name, ID, or address
- **Status Monitoring**: See which households are compliant, pending, or missed collections
- **Detailed Information**:
  - Contact details and resident count
  - Today's waste collected
  - Monthly waste totals
  - Per capita waste generation
  - Complete collection history with dates, amounts, and waste types

### Analytics & Reports
- **Waste Collection Trends**: Visual charts showing daily/weekly collection patterns
- **Compliance Rates**: Pie chart showing household compliance statistics
- **Leaderboard**: Top contributing households ranked by monthly waste collection
- **Report Generation**: Download comprehensive PDF reports

## Getting Started

### Prerequisites
- Node.js v14+ and npm
- MongoDB (local or remote)
- Modern web browser (Chrome/Firefox recommended for face recognition)
- Webcam for driver face recognition feature

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mahesharunaladi/smart-waste-management.git
   cd smart-waste-management-1
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies** (if using Node server):
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment** (Backend):
   Create `.env` file in `/backend` folder:
   ```
   MONGODB_URI=mongodb://localhost:27017/smartwaste
   PORT=3002
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

5. **Start Backend Server**:
   ```bash
   cd backend
   PORT=3002 npm start
   ```
   Expected Output:
   ```
   ✅ MongoDB Connected Successfully
   🚀 Server running on port 3002
   ```

6. **Start Frontend Server** (in another terminal):
   ```bash
   cd frontend
   npm start
   ```
   Or use Python:
   ```bash
   cd frontend
   python -m http.server 5500
   ```

7. **Access the Application**:
   - Main Dashboard: `http://localhost:5500/frontend/index.html`
   - Driver Login: `http://localhost:5500/frontend/driver-login.html`

### Quick Start (5 Minutes)

```bash
# Terminal 1 - Start Backend
cd backend && PORT=3002 npm start

# Terminal 2 - Start Frontend
cd frontend && npm start

# Then open browser to:
# http://localhost:5500/frontend/driver-login.html
# Use: D001 / T001 / driver123
```

## Project Structure

```
smart-waste-management-1/
├── backend/
│   ├── routes/
│   │   ├── auth.js              # Admin authentication
│   │   ├── driver-auth.js       # Driver authentication & face recognition
│   │   ├── trucks.js            # Truck management
│   │   ├── households.js        # Household management
│   │   ├── activities.js        # Activity logs
│   │   └── analytics.js         # Analytics data
│   ├── models/
│   │   ├── Admin.js             # Admin model
│   │   ├── Truck.js             # Truck model
│   │   ├── Household.js         # Household model
│   │   └── Activity.js          # Activity model
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── server.js                # Express server setup
│   ├── package.json             # Backend dependencies
│   └── README.md                # Backend documentation
├── frontend/
│   ├── index.html               # Main dashboard
│   ├── dashboard.html           # Admin dashboard
│   ├── live-tracking.html       # Truck tracking page
│   ├── driver-login.html        # Driver authentication
│   ├── driver-qr-scan.html      # QR code verification
│   ├── driver-face-scan.html    # Facial recognition
│   ├── driver-dashboard.html    # Driver shift management
│   ├── login.html               # Admin login
│   ├── styles.css               # Global styles
│   ├── app.js                   # Main application logic
│   ├── dashboard.js             # Dashboard logic
│   └── package.json             # Frontend dependencies
├── DOCUMENTATION files
│   ├── DRIVER_LOGIN_STATUS.md
│   ├── DRIVER_LOGIN_ACCESS.md
│   ├── DRIVER_SYSTEM_ARCHITECTURE.md
│   ├── DRIVER_LOGIN_DOCUMENTATION.md
│   ├── DRIVER_LOGIN_SETUP.md
│   ├── DRIVER_LOGIN_VISUAL_GUIDE.md
│   ├── QUICK_START_DRIVER.md
│   └── More...
├── README.md                    # This file
└── start.sh                     # Startup script
```

## Features Breakdown

### Driver Authentication & Login System

#### Step 1: Password-Based Login
- Driver enters credentials (ID, Truck ID, Password)
- Backend validates against MongoDB
- JWT token generated on success
- Session stored in browser localStorage

#### Step 2: QR Code Truck Verification
- Camera stream opened automatically
- Real-time QR code detection using jsQR library
- Validates truck identity via QR format: `TRUCK_{ID}_VERIFIED`
- Ensures driver is assigned to correct truck

#### Step 3: Facial Recognition - Login
- Automatic face detection (no manual activation)
- Real-time brightness/contrast analysis
- Auto-captures 3 frames when face detected
- Shows progress: "Capturing... 1/3, 2/3, 3/3"
- Face data stored in localStorage
- Green checkmark on successful capture

#### Step 4: Facial Recognition - Logout
- Same process as login but in Logout tab
- Compares captured faces for consistency
- Records shift duration
- Clears all session data
- Redirects to login page

### Dashboard Section
- 4 statistics cards showing key metrics
- Recent activity timeline
- Quick action buttons for common tasks
- Driver Portal link for quick access

### Truck Tracking Section
- Split-screen layout with truck list and map
- Real-time truck position updates
- Truck status indicators (Active/Idle)
- Capacity levels and route information
- Interactive markers with popups
- GPS coordinates and movement tracking

### Households Section
- Grid layout with household cards
- Color-coded status badges:
  - Green (Compliant): Waste collected today
  - Yellow (Pending): Collection scheduled
  - Red (Missed): Collection overdue
- Detailed modal view with complete household information
- Search functionality
- Status-based filtering

## Technologies Used

### Frontend
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with gradients, animations, flexbox, and grid layouts
- **JavaScript (ES6+)**: Interactive functionality and data management
- **Leaflet.js**: Interactive maps and truck tracking
- **Chart.js**: Data visualization and analytics
- **jsQR**: QR code scanning and detection
- **tracking.js**: Face detection algorithm
- **Font Awesome**: Icons throughout the interface

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework and API routing
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT (jsonwebtoken)**: Secure token authentication
- **bcryptjs**: Password hashing and encryption
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Database Models
- **Admin**: User profiles and roles
- **Truck**: Vehicle information and tracking
- **Household**: Resident data and waste tracking
- **Activity**: Event logging and monitoring

### APIs Implemented

**Authentication Endpoints**:
```
POST /api/auth/login              - Admin login
POST /api/auth/driver-login       - Driver authentication
POST /api/auth/verify-qr          - QR code verification
POST /api/auth/capture-face       - Face recognition capture
POST /api/auth/end-shift          - Shift termination
```

**Truck Management**:
```
GET /api/trucks                   - Get all trucks
GET /api/trucks/:id               - Get truck details
PUT /api/trucks/:id               - Update truck
PUT /api/trucks/:id/driver        - Update driver info
```

**Household Management**:
```
GET /api/households               - Get all households
GET /api/households/:id           - Get household details
POST /api/households              - Create household
PUT /api/households/:id           - Update household
```

**Analytics & Reporting**:
```
GET /api/analytics/summary        - Get dashboard statistics
GET /api/analytics/trends         - Get collection trends
GET /api/activities               - Get activity logs
```

## Responsive Design

The application is fully responsive and works on:
- Desktop computers (1400px+)
- Laptops (1024px - 1400px)
- Tablets (768px - 1024px)
- Mobile phones (<768px)

## Usage Guide

### Monitoring Trucks
1. Click **"Truck Tracking"** in the navigation bar
2. View the list of all active trucks on the left
3. Click any truck to focus on it on the map
4. Use filters to view Active or Idle trucks only
5. Watch real-time position updates

### Checking Household Profiles
1. Click **"Households"** in the navigation bar
2. Browse through household cards or use search
3. Click any household card to view detailed profile
4. View collection history, waste statistics, and contact information
5. Filter by status (All, Compliant, Pending, Missed)

### Viewing Analytics
1. Click **"Analytics"** in the navigation bar
2. Review waste collection trends over time
3. Check household compliance rates
4. See top contributing households
5. Click "Generate Report" for detailed PDF reports

## Customization

### Adding New Trucks
Edit the `trucksData` array in `app.js`:
```javascript
{
    id: 'TRUCK-006',
    status: 'active',
    driver: 'Driver Name',
    location: [latitude, longitude],
    capacity: 50,
    route: 'Zone E',
    lastCollection: '10 mins ago'
}
```

### Adding New Households
Edit the `householdsData` array in `app.js`:
```javascript
{
    id: 'H-009',
    name: 'Family Name',
    address: 'Complete Address',
    status: 'compliant',
    phone: '+91 xxxxx xxxxx',
    residents: 4,
    lastDump: '2024-03-01',
    wasteAmount: 15.0,
    monthlyWaste: 350,
    collectionHistory: [...]
}
```

### Changing Map Center
Modify the map initialization in `app.js`:
```javascript
map = L.map('map').setView([YOUR_LAT, YOUR_LONG], ZOOM_LEVEL);
```

## Color Scheme

- **Primary Green**: `#10b981` - Success, compliant status
- **Secondary Cyan**: `#06b6d4` - Active elements, links
- **Warning Orange**: `#f59e0b` - Pending status, alerts
- **Danger Red**: `#ef4444` - Missed collections, errors
- **Dark Background**: `#1f2937` - Navigation bar
- **Light Background**: `#f9fafb` - Main content area

## Future Enhancements

- Backend integration with real database
- User authentication and role-based access
- SMS/Email notifications for collections
- Mobile app version (React Native)
- AI-powered route optimization
- Integration with IoT sensors in bins
- Multi-language support
- Dark mode theme
- Export data to Excel/CSV
- Real-time notifications
- Weather-based collection scheduling

## License

This project is open source and available for educational use.

## Author

**Mahesh Arun Aladi**

## Support

For support, email your contact or create an issue in the repository.

---

