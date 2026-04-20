const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    driverId: {
        type: String,
        required: true,
        index: true
    },
    truckId: {
        type: String,
        required: true
    },
    driverName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['LOGIN', 'LOGOUT'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    date: {
        type: String,
        required: true,
        index: true
    },
    time: {
        type: String,
        required: true
    },
    faceVerified: {
        type: Boolean,
        default: true
    },
    ipAddress: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
        }
    },
    duration: String, // For logout: time spent
    remarks: String
}, {
    timestamps: true
});

// Compound index for efficient querying
attendanceSchema.index({ driverId: 1, date: 1 });
attendanceSchema.index({ driverId: 1, timestamp: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
