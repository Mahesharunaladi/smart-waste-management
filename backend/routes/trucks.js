const express = require('express');
const router = express.Router();
const Truck = require('../models/Truck');
const Activity = require('../models/Activity');

// @route   GET /api/trucks
// @desc    Get all trucks
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { status, zone } = req.query;
        let query = {};

        if (status) query.status = status;
        if (zone) query['route.zone'] = zone;

        const trucks = await Truck.find(query)
            .populate('route.assignedHouseholds', 'householdId name address')
            .sort({ truckId: 1 });

        res.json({
            success: true,
            count: trucks.length,
            trucks
        });
    } catch (error) {
        console.error('Get trucks error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   GET /api/trucks/:id
// @desc    Get single truck
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const truck = await Truck.findOne({ truckId: req.params.id.toUpperCase() })
            .populate('route.assignedHouseholds');

        if (!truck) {
            return res.status(404).json({ 
                success: false, 
                message: 'Truck not found' 
            });
        }

        res.json({
            success: true,
            truck
        });
    } catch (error) {
        console.error('Get truck error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   POST /api/trucks
// @desc    Create new truck
// @access  Private
router.post('/', async (req, res) => {
    try {
        const truck = new Truck(req.body);
        await truck.save();

        // Create activity
        await Activity.create({
            type: 'truck_status',
            title: `New truck added: ${truck.truckId}`,
            description: `Truck ${truck.truckId} has been added to the fleet`,
            icon: 'fa-truck',
            relatedTruck: truck._id
        });

        res.status(201).json({
            success: true,
            message: 'Truck created successfully',
            truck
        });
    } catch (error) {
        console.error('Create truck error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// @route   PUT /api/trucks/:id/location
// @desc    Update truck location
// @access  Private
router.put('/:id/location', async (req, res) => {
    try {
        const { coordinates, address } = req.body;

        const truck = await Truck.findOneAndUpdate(
            { truckId: req.params.id.toUpperCase() },
            {
                'location.coordinates': coordinates,
                'location.address': address
            },
            { new: true }
        );

        if (!truck) {
            return res.status(404).json({ 
                success: false, 
                message: 'Truck not found' 
            });
        }

        res.json({
            success: true,
            message: 'Location updated',
            truck
        });
    } catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   PUT /api/trucks/:id/status
// @desc    Update truck status
// @access  Private
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        const truck = await Truck.findOneAndUpdate(
            { truckId: req.params.id.toUpperCase() },
            { status },
            { new: true }
        );

        if (!truck) {
            return res.status(404).json({ 
                success: false, 
                message: 'Truck not found' 
            });
        }

        // Create activity
        await Activity.create({
            type: 'truck_status',
            title: `${truck.truckId} status changed`,
            description: `Truck status updated to ${status}`,
            icon: 'fa-info-circle',
            relatedTruck: truck._id
        });

        res.json({
            success: true,
            message: 'Status updated',
            truck
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   DELETE /api/trucks/:id
// @desc    Delete truck
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const truck = await Truck.findOneAndDelete({ 
            truckId: req.params.id.toUpperCase() 
        });

        if (!truck) {
            return res.status(404).json({ 
                success: false, 
                message: 'Truck not found' 
            });
        }

        res.json({
            success: true,
            message: 'Truck deleted successfully'
        });
    } catch (error) {
        console.error('Delete truck error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// @route   GET /api/trucks/track/by-phone/:phone
// @desc    Track truck by driver phone number (Live Tracking)
// @access  Public
router.get('/track/by-phone/:phone', async (req, res) => {
    try {
        const phone = req.params.phone.trim();
        
        if (!phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number is required' 
            });
        }

        // Find truck by driver phone number
        const truck = await Truck.findOne({ 'driver.phone': phone })
            .populate('route.assignedHouseholds', 'householdId name address location');

        if (!truck) {
            return res.status(404).json({ 
                success: false, 
                message: 'No truck found for this phone number',
                phone: phone
            });
        }

        // Prepare tracking data
        const trackingData = {
            truckId: truck.truckId,
            driverName: truck.driver.name,
            driverPhone: truck.driver.phone,
            status: truck.status,
            location: truck.location,
            address: truck.location.address,
            zone: truck.route.zone,
            currentCapacity: truck.capacity.current,
            maxCapacity: truck.capacity.max,
            totalWasteCollectedToday: truck.totalWasteCollectedToday,
            totalCollectionsToday: truck.totalCollectionsToday,
            assignedHouseholds: truck.route.assignedHouseholds,
            lastCollection: truck.lastCollection,
            isActive: truck.isActive,
            timestamp: new Date()
        };

        res.json({
            success: true,
            message: 'Truck tracking data retrieved',
            tracking: trackingData,
            truck: truck
        });
    } catch (error) {
        console.error('Track truck by phone error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/trucks/search/phone/:query
// @desc    Search trucks by driver phone number (for autocomplete)
// @access  Public
router.get('/search/phone/:query', async (req, res) => {
    try {
        const query = req.params.query.trim();
        
        if (!query || query.length < 2) {
            return res.status(400).json({ 
                success: false, 
                message: 'Query must be at least 2 characters',
                results: []
            });
        }

        // Search for trucks matching phone number pattern
        const trucks = await Truck.find({
            'driver.phone': { $regex: query, $options: 'i' }
        }).select('truckId driver.name driver.phone status location route.zone');

        const results = trucks.map(truck => ({
            truckId: truck.truckId,
            driverName: truck.driver.name,
            driverPhone: truck.driver.phone,
            status: truck.status,
            zone: truck.route.zone,
            location: truck.location
        }));

        res.json({
            success: true,
            count: results.length,
            results: results
        });
    } catch (error) {
        console.error('Search truck by phone error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            results: []
        });
    }
});

module.exports = router;
