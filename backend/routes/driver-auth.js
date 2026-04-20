const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Attendance = require('../models/Attendance');

// Sample driver credentials with attendance details (in production, fetch from database)
const DRIVERS = {
    'D001': {
        name: 'Ramesh Kumar',
        truckId: 'T001',
        password: 'driver123', // hashed in production
        phone: '9742583104',
        aadharNumber: '1234-5678-9101-1121',
        gender: 'Male',
        caste: 'OBC',
        email: 'ramesh@smartwaste.com'
    },
    'D002': {
        name: 'Ravi Singh',
        truckId: 'T002',
        password: 'driver123',
        phone: '9876543211',
        aadharNumber: '2345-6789-0112-1314',
        gender: 'Male',
        caste: 'General',
        email: 'ravi@smartwaste.com'
    },
    'D003': {
        name: 'Yallappa',
        truckId: 'T003',
        password: 'driver123',
        phone: '9880272001',
        aadharNumber: '3456-7890-1112-1516',
        gender: 'Male',
        caste: 'SC',
        email: 'yallappa@smartwaste.com'
    },
    'D004': {
        name: 'Pradeep Kumar',
        truckId: 'T004',
        password: 'driver123',
        phone: '9876543213',
        aadharNumber: '4567-8901-1112-1718',
        gender: 'Male',
        caste: 'ST',
        email: 'pradeep@smartwaste.com'
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
                phone: driver.phone,
                aadharNumber: driver.aadharNumber,
                gender: driver.gender,
                caste: driver.caste,
                email: driver.email
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

// @route   POST /api/auth/attendance/login
// @desc    Record driver login with face recognition
// @access  Public
router.post('/attendance/login', async (req, res) => {
    try {
        const { driverId, truckId, driverName, time, date, faceVerified, location } = req.body;

        if (!driverId || !truckId || !driverName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if driver already logged in today
        const existingLogin = await Attendance.findOne({
            driverId: driverId,
            date: date,
            type: 'LOGIN'
        });

        if (existingLogin) {
            return res.status(400).json({
                success: false,
                message: 'Driver already logged in today'
            });
        }

        // Create attendance record
        const attendance = new Attendance({
            driverId: driverId,
            truckId: truckId,
            driverName: driverName,
            type: 'LOGIN',
            timestamp: new Date(),
            date: date,
            time: time,
            faceVerified: faceVerified || true,
            location: location,
            ipAddress: req.ip
        });

        await attendance.save();

        res.status(201).json({
            success: true,
            message: 'Login recorded successfully',
            attendance: attendance
        });

    } catch (error) {
        console.error('Attendance login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   POST /api/auth/attendance/logout
// @desc    Record driver logout with face recognition
// @access  Public
router.post('/attendance/logout', async (req, res) => {
    try {
        const { driverId, truckId, driverName, time, date, duration, faceVerified, location } = req.body;

        if (!driverId || !truckId || !driverName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Get today's login record
        const loginRecord = await Attendance.findOne({
            driverId: driverId,
            date: date,
            type: 'LOGIN'
        });

        if (!loginRecord) {
            return res.status(400).json({
                success: false,
                message: 'No login record found for today'
            });
        }

        // Create logout record
        const attendance = new Attendance({
            driverId: driverId,
            truckId: truckId,
            driverName: driverName,
            type: 'LOGOUT',
            timestamp: new Date(),
            date: date,
            time: time,
            duration: duration,
            faceVerified: faceVerified || true,
            location: location,
            ipAddress: req.ip
        });

        await attendance.save();

        res.status(201).json({
            success: true,
            message: 'Logout recorded successfully',
            attendance: attendance,
            workDuration: duration
        });

    } catch (error) {
        console.error('Attendance logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/auth/attendance/:driverId/:date
// @desc    Get driver attendance for a specific date
// @access  Public
router.get('/attendance/:driverId/:date', async (req, res) => {
    try {
        const { driverId, date } = req.params;

        const records = await Attendance.find({
            driverId: driverId,
            date: date
        }).sort({ timestamp: 1 });

        if (records.length === 0) {
            return res.json({
                success: true,
                message: 'No attendance records found',
                records: [],
                summary: {
                    present: false,
                    workHours: '0h 0m'
                }
            });
        }

        // Calculate work hours
        const login = records.find(r => r.type === 'LOGIN');
        const logout = records.find(r => r.type === 'LOGOUT');

        let workHours = '0h 0m';
        if (login && logout) {
            const diff = new Date(logout.timestamp) - new Date(login.timestamp);
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            workHours = `${hours}h ${minutes}m`;
        }

        res.json({
            success: true,
            records: records,
            summary: {
                present: records.length > 0,
                loginTime: login ? login.time : null,
                logoutTime: logout ? logout.time : null,
                workHours: workHours
            }
        });

    } catch (error) {
        console.error('Get attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/auth/attendance/monthly/:driverId/:month/:year
// @desc    Get driver attendance for a month
// @access  Public
router.get('/attendance/monthly/:driverId/:month/:year', async (req, res) => {
    try {
        const { driverId, month, year } = req.params;
        const monthStart = new Date(`${year}-${month}-01`).toLocaleDateString();
        const monthEnd = new Date(year, month, 0).toLocaleDateString();

        const records = await Attendance.find({
            driverId: driverId,
            date: {
                $gte: monthStart,
                $lte: monthEnd
            }
        }).sort({ timestamp: 1 });

        // Group by date
        const groupedByDate = {};
        records.forEach(record => {
            if (!groupedByDate[record.date]) {
                groupedByDate[record.date] = [];
            }
            groupedByDate[record.date].push(record);
        });

        // Calculate stats
        const totalDays = Object.keys(groupedByDate).length;
        let totalHours = 0;

        Object.values(groupedByDate).forEach(dayRecords => {
            const login = dayRecords.find(r => r.type === 'LOGIN');
            const logout = dayRecords.find(r => r.type === 'LOGOUT');
            if (login && logout) {
                const diff = new Date(logout.timestamp) - new Date(login.timestamp);
                totalHours += diff / (1000 * 60 * 60);
            }
        });

        res.json({
            success: true,
            records: groupedByDate,
            stats: {
                totalDays: totalDays,
                totalHours: totalHours.toFixed(1),
                averageHours: (totalDays > 0 ? (totalHours / totalDays).toFixed(1) : 0)
            }
        });

    } catch (error) {
        console.error('Get monthly attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
