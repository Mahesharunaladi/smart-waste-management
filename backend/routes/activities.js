const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// @route   GET /api/activities
// @desc    Get recent activities
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { limit = 20, type } = req.query;
        let query = {};

        if (type) query.type = type;

        const activities = await Activity.find(query)
            .populate('relatedTruck', 'truckId driver')
            .populate('relatedHousehold', 'householdId name')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: activities.length,
            activities
        });
    } catch (error) {
        console.error('Get activities error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   POST /api/activities
// @desc    Create new activity
// @access  Private
router.post('/', async (req, res) => {
    try {
        const activity = new Activity(req.body);
        await activity.save();

        res.status(201).json({
            success: true,
            message: 'Activity created successfully',
            activity
        });
    } catch (error) {
        console.error('Create activity error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// @route   PUT /api/activities/:id/read
// @desc    Mark activity as read
// @access  Private
router.put('/:id/read', async (req, res) => {
    try {
        const activity = await Activity.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!activity) {
            return res.status(404).json({ 
                success: false, 
                message: 'Activity not found' 
            });
        }

        res.json({
            success: true,
            activity
        });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

module.exports = router;
