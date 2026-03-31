const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const driverAuthRoutes = require('./routes/driver-auth');
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
    // Initialize sample data
    initializeSampleData();
})
.catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', driverAuthRoutes);
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

// Initialize sample data for demo
async function initializeSampleData() {
    const Truck = require('./models/Truck');
    const Household = require('./models/Household');

    // Initialize trucks
    const trucks = [
        {
            truckId: 'T001',
            driver: { name: 'Ramesh Kumar', phone: '9876543210' },
            status: 'active',
            location: { type: 'Point', coordinates: [76.6553, 12.3051] }, // [lng, lat]
            capacity: { current: 24, max: 1000 },
            route: { zone: 'Jayanagar' },
            totalWasteCollectedToday: 245
        },
        {
            truckId: 'T002',
            driver: { name: 'Suresh Babu', phone: '9876543211' },
            status: 'active',
            location: { type: 'Point', coordinates: [76.6590, 12.3110] },
            capacity: { current: 19, max: 1000 },
            route: { zone: 'Kuvempunagar' },
            totalWasteCollectedToday: 189
        },
        {
            truckId: 'T003',
            driver: { name: 'Yallappa', phone: '9876543212' },
            status: 'idle',
            location: { type: 'Point', coordinates: [76.6394, 12.2958] },
            capacity: { current: 0, max: 1000 },
            route: { zone: 'Depot' },
            totalWasteCollectedToday: 0
        },
        {
            truckId: 'T004',
            driver: { name: 'Ravi Shankar', phone: '9876543213' },
            status: 'active',
            location: { type: 'Point', coordinates: [76.6450, 12.3200] },
            capacity: { current: 31, max: 1000 },
            route: { zone: 'Vijayanagar' },
            totalWasteCollectedToday: 312
        }
    ];

    for (const truckData of trucks) {
        try {
            const existingTruck = await Truck.findOne({ truckId: truckData.truckId });
            if (!existingTruck) {
                const truck = new Truck(truckData);
                await truck.save();
                console.log(`✅ Created truck: ${truckData.truckId}`);
            }
        } catch (error) {
            console.error(`Error creating truck ${truckData.truckId}:`, error.message);
        }
    }

    // Initialize households
    const households = [
        { householdId: 'H001', name: 'Rajesh Family', address: { street: 'House #12, 1st Main', zone: 'Jayanagar' }, location: { type: 'Point', coordinates: [76.6553, 12.3051] }, contact: { phone: '9876543214' }, status: 'compliant', wasteData: { todayWaste: 2.5 } },
        { householdId: 'H002', name: 'Priya Household', address: { street: 'House #15, 1st Main', zone: 'Jayanagar' }, location: { type: 'Point', coordinates: [76.6555, 12.3053] }, contact: { phone: '9876543215' }, status: 'compliant', wasteData: { todayWaste: 2.2 } },
        { householdId: 'H003', name: 'Kumar Residence', address: { street: 'House #18, 2nd Cross', zone: 'Jayanagar' }, location: { type: 'Point', coordinates: [76.6551, 12.3049] }, contact: { phone: '9876543216' }, status: 'missed', wasteData: { todayWaste: 0 } },
        { householdId: 'H004', name: 'Lakshmi House', address: { street: 'House #21, 2nd Cross', zone: 'Jayanagar' }, location: { type: 'Point', coordinates: [76.6557, 12.3055] }, contact: { phone: '9876543217' }, status: 'compliant', wasteData: { todayWaste: 1.8 } },
        { householdId: 'H005', name: 'Venkatesh Home', address: { street: 'House #25, 3rd Main', zone: 'Jayanagar' }, location: { type: 'Point', coordinates: [76.6549, 12.3047] }, contact: { phone: '9876543218' }, status: 'missed', wasteData: { todayWaste: 0 } },
        { householdId: 'H006', name: 'Suresh Villa', address: { street: 'House #30, 4th Main', zone: 'Jayanagar' }, location: { type: 'Point', coordinates: [76.6559, 12.3059] }, contact: { phone: '9876543219' }, status: 'pending', wasteData: { todayWaste: 0 } },
        { householdId: 'H007', name: 'Meera Cottage', address: { street: 'House #35, 5th Cross', zone: 'Jayanagar' }, location: { type: 'Point', coordinates: [76.6547, 12.3045] }, contact: { phone: '9876543220' }, status: 'pending', wasteData: { todayWaste: 0 } },
        { householdId: 'H011', name: 'Sharma Family', address: { street: 'House #5, Block A', zone: 'Kuvempunagar' }, location: { type: 'Point', coordinates: [76.6590, 12.3110] }, contact: { phone: '9876543221' }, status: 'compliant', wasteData: { todayWaste: 2.1 } },
        { householdId: 'H012', name: 'Patel Household', address: { street: 'House #8, Block A', zone: 'Kuvempunagar' }, location: { type: 'Point', coordinates: [76.6592, 12.3112] }, contact: { phone: '9876543222' }, status: 'compliant', wasteData: { todayWaste: 2.8 } },
        { householdId: 'H013', name: 'Gupta Residence', address: { street: 'House #12, Block B', zone: 'Kuvempunagar' }, location: { type: 'Point', coordinates: [76.6588, 12.3108] }, contact: { phone: '9876543223' }, status: 'missed', wasteData: { todayWaste: 0 } },
        { householdId: 'H014', name: 'Singh Family', address: { street: 'House #15, Block B', zone: 'Kuvempunagar' }, location: { type: 'Point', coordinates: [76.6594, 12.3114] }, contact: { phone: '9876543224' }, status: 'compliant', wasteData: { todayWaste: 3.5 } },
        { householdId: 'H015', name: 'Mehta House', address: { street: 'House #20, Block C', zone: 'Kuvempunagar' }, location: { type: 'Point', coordinates: [76.6586, 12.3106] }, contact: { phone: '9876543225' }, status: 'missed', wasteData: { todayWaste: 0 } },
        { householdId: 'H016', name: 'Verma Mansion', address: { street: 'House #25, Block D', zone: 'Kuvempunagar' }, location: { type: 'Point', coordinates: [76.6596, 12.3116] }, contact: { phone: '9876543226' }, status: 'pending', wasteData: { todayWaste: 0 } },
        { householdId: 'H021', name: 'Krishna Home', address: { street: 'House #3, MG Road', zone: 'Vijayanagar' }, location: { type: 'Point', coordinates: [76.6450, 12.3200] }, contact: { phone: '9876543227' }, status: 'compliant', wasteData: { todayWaste: 4.2 } },
        { householdId: 'H022', name: 'Radha Residence', address: { street: 'House #7, MG Road', zone: 'Vijayanagar' }, location: { type: 'Point', coordinates: [76.6452, 12.3202] }, contact: { phone: '9876543228' }, status: 'compliant', wasteData: { todayWaste: 3.1 } },
        { householdId: 'H023', name: 'Bharath House', address: { street: 'House #11, KC Road', zone: 'Vijayanagar' }, location: { type: 'Point', coordinates: [76.6448, 12.3198] }, contact: { phone: '9876543229' }, status: 'missed', wasteData: { todayWaste: 0 } },
        { householdId: 'H024', name: 'Arjun Family', address: { street: 'House #14, KC Road', zone: 'Vijayanagar' }, location: { type: 'Point', coordinates: [76.6454, 12.3204] }, contact: { phone: '9876543230' }, status: 'compliant', wasteData: { todayWaste: 2.9 } },
        { householdId: 'H025', name: 'Kavya Home', address: { street: 'House #18, JC Road', zone: 'Vijayanagar' }, location: { type: 'Point', coordinates: [76.6446, 12.3196] }, contact: { phone: '9876543231' }, status: 'missed', wasteData: { todayWaste: 0 } },
        { householdId: 'H026', name: 'Rama Villa', address: { street: 'House #22, LC Road', zone: 'Vijayanagar' }, location: { type: 'Point', coordinates: [76.6456, 12.3206] }, contact: { phone: '9876543232' }, status: 'pending', wasteData: { todayWaste: 0 } },
        { householdId: 'H031', name: 'Ravi Kumar', address: { street: 'House #9, Main Road', zone: 'Saraswathipuram' }, location: { type: 'Point', coordinates: [76.6410, 12.2980] }, contact: { phone: '9876543233' }, status: 'compliant', wasteData: { todayWaste: 2.3 } },
        { householdId: 'H032', name: 'Anita Sharma', address: { street: 'House #13, 1st Cross', zone: 'Saraswathipuram' }, location: { type: 'Point', coordinates: [76.6412, 12.2982] }, contact: { phone: '9876543234' }, status: 'compliant', wasteData: { todayWaste: 2.7 } },
        { householdId: 'H033', name: 'Mohan Lal', address: { street: 'House #16, 2nd Cross', zone: 'Saraswathipuram' }, location: { type: 'Point', coordinates: [76.6408, 12.2978] }, contact: { phone: '9876543235' }, status: 'missed', wasteData: { todayWaste: 0 } },
        { householdId: 'H034', name: 'Sunita Devi', address: { street: 'House #22, 3rd Cross', zone: 'Saraswathipuram' }, location: { type: 'Point', coordinates: [76.6414, 12.2984] }, contact: { phone: '9876543236' }, status: 'compliant', wasteData: { todayWaste: 3.4 } },
        { householdId: 'H035', name: 'Rajendra Prasad', address: { street: 'House #28, 4th Main', zone: 'Saraswathipuram' }, location: { type: 'Point', coordinates: [76.6406, 12.2976] }, contact: { phone: '9876543237' }, status: 'missed', wasteData: { todayWaste: 0 } },
        { householdId: 'H036', name: 'Kiran House', address: { street: 'House #32, 5th Cross', zone: 'Saraswathipuram' }, location: { type: 'Point', coordinates: [76.6416, 12.2986] }, contact: { phone: '9876543238' }, status: 'pending', wasteData: { todayWaste: 0 } }
    ];

    for (const householdData of households) {
        try {
            const existingHousehold = await Household.findOne({ householdId: householdData.householdId });
            if (!existingHousehold) {
                const household = new Household(householdData);
                await household.save();
                console.log(`✅ Created household: ${householdData.householdId}`);
            }
        } catch (error) {
            console.error(`Error creating household ${householdData.householdId}:`, error.message);
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
