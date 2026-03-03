const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['collection', 'truck_status', 'household_update', 'alert', 'system'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'fa-info-circle'
    },
    relatedTruck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck'
    },
    relatedHousehold: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'low'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
activitySchema.index({ createdAt: -1 });
activitySchema.index({ type: 1 });

module.exports = mongoose.model('Activity', activitySchema);
