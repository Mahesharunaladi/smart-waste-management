# Smart Waste Management - Backend API

Complete RESTful API backend for the Smart Waste Management System with authentication, MongoDB database, and comprehensive features.

## 🚀 Features

- ✅ **Admin Authentication** with JWT tokens
- ✅ **Multiple Admin Roles** with different permissions
- ✅ **Truck Management** (CRUD + real-time tracking)
- ✅ **Household Management** (profiles, waste tracking, collection history)
- ✅ **Activity Logging** (system-wide activity tracking)
- ✅ **Analytics & Reports** (dashboard stats, trends, leaderboards)
- ✅ **MongoDB Database** with Mongoose ODM
- ✅ **RESTful API** with proper error handling
- ✅ **CORS enabled** for frontend integration

## 📋 Prerequisites

Before running the backend, ensure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🔧 Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Windows:**
Download and install from [MongoDB Official Website](https://www.mongodb.com/try/download/community)

### 3. Configure Environment Variables

The `.env` file is already created. Update if needed:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart-waste-management
JWT_SECRET=your-secret-key-change-this-in-production-2026
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:8000
```

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 👥 Default Admin Accounts

The system automatically creates 4 admin accounts with different roles:

### 1. Super Administrator
- **Admin ID:** `ADMIN001`
- **Email:** `admin@smartwaste.com`
- **Password:** `admin123`
- **Permissions:** ALL (Full access)

### 2. Operations Manager
- **Admin ID:** `ADMIN002`
- **Email:** `operations@smartwaste.com`
- **Password:** `ops123`
- **Permissions:** trucks, households, analytics

### 3. Analytics Manager
- **Admin ID:** `ADMIN003`
- **Email:** `analytics@smartwaste.com`
- **Password:** `analytics123`
- **Permissions:** analytics, households, reports

### 4. Fleet Manager
- **Admin ID:** `ADMIN004`
- **Email:** `fleet@smartwaste.com`
- **Password:** `fleet123`
- **Permissions:** trucks, routes

## 📡 API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "adminId": "ADMIN001",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "adminId": "ADMIN001",
    "name": "Super Administrator",
    "email": "admin@smartwaste.com",
    "role": "super_admin",
    "permissions": ["all"]
  }
}
```

#### Get Current Admin
```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get All Admins
```http
GET /api/auth/admins
```

### Trucks

#### Get All Trucks
```http
GET /api/trucks
GET /api/trucks?status=active
GET /api/trucks?zone=Zone A
```

#### Get Single Truck
```http
GET /api/trucks/TRUCK-001
```

#### Create Truck
```http
POST /api/trucks
Content-Type: application/json

{
  "truckId": "TRUCK-006",
  "driver": {
    "name": "John Doe",
    "phone": "+91 98765 43210"
  },
  "status": "idle",
  "location": {
    "coordinates": [77.5946, 12.9716]
  },
  "route": {
    "zone": "Zone A"
  }
}
```

#### Update Truck Location
```http
PUT /api/trucks/TRUCK-001/location
Content-Type: application/json

{
  "coordinates": [77.5946, 12.9716],
  "address": "MG Road, Bengaluru"
}
```

#### Update Truck Status
```http
PUT /api/trucks/TRUCK-001/status
Content-Type: application/json

{
  "status": "active"
}
```

### Households

#### Get All Households
```http
GET /api/households
GET /api/households?status=compliant
GET /api/households?zone=Zone A
GET /api/households?search=Sharma
```

#### Get Single Household
```http
GET /api/households/H-001
```

#### Create Household
```http
POST /api/households
Content-Type: application/json

{
  "householdId": "H-009",
  "name": "New Family",
  "address": {
    "street": "123 Main St",
    "block": "Block A",
    "zone": "Zone A",
    "city": "Bengaluru"
  },
  "contact": {
    "phone": "+91 98765 43210"
  },
  "residents": 4
}
```

#### Record Waste Collection
```http
POST /api/households/H-001/collect
Content-Type: application/json

{
  "amount": 15.5,
  "type": "Mixed",
  "collectedBy": "TRUCK-001",
  "truckId": "TRUCK_OBJECT_ID"
}
```

### Activities

#### Get Recent Activities
```http
GET /api/activities
GET /api/activities?limit=50
GET /api/activities?type=collection
```

#### Create Activity
```http
POST /api/activities
Content-Type: application/json

{
  "type": "alert",
  "title": "System Alert",
  "description": "High waste accumulation detected",
  "icon": "fa-exclamation-triangle",
  "priority": "high"
}
```

### Analytics

#### Dashboard Statistics
```http
GET /api/analytics/dashboard
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "activeTrucks": 5,
    "totalHouseholds": 342,
    "compliantHouseholds": 256,
    "totalWasteToday": "1847.50",
    "totalWasteMonthly": "45678.25",
    "collectionsToday": 156,
    "complianceRate": "74.9"
  }
}
```

#### Waste Collection Trends
```http
GET /api/analytics/waste-trends
GET /api/analytics/waste-trends?days=30
```

#### Compliance Statistics
```http
GET /api/analytics/compliance
```

#### Leaderboard
```http
GET /api/analytics/leaderboard
GET /api/analytics/leaderboard?limit=20
```

## 🗄️ Database Models

### Admin
- adminId (unique)
- name
- email
- password (hashed)
- role
- permissions
- isActive
- lastLogin

### Truck
- truckId (unique)
- driver (name, phone, license)
- status
- location (coordinates, address)
- capacity
- route
- lastCollection
- statistics

### Household
- householdId (unique)
- name
- address
- contact
- residents
- status
- wasteData
- collectionHistory
- assignedTruck

### Activity
- type
- title
- description
- icon
- relatedTruck
- relatedHousehold
- metadata
- priority

## 🔒 Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Token expiration: 7 days
- CORS protection enabled
- Input validation using express-validator

## 🧪 Testing the API

### Using cURL:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"adminId":"ADMIN001","password":"admin123"}'

# Get trucks (with token)
curl http://localhost:5000/api/trucks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman:

1. Import the API endpoints
2. Set up environment variable for the token
3. Test all endpoints

## 📊 Project Structure

```
backend/
├── models/
│   ├── Admin.js          # Admin user model
│   ├── Truck.js          # Truck model
│   ├── Household.js      # Household model
│   └── Activity.js       # Activity log model
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── trucks.js         # Truck management routes
│   ├── households.js     # Household management routes
│   ├── activities.js     # Activity routes
│   └── analytics.js      # Analytics & reports routes
├── middleware/
│   └── auth.js           # Authentication middleware
├── .env                  # Environment variables
├── package.json          # Dependencies
├── server.js             # Main server file
└── README.md             # This file
```

## 🚀 Deployment

### Heroku Deployment:

```bash
# Login to Heroku
heroku login

# Create app
heroku create smart-waste-management-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main
```

### MongoDB Atlas (Cloud Database):

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## 🐛 Troubleshooting

### MongoDB Connection Error:
```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongodb  # Linux

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongodb  # Linux
```

### Port Already in Use:
```bash
# Change PORT in .env file
PORT=5001
```

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Mahesh Arunaladi**

---

**Made with ❤️ for cleaner cities**
