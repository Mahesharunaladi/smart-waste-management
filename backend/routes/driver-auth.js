const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Sample driver credentials (in production, fetch from database)
const DRIVERS = {
    'D001': {
        name: 'Ramesh Kumar',
        truckId: 'T001',
        password: 'driver123', // hashed in production
        phone: '9742583104'
    },
    'D002': {
        name: 'Ravi Singh',
        truckId: 'T002',
        password: 'driver123',
        phone: '9876543211'
    },
    'D003': {
        name: 'Yallappa',
        truckId: 'T003',
        password: 'driver123',
        phone: '9880272001'
    },
    'D004': {
        name: 'Pradeep Kumar',
        truckId: 'T004',
        password: 'driver123',
        phone: '9876543213'
    }
};

// @route   POST /api/auth/driver-login
// @desc    Driver login with ID and password
// @access  Public
router.post('/driver-login', async (req, res) => {
    try {
        const { driverId, truckId, password } = req.body;

        // Validate input
        if (!driverId || !truckId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Driver ID, Truck ID, and password are required'
            });
        }

        // Check if driver exists
        const driver = DRIVERS[driverId];
        if (!driver) {
            return res.status(401).json({
                success: false,
                message: 'Invalid driver ID'
            });
        }

        // Check if truck matches
        if (driver.truckId !== truckId) {
            return res.status(401).json({
                success: false,
                message: 'This truck is not assigned to this driver'
            });
        }

        // Check password (in production, use bcrypt.compare)
        if (driver.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                driverId: driverId,
                truckId: truckId,
                name: driver.name,
                timestamp: new Date()
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '8h' }
        );

        // Create session
        const session = {
            driverId: driverId,
            truckId: truckId,
            loginTime: new Date(),
            token: token
        };

        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            driver: {
                id: driverId,
                name: driver.name,
                truckId: truckId,
                phone: driver.phone
            },
            session: session
        });

    } catch (error) {
        console.error('Driver login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/face-recognition-login
// @desc    Complete face recognition login
// @access  Private
router.post('/face-recognition-login', async (req, res) => {
    try {
        const { driverId, truckId, faceData } = req.body;

        if (!driverId || !truckId || !faceData) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create login record
        const loginRecord = {
            driverId: driverId,
            truckId: truckId,
            type: 'LOGIN',
            faceVerified: true,
            qrVerified: true,
            timestamp: new Date(),
            status: 'active'
        };

        // TODO: Save to database Activity collection

        res.json({
            success: true,
            message: 'Face recognition login successful',
            record: loginRecord
        });

    } catch (error) {
        console.error('Face recognition login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/face-recognition-logout
// @desc    Complete face recognition logout
// @access  Private
router.post('/face-recognition-logout', async (req, res) => {
    try {
        const { driverId, truckId, faceData, shiftDuration } = req.body;

        if (!driverId || !truckId || !faceData) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create logout record
        const logoutRecord = {
            driverId: driverId,
            truckId: truckId,
            type: 'LOGOUT',
            faceVerified: true,
            timestamp: new Date(),
            shiftDuration: shiftDuration,
            status: 'completed'
        };

        // TODO: Save to database Activity collection

        res.json({
            success: true,
            message: 'Face recognition logout successful',
            record: logoutRecord
        });

    } catch (error) {
        console.error('Face recognition logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/qr-verification
// @desc    Verify QR code on truck
// @access  Private
router.post('/qr-verification', async (req, res) => {
    try {
        const { qrData, truckId, driverId } = req.body;

        if (!qrData || !truckId) {
            return res.status(400).json({
                success: false,
                message: 'Missing QR data or truck ID'
            });
        }

        // Verify QR format: TRUCK_T001_VERIFIED
        const isValid = qrData.includes(truckId);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'QR code does not match truck'
            });
        }

        res.json({
            success: true,
            message: 'QR verification successful',
            truckId: truckId,
            verified: true,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('QR verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/auth/driver-session/:token
// @desc    Get driver session info
// @access  Private
router.get('/driver-session/:token', async (req, res) => {
    try {
        const token = req.params.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        res.json({
            success: true,
            session: {
                driverId: decoded.driverId,
                truckId: decoded.truckId,
                name: decoded.name,
                loginTime: decoded.timestamp,
                isActive: true
            }
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
});

module.exports = router;
