const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
    householdId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        street: String,
        block: String,
        zone: String,
        city: {
            type: String,
            default: 'Bengaluru'
        },
        pincode: String
    },
    contact: {
        phone: {
            type: String,
            required: true
        },
        email: String,
        alternatePhone: String
    },
    residents: {
        type: Number,
        default: 1,
        min: 1
    },
    status: {
        type: String,
        enum: ['compliant', 'pending', 'missed', 'inactive'],
        default: 'pending'
    },
    wasteData: {
        lastDumpDate: Date,
        todayWaste: {
            type: Number,
            default: 0 // in kg
        },
        monthlyWaste: {
            type: Number,
            default: 0 // in kg
        },
        yearlyWaste: {
            type: Number,
            default: 0 // in kg
        }
    },
    collectionHistory: [{
        date: {
            type: Date,
            default: Date.now
        },
        amount: {
            type: Number,
            required: true // in kg
        },
        type: {
            type: String,
            enum: ['Mixed', 'Organic', 'Recyclable', 'Electronic', 'Hazardous'],
            default: 'Mixed'
        },
        collectedBy: {
            type: String
        },
        truckId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Truck'
        }
    }],
    assignedTruck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    notes: String
}, {
    timestamps: true
});

// Virtual for per capita waste
householdSchema.virtual('perCapitaWaste').get(function() {
    if (this.residents > 0 && this.wasteData.monthlyWaste > 0) {
        return (this.wasteData.monthlyWaste / 30 / this.residents).toFixed(2);
    }
    return 0;
});

// Method to add collection record
householdSchema.methods.addCollection = function(amount, type, collectedBy, truckId) {
    this.collectionHistory.push({
        amount,
        type,
        collectedBy,
        truckId
    });
    
    this.wasteData.todayWaste += amount;
    this.wasteData.monthlyWaste += amount;
    this.wasteData.yearlyWaste += amount;
    this.wasteData.lastDumpDate = new Date();
    this.status = 'compliant';
    
    return this.save();
};

module.exports = mongoose.model('Household', householdSchema);
