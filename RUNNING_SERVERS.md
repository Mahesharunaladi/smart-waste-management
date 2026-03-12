# Running Servers Guide

## Current Server Status

### ✅ Backend Server (Running)
- **Port:** 3001
- **URL:** http://localhost:3001/api
- **Status:** Running with MongoDB connection
- **Start Command:** 
  ```bash
  cd backend && npm start
  ```

### ✅ Frontend Server (Running)
- **Port:** 3000
- **URL:** http://localhost:3000
- **Status:** Running Python HTTP Server
- **Start Command:**
  ```bash
  cd frontend && python3 -m http.server 3000
  ```

### ✅ MongoDB (Running)
- **Port:** 27017 (default)
- **Database:** smart-waste-management
- **Status:** Running

## How to Start All Servers

### Option 1: Using the start script
```bash
./start.sh
```

### Option 2: Manual Start

1. **Start MongoDB** (if not running):
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Or manually
   mongod --dbpath /path/to/data
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   npm install  # First time only
   npm start
   ```
   Backend will run on: http://localhost:3001

3. **Start Frontend Server**:
   ```bash
   cd frontend
   python3 -m http.server 3000
   ```
   Frontend will run on: http://localhost:3000

## Access Points

- **Main Website:** http://localhost:3000/index.html
- **Login Page:** http://localhost:3000/login.html
- **Dashboard:** http://localhost:3000/dashboard.html
- **Backend API:** http://localhost:3001/api

## Test Login Credentials

Use any of these admin accounts to test:

1. **System Administrator**
   - Admin ID: `ADMIN001`
   - Password: `admin123`

2. **Operations Manager**
   - Admin ID: `ADMIN002`
   - Password: `ops123`

3. **Analytics Manager**
   - Admin ID: `ADMIN003`
   - Password: `analytics123`

4. **Fleet Manager**
   - Admin ID: `ADMIN004`
   - Password: `fleet123`

## Troubleshooting

### Error: Connection Refused
- **Cause:** Backend server is not running
- **Solution:** Start the backend server (see above)

### Error: Failed to fetch
- **Cause:** Backend server is not accessible or CORS issue
- **Solution:** 
  1. Check if backend is running on port 3001
  2. Check MongoDB is running
  3. Restart backend server

### Error: MongoDB Connection Failed
- **Cause:** MongoDB is not running
- **Solution:** Start MongoDB service

### Port Already in Use
- **Backend (3001):**
  ```bash
  lsof -ti:3001 | xargs kill -9
  ```
- **Frontend (3000):**
  ```bash
  lsof -ti:3000 | xargs kill -9
  ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin info
- `POST /api/auth/logout` - Logout

### Trucks
- `GET /api/trucks` - Get all trucks
- `GET /api/trucks/:id` - Get truck by ID
- `PUT /api/trucks/:id` - Update truck
- `POST /api/trucks` - Create truck

### Households
- `GET /api/households` - Get all households
- `GET /api/households/:id` - Get household by ID
- `PUT /api/households/:id` - Update household

### Activities
- `GET /api/activities` - Get recent activities
- `POST /api/activities` - Log new activity

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/trends` - Get trend data

## Notes

- Backend runs on port **3001** (configured in backend/.env)
- Frontend runs on port **3000** (Python HTTP server)
- MongoDB runs on default port **27017**
- All servers must be running for full functionality
- The dashboard requires login authentication
