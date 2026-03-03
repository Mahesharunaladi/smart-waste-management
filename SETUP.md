# 🚀 Complete Setup Guide - Smart Waste Management System

This guide will help you set up and run the complete Smart Waste Management System with both frontend and backend.

## 📋 System Requirements

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **Python 3** (for frontend server)
- **Modern Web Browser**

## 🔧 Step-by-Step Setup

### Step 1: Install MongoDB

#### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Verify MongoDB is Running:
```bash
# Check status
brew services list | grep mongodb  # macOS
sudo systemctl status mongod        # Linux

# Or check if process is running
ps aux | grep mongod
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- express-validator
- morgan

### Step 3: Configure Environment Variables

The `.env` file is already created in the `backend` directory. Review and update if needed:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart-waste-management
JWT_SECRET=your-secret-key-change-this-in-production-2026
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:8000
```

### Step 4: Start the Backend Server

```bash
# From backend directory
npm start

# OR for development with auto-reload
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
📊 Environment: development
🌐 API URL: http://localhost:5000/api
✅ MongoDB Connected Successfully
✅ Created admin: ADMIN001 - Super Administrator
✅ Created admin: ADMIN002 - Operations Manager
✅ Created admin: ADMIN003 - Analytics Manager
✅ Created admin: ADMIN004 - Fleet Manager
```

### Step 5: Start the Frontend Server

Open a **new terminal** window and run:

```bash
# From project root directory
python3 -m http.server 8000
```

Expected output:
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

## 🌐 Access the Application

1. **Login Page**: http://localhost:8000/login.html
2. **Main Dashboard**: http://localhost:8000/index.html
3. **Backend API**: http://localhost:5000/api
4. **API Health Check**: http://localhost:5000/api/health

## 👥 Admin Login Credentials

Use these credentials to log in:

### 🔑 Admin Accounts

| Role | Admin ID | Password | Access Level |
|------|----------|----------|--------------|
| Super Administrator | ADMIN001 | admin123 | Full System Access |
| Operations Manager | ADMIN002 | ops123 | Trucks, Households, Analytics |
| Analytics Manager | ADMIN003 | analytics123 | Analytics, Households, Reports |
| Fleet Manager | ADMIN004 | fleet123 | Trucks, Routes |

## 📝 Testing the Setup

### 1. Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Login test
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"adminId":"ADMIN001","password":"admin123"}'
```

### 2. Test Frontend
1. Open http://localhost:8000/login.html
2. Click on "Super Administrator" card
3. Click "Login" button
4. You should be redirected to the dashboard

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Connection Error
**Error**: `MongoDB Connection Error: connect ECONNREFUSED`

**Solution**:
```bash
# Check if MongoDB is running
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Issue 2: Port Already in Use
**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in backend/.env
PORT=5001
```

### Issue 3: Frontend Can't Connect to Backend
**Error**: `Unable to connect to server`

**Solution**:
1. Verify backend is running on port 5000
2. Check CORS settings in backend/server.js
3. Ensure CLIENT_URL in .env matches frontend URL

### Issue 4: npm install fails
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 🔄 Starting/Stopping Services

### Start All Services (Quick Method):
```bash
# Make script executable (first time only)
chmod +x start.sh

# Run start script
./start.sh
```

### Start Services Manually:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
python3 -m http.server 8000
```

### Stop Services:
- Press `Ctrl + C` in each terminal

## 📊 Verify Everything is Working

### Checklist:
- [ ] MongoDB is running
- [ ] Backend server started successfully on port 5000
- [ ] Frontend server started on port 8000
- [ ] Can access login page at http://localhost:8000/login.html
- [ ] Can login with ADMIN001/admin123
- [ ] Dashboard loads with statistics
- [ ] Can navigate to Truck Tracking section
- [ ] Map loads with truck markers

## 🔐 Security Notes

⚠️ **Important**: The default passwords are for **DEVELOPMENT ONLY**

For production:
1. Change all admin passwords
2. Update JWT_SECRET in .env
3. Use environment-specific .env files
4. Enable HTTPS
5. Implement rate limiting
6. Add input sanitization

## 📚 Next Steps

1. **Explore the Dashboard**: View real-time statistics
2. **Track Trucks**: See live truck locations on map
3. **Manage Households**: View and update household profiles
4. **View Analytics**: Check waste collection trends
5. **Test API**: Use Postman or curl to test API endpoints

## 🆘 Need Help?

If you encounter issues:
1. Check the error messages in terminal
2. Review backend/README.md for API documentation
3. Verify all prerequisites are installed
4. Ensure MongoDB is running
5. Check port availability

## 📞 Support

For issues or questions:
- Check the documentation in `backend/README.md`
- Review console logs for errors
- Ensure all dependencies are installed

---

**Happy Coding! 🎉**

Made with ❤️ for a cleaner, smarter future 🌱♻️
