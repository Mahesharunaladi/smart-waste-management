const express = require('express');
const router = express.Router();
const Household = require('../models/Household');
const Truck = require('../models/Truck');
const Activity = require('../models/Activity');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard statistics
// @access  Public
router.get('/dashboard', async (req, res) => {
    try {
        // Get counts
        const activeTrucks = await Truck.countDocuments({ status: 'active' });
        const totalHouseholds = await Household.countDocuments({ isActive: true });
        const compliantHouseholds = await Household.countDocuments({ status: 'compliant' });

        // Calculate total waste collected today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const households = await Household.find({});
        const totalWasteToday = households.reduce((sum, h) => sum + (h.wasteData.todayWaste || 0), 0);
        const totalWasteMonthly = households.reduce((sum, h) => sum + (h.wasteData.monthlyWaste || 0), 0);

        // Collections today
        const collectionsToday = await Activity.countDocuments({
            type: 'collection',
            createdAt: { $gte: today }
        });

        res.json({
            success: true,
            stats: {
                activeTrucks,
                totalHouseholds,
                compliantHouseholds,
                totalWasteToday: totalWasteToday.toFixed(2),
                totalWasteMonthly: totalWasteMonthly.toFixed(2),
                collectionsToday,
                complianceRate: ((compliantHouseholds / totalHouseholds) * 100).toFixed(1)
            }
        });
    } catch (error) {
        console.error('Dashboard analytics error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   GET /api/analytics/waste-trends
// @desc    Get waste collection trends
// @access  Public
router.get('/waste-trends', async (req, res) => {
    try {
        const { days = 7 } = req.query;
        
        // Get last N days data
        const trends = [];
        const today = new Date();

        for (let i = parseInt(days) - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const activities = await Activity.find({
                type: 'collection',
                createdAt: { $gte: date, $lt: nextDate }
            });

            const totalWaste = activities.reduce((sum, activity) => {
                return sum + (activity.metadata?.amount || 0);
            }, 0);

            trends.push({
                date: date.toISOString().split('T')[0],
                waste: totalWaste.toFixed(2)
            });
        }

        res.json({
            success: true,
            trends
        });
    } catch (error) {
        console.error('Waste trends error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   GET /api/analytics/compliance
// @desc    Get compliance statistics
// @access  Public
router.get('/compliance', async (req, res) => {
    try {
        const compliant = await Household.countDocuments({ status: 'compliant' });
        const pending = await Household.countDocuments({ status: 'pending' });
        const missed = await Household.countDocuments({ status: 'missed' });

        res.json({
            success: true,
            compliance: {
                compliant,
                pending,
                missed,
                total: compliant + pending + missed
            }
        });
    } catch (error) {
        console.error('Compliance error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   GET /api/analytics/leaderboard
// @desc    Get top contributing households
// @access  Public
router.get('/leaderboard', async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const leaderboard = await Household.find({ isActive: true })
            .sort({ 'wasteData.monthlyWaste': -1 })
            .limit(parseInt(limit))
            .select('householdId name address wasteData');

        res.json({
            success: true,
            leaderboard
        });
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

module.exports = router;
