const express = require('express');
const router = express.Router();
const Household = require('../models/Household');
const Activity = require('../models/Activity');

// @route   GET /api/households
// @desc    Get all households
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { status, zone, search } = req.query;
        let query = {};

        if (status) query.status = status;
        if (zone) query['address.zone'] = zone;
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { householdId: new RegExp(search, 'i') },
                { 'address.street': new RegExp(search, 'i') }
            ];
        }

        const households = await Household.find(query)
            .populate('assignedTruck', 'truckId driver status')
            .sort({ householdId: 1 });

        res.json({
            success: true,
            count: households.length,
            households
        });
    } catch (error) {
        console.error('Get households error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   GET /api/households/:id
// @desc    Get single household
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const household = await Household.findOne({ 
            householdId: req.params.id.toUpperCase() 
        })
        .populate('assignedTruck')
        .populate('collectionHistory.truckId', 'truckId driver');

        if (!household) {
            return res.status(404).json({ 
                success: false, 
                message: 'Household not found' 
            });
        }

        res.json({
            success: true,
            household
        });
    } catch (error) {
        console.error('Get household error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   POST /api/households
// @desc    Create new household
// @access  Private
router.post('/', async (req, res) => {
    try {
        const household = new Household(req.body);
        await household.save();

        // Create activity
        await Activity.create({
            type: 'household_update',
            title: `New household registered: ${household.name}`,
            description: `Household ${household.householdId} added to the system`,
            icon: 'fa-home',
            relatedHousehold: household._id
        });

        res.status(201).json({
            success: true,
            message: 'Household created successfully',
            household
        });
    } catch (error) {
        console.error('Create household error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// @route   POST /api/households/:id/collect
// @desc    Record waste collection
// @access  Private
router.post('/:id/collect', async (req, res) => {
    try {
        const { amount, type, collectedBy, truckId } = req.body;

        const household = await Household.findOne({ 
            householdId: req.params.id.toUpperCase() 
        });

        if (!household) {
            return res.status(404).json({ 
                success: false, 
                message: 'Household not found' 
            });
        }

        await household.addCollection(amount, type, collectedBy, truckId);

        // Create activity
        await Activity.create({
            type: 'collection',
            title: `Waste collected from ${household.name}`,
            description: `${amount} kg of ${type} waste collected`,
            icon: 'fa-check-circle',
            relatedHousehold: household._id,
            relatedTruck: truckId,
            metadata: { amount, type }
        });

        res.json({
            success: true,
            message: 'Collection recorded successfully',
            household
        });
    } catch (error) {
        console.error('Record collection error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   PUT /api/households/:id
// @desc    Update household
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const household = await Household.findOneAndUpdate(
            { householdId: req.params.id.toUpperCase() },
            req.body,
            { new: true, runValidators: true }
        );

        if (!household) {
            return res.status(404).json({ 
                success: false, 
                message: 'Household not found' 
            });
        }

        res.json({
            success: true,
            message: 'Household updated successfully',
            household
        });
    } catch (error) {
        console.error('Update household error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   DELETE /api/households/:id
// @desc    Delete household
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const household = await Household.findOneAndDelete({ 
            householdId: req.params.id.toUpperCase() 
        });

        if (!household) {
            return res.status(404).json({ 
                success: false, 
                message: 'Household not found' 
            });
        }

        res.json({
            success: true,
            message: 'Household deleted successfully'
        });
    } catch (error) {
        console.error('Delete household error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

module.exports = router;
