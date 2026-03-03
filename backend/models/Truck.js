const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
    truckId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    driver: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String
        },
        license: {
            type: String
        }
    },
    status: {
        type: String,
        enum: ['active', 'idle', 'maintenance', 'offline'],
        default: 'idle'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        address: String
    },
    capacity: {
        current: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        max: {
            type: Number,
            default: 1000 // in kg
        }
    },
    route: {
        zone: {
            type: String,
            required: true
        },
        assignedHouseholds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Household'
        }]
    },
    lastCollection: {
        type: Date,
        default: Date.now
    },
    totalCollectionsToday: {
        type: Number,
        default: 0
    },
    totalWasteCollectedToday: {
        type: Number,
        default: 0 // in kg
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create geospatial index for location
truckSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Truck', truckSchema);
