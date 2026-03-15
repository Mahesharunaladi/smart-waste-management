const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const truckRoutes = require('./routes/trucks');
const householdRoutes = require('./routes/households');
const activityRoutes = require('./routes/activities');
const analyticsRoutes = require('./routes/analytics');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ MongoDB Connected Successfully');
    // Initialize default admin accounts
    initializeAdmins();
})
.catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Smart Waste Management API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Initialize default admin accounts
async function initializeAdmins() {
    const Admin = require('./models/Admin');
    const admins = [
        {
            adminId: 'ADMIN001',
            name: 'Super Administrator',
            email: 'admin@smartwaste.com',
            password: 'admin123',
            role: 'super_admin',
            permissions: ['all']
        },
        {
            adminId: 'ADMIN002',
            name: 'Operations Manager',
            email: 'operations@smartwaste.com',
            password: 'ops123',
            role: 'operations',
            permissions: ['trucks', 'households', 'analytics']
        },
        {
            adminId: 'ADMIN003',
            name: 'Analytics Manager',
            email: 'analytics@smartwaste.com',
            password: 'analytics123',
            role: 'analytics',
            permissions: ['analytics', 'households', 'reports']
        },
        {
            adminId: 'ADMIN004',
            name: 'Fleet Manager',
            email: 'fleet@smartwaste.com',
            password: 'fleet123',
            role: 'fleet',
            permissions: ['trucks', 'routes']
        }
    ];

    for (const adminData of admins) {
        try {
            const existingAdmin = await Admin.findOne({ adminId: adminData.adminId });
            if (!existingAdmin) {
                const admin = new Admin(adminData);
                await admin.save();
                console.log(`✅ Created admin: ${adminData.adminId} - ${adminData.name}`);
            }
        } catch (error) {
            console.error(`Error creating admin ${adminData.adminId}:`, error.message);
        }
    }
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 API URL: http://localhost:${PORT}/api`);
});

module.exports = app;
