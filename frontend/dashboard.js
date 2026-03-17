// Check authentication on page load
if (!localStorage.getItem('token')) {
    // No token found, redirect to login
    window.location.href = 'login.html';
}

// Initialize Map
let map;
let markers = {
    trucks: [],
    houses: []
};

// Data variables - will be loaded from API
let trucksData = [];
let coloniesData = [];
let householdsData = [];

// API base URL
const API_BASE = 'http://localhost:3001/api';

// Get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// Load data from API
async function loadData() {
    try {
        // Load trucks
        const trucksResponse = await fetch(`${API_BASE}/trucks`, {
            headers: getAuthHeaders()
        });
        const trucksResult = await trucksResponse.json();
        if (trucksResult.success) {
            trucksData = trucksResult.trucks.map(truck => ({
                id: truck.truckId,
                name: `Truck ${truck.truckId}`,
                truckNumber: truck.truckId, // Assuming truckId is the registration
                registrationNumber: truck.truckId,
                status: truck.status,
                location: truck.location?.coordinates || [12.3051, 76.6553], // Default Mysuru
                wasteCollected: truck.totalWasteCollectedToday || 0,
                currentColony: truck.route?.zone || 'Unknown',
                driver: truck.driver?.name || 'Unknown',
                driverPhone: truck.driver?.phone || 'N/A'
            }));
        }

        // Load households/colonies
        const householdsResponse = await fetch(`${API_BASE}/households`, {
            headers: getAuthHeaders()
        });
        const householdsResult = await householdsResponse.json();
        if (householdsResult.success) {
            // Store individual households for map display
            householdsData = householdsResult.households.map(household => ({
                id: household.householdId,
                name: household.name,
                address: household.address?.street || 'Unknown',
                zone: household.address?.zone || 'Unknown',
                location: household.location?.coordinates || [12.2958, 76.6394], // Default Mysore center
                status: household.status === 'compliant' ? 'collected' : household.status === 'missed' ? 'missed' : 'pending',
                waste: household.wasteData?.todayWaste || 0,
                phone: household.contact?.phone || 'N/A'
            }));

            // Group households by colony for stats and colony list
            const colonyMap = {};
            householdsResult.households.forEach(household => {
                const colonyName = household.address?.zone || 'Unknown Colony';
                if (!colonyMap[colonyName]) {
                    colonyMap[colonyName] = {
                        id: `C${Object.keys(colonyMap).length + 1}`,
                        name: colonyName,
                        location: household.location?.coordinates || [12.2958, 76.6394], // Use first household's location as colony center
                        totalHouses: 0,
                        collectedHouses: 0,
                        missedHouses: 0,
                        wasteCollected: 0,
                        households: []
                    };
                }
                colonyMap[colonyName].totalHouses++;
                colonyMap[colonyName].households.push({
                    id: household.householdId,
                    address: household.address?.street || 'Unknown',
                    status: household.status === 'compliant' ? 'collected' : household.status === 'missed' ? 'missed' : 'pending',
                    waste: household.wasteData?.todayWaste || 0
                });
                if (household.status === 'compliant') {
                    colonyMap[colonyName].collectedHouses++;
                    colonyMap[colonyName].wasteCollected += household.wasteData?.todayWaste || 0;
                } else if (household.status === 'missed') {
                    colonyMap[colonyName].missedHouses++;
                }
            });
            coloniesData = Object.values(colonyMap);
        }

        // Load activities for analytics
        const activitiesResponse = await fetch(`${API_BASE}/activities`, {
            headers: getAuthHeaders()
        });
        const activitiesResult = await activitiesResponse.json();
        if (activitiesResult.success) {
            // Process activities data for chart
            let collectedWaste = 0;
            let missedCollections = 0;
            let pendingCollections = 0;

            activitiesResult.activities.forEach(activity => {
                if (activity.type === 'collection' && activity.metadata?.wasteAmount) {
                    collectedWaste += activity.metadata.wasteAmount;
                } else if (activity.type === 'alert' && activity.title.toLowerCase().includes('missed')) {
                    missedCollections++;
                }
            });

            // Store activity stats for chart
            window.activityStats = {
                collected: collectedWaste,
                missed: missedCollections,
                pending: pendingCollections
            };
        }

    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to sample data if API fails
        loadSampleData();
    }

    
    updateMapMarkers();
}

function loadSampleData() {
    trucksData = [
        {
            id: 'T001',
            name: 'Truck 1',
            truckNumber: 'KA-09-MX-1234',
            registrationNumber: 'KA09MX1234',
            status: 'active',
            location: [12.3051, 76.6553],
            wasteCollected: 245,
            currentColony: 'Jayanagar',
            driver: 'Ramesh Kumar',
            driverPhone: '9876543210'
        },
        {
            id: 'T002',
            name: 'Truck 2',
            truckNumber: 'KA-09-MX-5678',
            registrationNumber: 'KA09MX5678',
            status: 'active',
            location: [12.3110, 76.6590],
            wasteCollected: 189,
            currentColony: 'Kuvempunagar',
            driver: 'Suresh Babu',
            driverPhone: '9876543211'
        },
        {
            id: 'T003',
            name: 'Truck 3',
            truckNumber: 'KA-09-MX-9012',
            registrationNumber: 'KA09MX9012',
            status: 'idle',
            location: [12.2958, 76.6394],
            wasteCollected: 0,
            currentColony: 'Depot',
            driver: 'Yallappa',
            driverPhone: '9876543212'
        },
        {
            id: 'T004',
            name: 'Truck 4',
            truckNumber: 'KA-09-MX-3456',
            registrationNumber: 'KA09MX3456',
            status: 'active',
            location: [12.3200, 76.6450],
            wasteCollected: 312,
            currentColony: 'Vijayanagar',
            driver: 'Ravi Shankar',
            driverPhone: '9876543213'
        }
    ];

    coloniesData = [
        {
            id: 'C001',
            name: 'Jayanagar Colony',
            location: [12.3051, 76.6553],
            totalHouses: 150,
            collectedHouses: 135,
            missedHouses: 15,
            wasteCollected: 245,
            households: [
                { id: 'H001', address: 'House #12, 1st Main', status: 'collected', waste: 2.5 },
                { id: 'H002', address: 'House #15, 1st Main', status: 'collected', waste: 2.2 },
                { id: 'H003', address: 'House #18, 2nd Cross', status: 'missed', waste: 0 },
                { id: 'H004', address: 'House #21, 2nd Cross', status: 'collected', waste: 1.8 },
                { id: 'H005', address: 'House #25, 3rd Main', status: 'missed', waste: 0 }
            ]
        },
        {
            id: 'C002',
            name: 'Kuvempunagar Colony',
            location: [12.3110, 76.6590],
            totalHouses: 200,
            collectedHouses: 185,
            missedHouses: 15,
            wasteCollected: 189,
            households: [
                { id: 'H011', address: 'House #5, Block A', status: 'collected', waste: 2.1 },
                { id: 'H012', address: 'House #8, Block A', status: 'collected', waste: 2.8 },
                { id: 'H013', address: 'House #12, Block B', status: 'missed', waste: 0 },
                { id: 'H014', address: 'House #15, Block B', status: 'collected', waste: 3.5 },
                { id: 'H015', address: 'House #20, Block C', status: 'missed', waste: 0 }
            ]
        },
        {
            id: 'C003',
            name: 'Vijayanagar Colony',
            location: [12.3200, 76.6450],
            totalHouses: 180,
            collectedHouses: 165,
            missedHouses: 15,
            wasteCollected: 312,
            households: [
                { id: 'H021', address: 'House #3, MG Road', status: 'collected', waste: 4.2 },
                { id: 'H022', address: 'House #7, MG Road', status: 'collected', waste: 3.1 },
                { id: 'H023', address: 'House #11, KC Road', status: 'missed', waste: 0 },
                { id: 'H024', address: 'House #14, KC Road', status: 'collected', waste: 2.9 },
                { id: 'H025', address: 'House #18, JC Road', status: 'missed', waste: 0 }
            ]
        },
        {
            id: 'C004',
            name: 'Saraswathipuram Colony',
            location: [12.2980, 76.6410],
            totalHouses: 120,
            collectedHouses: 110,
            missedHouses: 10,
            wasteCollected: 178,
            households: [
                { id: 'H031', address: 'House #9, Main Road', status: 'collected', waste: 2.3 },
                { id: 'H032', address: 'House #13, 1st Cross', status: 'collected', waste: 2.7 },
                { id: 'H033', address: 'House #16, 2nd Cross', status: 'missed', waste: 0 },
                { id: 'H034', address: 'House #22, 3rd Cross', status: 'collected', waste: 3.4 },
                { id: 'H035', address: 'House #28, 4th Main', status: 'missed', waste: 0 }
            ]
        }
    ];

    householdsData = [
        { id: 'H001', name: 'Rajesh Family', address: 'House #12, 1st Main', zone: 'Jayanagar', location: [12.3051, 76.6553], status: 'collected', waste: 2.5, phone: '9876543214' },
        { id: 'H002', name: 'Priya Household', address: 'House #15, 1st Main', zone: 'Jayanagar', location: [12.3053, 76.6555], status: 'collected', waste: 2.2, phone: '9876543215' },
        { id: 'H003', name: 'Kumar Residence', address: 'House #18, 2nd Cross', zone: 'Jayanagar', location: [12.3049, 76.6551], status: 'missed', waste: 0, phone: '9876543216' },
        { id: 'H004', name: 'Lakshmi House', address: 'House #21, 2nd Cross', zone: 'Jayanagar', location: [12.3055, 76.6557], status: 'collected', waste: 1.8, phone: '9876543217' },
        { id: 'H005', name: 'Venkatesh Home', address: 'House #25, 3rd Main', zone: 'Jayanagar', location: [12.3047, 76.6549], status: 'missed', waste: 0, phone: '9876543218' },
        { id: 'H011', name: 'Sharma Family', address: 'House #5, Block A', zone: 'Kuvempunagar', location: [12.3110, 76.6590], status: 'collected', waste: 2.1, phone: '9876543219' },
        { id: 'H012', name: 'Patel Household', address: 'House #8, Block A', zone: 'Kuvempunagar', location: [12.3112, 76.6592], status: 'collected', waste: 2.8, phone: '9876543220' },
        { id: 'H013', name: 'Gupta Residence', address: 'House #12, Block B', zone: 'Kuvempunagar', location: [12.3108, 76.6588], status: 'missed', waste: 0, phone: '9876543221' },
        { id: 'H014', name: 'Singh Family', address: 'House #15, Block B', zone: 'Kuvempunagar', location: [12.3114, 76.6594], status: 'collected', waste: 3.5, phone: '9876543222' },
        { id: 'H015', name: 'Mehta House', address: 'House #20, Block C', zone: 'Kuvempunagar', location: [12.3106, 76.6586], status: 'missed', waste: 0, phone: '9876543223' },
        { id: 'H021', name: 'Krishna Home', address: 'House #3, MG Road', zone: 'Vijayanagar', location: [12.3200, 76.6450], status: 'collected', waste: 4.2, phone: '9876543224' },
        { id: 'H022', name: 'Radha Residence', address: 'House #7, MG Road', zone: 'Vijayanagar', location: [12.3202, 76.6452], status: 'collected', waste: 3.1, phone: '9876543225' },
        { id: 'H023', name: 'Bharath House', address: 'House #11, KC Road', zone: 'Vijayanagar', location: [12.3198, 76.6448], status: 'missed', waste: 0, phone: '9876543226' },
        { id: 'H024', name: 'Arjun Family', address: 'House #14, KC Road', zone: 'Vijayanagar', location: [12.3204, 76.6454], status: 'collected', waste: 2.9, phone: '9876543227' },
        { id: 'H025', name: 'Kavya Home', address: 'House #18, JC Road', zone: 'Vijayanagar', location: [12.3196, 76.6446], status: 'missed', waste: 0, phone: '9876543228' },
        { id: 'H031', name: 'Ravi Kumar', address: 'House #9, Main Road', zone: 'Saraswathipuram', location: [12.2980, 76.6410], status: 'collected', waste: 2.3, phone: '9876543229' },
        { id: 'H032', name: 'Anita Sharma', address: 'House #13, 1st Cross', zone: 'Saraswathipuram', location: [12.2982, 76.6412], status: 'collected', waste: 2.7, phone: '9876543230' },
        { id: 'H033', name: 'Mohan Lal', address: 'House #16, 2nd Cross', zone: 'Saraswathipuram', location: [12.2978, 76.6408], status: 'missed', waste: 0, phone: '9876543231' },
        { id: 'H034', name: 'Sunita Devi', address: 'House #22, 3rd Cross', zone: 'Saraswathipuram', location: [12.2984, 76.6414], status: 'collected', waste: 3.4, phone: '9876543232' },
        { id: 'H035', name: 'Rajendra Prasad', address: 'House #28, 4th Main', zone: 'Saraswathipuram', location: [12.2976, 76.6406], status: 'missed', waste: 0, phone: '9876543233' }
    ];
}

const recentActivities = [
    {
        type: 'success',
        icon: 'fa-check',
        title: 'Truck T002 collected waste from 45 houses',
        time: '12 minutes ago'
    },
    {
        type: 'warning',
        icon: 'fa-exclamation-triangle',
        title: '15 houses missed collection in Jayanagar',
        time: '18 minutes ago'
    },
    {
        type: 'success',
        icon: 'fa-truck',
        title: 'Truck T004 started route in Vijayanagar',
        time: '25 minutes ago'
    },
    {
        type: 'error',
        icon: 'fa-times',
        title: 'House H003 missed collection - 2nd day',
        time: '32 minutes ago'
    }
];

// Initialize Dashboard
function initDashboard() {
    updateStats();
    renderTrucks();
    renderColonies();
    renderActivities();
    renderWasteChart();
    setupSidebarNavigation();
    setupMapControls();
    
    // Initialize map with proper timing - wait a bit for DOM to be fully rendered
    setTimeout(() => {
        initMap();
        console.log('Map initialization scheduled after DOM layout');
    }, 100);
    
    // Live truck tracking - update every 5 seconds
    setInterval(async () => {
        await loadData();
        updateMapMarkers();
        updateTruckPositions();
        renderTrucks();
    }, 5000);

    // Auto-refresh dashboard stats every 30 seconds
    setInterval(() => {
        updateStats();
        renderWasteChart();
    }, 30000);
}

// Initialize Leaflet Map
function initMap() {
    console.log('Initializing map...');

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Map container not found!');
        return;
    }

    // Destroy existing map if it exists
    if (map) {
        try {
            map.remove();
            map = null;
        } catch (e) {
            console.warn('Error removing old map:', e);
        }
        markers.trucks = [];
        markers.houses = [];
    }

    // Check if container has proper dimensions
    const rect = mapContainer.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
        console.warn('Map container has zero dimensions, waiting for layout...');
        setTimeout(() => {
            console.log('Retrying map initialization...');
            initMap();
        }, 500);
        return;
    }

    try {
        console.log('Creating Leaflet map instance...');
        
        // Simple, proven Leaflet initialization
        map = L.map('map').setView([12.2958, 76.6394], 13);
        
        console.log('✅ Map instance created');

        // Add OpenStreetMap tile layer - using the exact proven code
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        console.log('✅ OpenStreetMap tile layer added');

        // Ensure map is properly sized
        map.invalidateSize(true);
        console.log('✅ Map size validated and initialized');
        
        // Verify map is working
        console.log('Map center:', map.getCenter());
        console.log('Map zoom:', map.getZoom());
        console.log('Map bounds:', map.getBounds());

        // Add truck markers if data is available
        if (trucksData && trucksData.length > 0) {
            console.log('Adding truck markers:', trucksData.length);
            trucksData.forEach(truck => {
                addTruckMarker(truck);
            });
            
            // Fit all truck markers in view
            setTimeout(() => {
                fitMapToTrucks();
            }, 300);
        } else {
            console.log('No truck data available yet, using default view');
        }

        // Add colony markers if data is available
        if (coloniesData && coloniesData.length > 0) {
            console.log('Adding colony markers:', coloniesData.length);
            coloniesData.forEach(colony => {
                addColonyMarker(colony);
            });
        }

        console.log('✅ Map fully initialized!');

    } catch (error) {
        console.error('❌ Error initializing map:', error);
    }
}

// Fit map bounds to show all trucks
function fitMapToTrucks() {
    if (!map || !markers.trucks || markers.trucks.length === 0) {
        console.log('Cannot fit map - no trucks or map not ready');
        return;
    }
    
    try {
        const bounds = L.latLngBounds();
        let hasValidBounds = false;
        
        markers.trucks.forEach(truckMarker => {
            const latlng = truckMarker.marker.getLatLng();
            if (latlng) {
                bounds.extend(latlng);
                hasValidBounds = true;
            }
        });
        
        if (hasValidBounds && bounds.isValid()) {
            map.fitBounds(bounds, { 
                padding: [50, 50],
                maxZoom: 15
            });
            console.log('✅ Map fitted to show all trucks');
        } else {
            console.log('No valid bounds to fit');
        }
    } catch (error) {
        console.error('Error fitting map bounds:', error);
    }
}

// Update map markers when data changes
function updateMapMarkers() {
    if (!map) {
        console.log('Map not initialized yet, skipping marker update');
        return;
    }

    console.log('Updating map markers...');

    // Clear existing markers
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Add truck markers
    if (trucksData && trucksData.length > 0) {
        console.log('Adding truck markers:', trucksData.length);
        trucksData.forEach(truck => {
            addTruckMarker(truck);
        });
        
        // Fit all trucks in view
        fitMapToTrucks();
    } else {
        console.log('No truck data available');
    }

    // Add colony markers
    if (coloniesData && coloniesData.length > 0) {
        coloniesData.forEach(colony => {
            addColonyMarker(colony);
        });
    }
}

// Add truck marker to map
function addTruckMarker(truck) {
    if (!map) {
        console.error('Map not initialized, cannot add truck marker');
        return;
    }

    if (!truck.location || !Array.isArray(truck.location) || truck.location.length !== 2) {
        console.error('Invalid truck location:', truck.location);
        return;
    }

    const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: ${truck.status === 'active' ? '#10b981' : '#f59e0b'}; 
                color: white; padding: 8px; border-radius: 50%; width: 40px; height: 40px; 
                display: flex; align-items: center; justify-content: center; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                <i class="fas fa-truck"></i>
              </div>`,
        iconSize: [40, 40]
    });
    
    const marker = L.marker(truck.location, { icon })
        .addTo(map)
        .bindPopup(`
            <div class="popup-content">
                <h4>${truck.name} - ${truck.status.toUpperCase()}</h4>
                <p><strong>Truck Number:</strong> ${truck.truckNumber}</p>
                <p><strong>Registration:</strong> ${truck.registrationNumber}</p>
                <p><strong>Driver:</strong> ${truck.driver}</p>
                <p><strong>Driver Phone:</strong> ${truck.driverPhone}</p>
                <p><strong>Location:</strong> ${truck.currentColony}</p>
                <p><strong>Waste Collected:</strong> ${truck.wasteCollected} kg</p>
            </div>
        `);
    
    console.log('Truck marker added to map for:', truck.name);
    markers.trucks.push({ id: truck.id, marker, data: truck });
}

// Add house markers to map
function addHouseMarkers(households) {
    households.forEach(household => {
        if (!household.location || !Array.isArray(household.location) || household.location.length !== 2) {
            console.warn('Invalid household location:', household.location);
            return;
        }

        const iconColor = household.status === 'collected' ? '#10b981' : household.status === 'missed' ? '#ef4444' : '#f59e0b';
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: ${iconColor}; color: white; padding: 6px; 
                    border-radius: 50%; width: 24px; height: 24px; 
                    display: flex; align-items: center; justify-content: center; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 10px; font-weight: bold;">
                    <i class="fas fa-home"></i>
                  </div>`,
            iconSize: [24, 24]
        });

        const marker = L.marker(household.location, { icon })
            .addTo(map)
            .bindPopup(`
                <div class="popup-content">
                    <h4>${household.name}</h4>
                    <p><strong>Address:</strong> ${household.address}</p>
                    <p><strong>Zone:</strong> ${household.zone}</p>
                    <p><strong>Status:</strong> <span style="color: ${iconColor};">${household.status.toUpperCase()}</span></p>
                    <p><strong>Waste:</strong> ${household.waste} kg</p>
                    <p><strong>Phone:</strong> ${household.phone}</p>
                </div>
            `);

        markers.houses.push({ id: household.id, marker, data: household });
    });
}

// Update map markers after data loading
function updateMapMarkers() {
    if (!map) {
        console.log('Map not initialized yet, skipping marker update');
        return;
    }

    console.log('Updating map markers...');

    // Clear existing truck markers
    markers.trucks.forEach(truckMarker => {
        try {
            if (map && map.hasLayer && map.hasLayer(truckMarker.marker)) {
                map.removeLayer(truckMarker.marker);
            }
        } catch (e) {
            console.warn('Error removing truck marker:', e);
        }
    });
    markers.trucks = [];

    // Clear existing house markers
    markers.houses.forEach(houseMarker => {
        try {
            if (map && map.hasLayer && map.hasLayer(houseMarker.marker)) {
                map.removeLayer(houseMarker.marker);
            }
        } catch (e) {
            console.warn('Error removing house marker:', e);
        }
    });
    markers.houses = [];

    // Add truck markers
    if (trucksData && trucksData.length > 0) {
        console.log('Adding truck markers:', trucksData.length);
        trucksData.forEach(truck => {
            addTruckMarker(truck);
        });
        
        // Fit map to trucks
        fitMapToTrucks();
    }

    // Add house markers
    if (householdsData && householdsData.length > 0) {
        console.log('Adding house markers:', householdsData.length);
        addHouseMarkers(householdsData);
    }
}

// Update Statistics
function updateStats() {
    const activeTrucks = trucksData.filter(t => t.status === 'active').length;
    const idleTrucks = trucksData.filter(t => t.status === 'idle').length;
    const totalWasteCollected = trucksData.reduce((sum, t) => sum + t.wasteCollected, 0);
    const totalMissedHouses = coloniesData.reduce((sum, c) => sum + c.missedHouses, 0);
    
    animateCounter('activeTrucks', activeTrucks);
    animateCounter('idleTrucks', idleTrucks);
    animateCounter('wasteCollected', totalWasteCollected);
    animateCounter('missedHouses', totalMissedHouses);
}

// Animate counter
function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    const current = parseInt(element.textContent) || 0;
    const increment = (target - current) / 20;
    let count = current;
    
    const timer = setInterval(() => {
        count += increment;
        if ((increment > 0 && count >= target) || (increment < 0 && count <= target)) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(count);
        }
    }, 50);
}


function renderTrucks() {
    console.log('Rendering trucks, data:', trucksData);
    const truckList = document.getElementById('truckList');
    console.log('Truck list element:', truckList);
    if (!truckList) {
        console.error('Truck list element not found!');
        return;
    }

    if (!trucksData || trucksData.length === 0) {
        truckList.innerHTML = '<div class="no-data">No truck data available</div>';
        console.log('No truck data to render');
        return;
    }

    truckList.innerHTML = trucksData.map(truck => `
        <div class="truck-item" onclick="focusTruck('${truck.id}')" title="Click to view on map">
            <div class="truck-header">
                <div class="truck-name">
                    <i class="fas fa-truck"></i>
                    ${truck.name} - ${truck.truckNumber}
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <span class="live-indicator" title="Live tracking active">
                        <span class="pulse"></span> LIVE
                    </span>
                    <span class="status-badge ${truck.status}">${truck.status.toUpperCase()}</span>
                </div>
            </div>
            <div class="truck-details">
                <div style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem;">
                    <span style="font-size: 0.85rem;"><i class="fas fa-id-card"></i> <strong>Registration:</strong> ${truck.registrationNumber}</span>
                    <span style="font-size: 0.85rem;"><i class="fas fa-user"></i> <strong>Driver:</strong> ${truck.driver}</span>
                    <span style="font-size: 0.85rem;"><i class="fas fa-phone"></i> <strong>Phone:</strong> ${truck.driverPhone}</span>
                    <span style="font-size: 0.85rem;"><i class="fas fa-location-dot"></i> <strong>Coordinates:</strong> ${truck.location[0].toFixed(4)}, ${truck.location[1].toFixed(4)}</span>
                </div>
                <div style="margin-top: 0.5rem; display: flex; gap: 1rem; padding-top: 0.5rem; border-top: 1px solid #e5e7eb;">
                    <span><i class="fas fa-weight"></i> ${truck.wasteCollected} kg</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${truck.currentColony}</span>
                </div>
            </div>
        </div>
    `).join('');
    console.log('Trucks rendered:', trucksData.length);
    
    // Add visual confirmation
    if (trucksData.length > 0) {
        console.log('✅ Truck data is visible in the UI!');
    }
}

// Render colonies list
function renderColonies() {
    console.log('Rendering colonies, data:', coloniesData);
    const colonyList = document.getElementById('colonyList');
    console.log('Colony list element:', colonyList);
    if (!colonyList) {
        console.error('Colony list element not found!');
        return;
    }

    if (!coloniesData || coloniesData.length === 0) {
        colonyList.innerHTML = '<div class="no-data">No colony data available</div>';
        console.log('No colony data to render');
        return;
    }

    colonyList.innerHTML = coloniesData.map(colony => `
        <div class="colony-item" onclick="showColonyDetails('${colony.id}')">
            <div class="colony-name">${colony.name}</div>
            <div class="colony-stats">
                <div class="colony-stat">
                    <div class="colony-stat-value">${colony.totalHouses}</div>
                    <div class="colony-stat-label">Total</div>
                </div>
                <div class="colony-stat collected">
                    <div class="colony-stat-value">${colony.collectedHouses}</div>
                    <div class="colony-stat-label">Collected</div>
                </div>
                <div class="colony-stat missed">
                    <div class="colony-stat-value">${colony.missedHouses}</div>
                    <div class="colony-stat-label">Missed</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Render activities
function renderActivities() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Render waste collection pie chart
function renderWasteChart() {
    const ctx = document.getElementById('wasteChart');
    if (!ctx) return;
    if (typeof Chart === 'undefined') return;

    // Calculate statistics from current data
    let totalCollected = 0;
    let totalMissed = 0;
    let totalPending = 0;

    // Use activity stats if available
    if (window.activityStats) {
        totalCollected = window.activityStats.collected;
        totalMissed = window.activityStats.missed;
    }

    // Calculate from colonies data
    coloniesData.forEach(colony => {
        totalCollected += colony.wasteCollected;
        totalMissed += colony.missedHouses;
    });

    // Calculate pending from households
    coloniesData.forEach(colony => {
        colony.households.forEach(household => {
            if (household.status === 'pending') {
                totalPending += household.waste || 0;
            }
        });
    });

    // Calculate from trucks data
    const truckWaste = trucksData.reduce((sum, truck) => sum + (truck.wasteCollected || 0), 0);
    totalCollected = Math.max(totalCollected, truckWaste);

    // If still no data, use sample values
    if (totalCollected === 0 && totalMissed === 0 && totalPending === 0) {
        totalCollected = 756;
        totalMissed = 89;
        totalPending = 45;
    }

    const data = {
        labels: ['Collected Waste (kg)', 'Missed Collections', 'Pending Collections'],
        datasets: [{
            data: [totalCollected, totalMissed, totalPending],
            backgroundColor: [
                '#10b981', // Green for collected
                '#ef4444', // Red for missed
                '#f59e0b'  // Orange for pending
            ],
            borderColor: [
                '#059669',
                '#dc2626',
                '#d97706'
            ],
            borderWidth: 2
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    };

    // Destroy existing chart if it exists
    if (window.wasteChart instanceof Chart) {
        window.wasteChart.destroy();
    }

    window.wasteChart = new Chart(ctx, config);
}

// Focus on truck - Make it globally accessible
window.focusTruck = function(truckId) {
    console.log('Focusing on truck:', truckId);
    console.log('Map initialized:', !!map);
    console.log('Markers available:', markers.trucks.length);
    
    if (!map) {
        console.error('Map not initialized yet!');
        return;
    }
    
    const truckMarker = markers.trucks.find(m => m.id === truckId);
    if (truckMarker) {
        console.log('Found truck marker, zooming to location');
        map.setView(truckMarker.data.location, 15);
        truckMarker.marker.openPopup();
    } else {
        console.error('Truck marker not found for ID:', truckId);
        console.log('Available truck IDs:', markers.trucks.map(m => m.id));
    }
}

// Show/hide dashboard sections based on sidebar
function setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.sidebar .nav-item');
    // Build a map of section elements
    const sections = document.querySelectorAll('.details-panel .panel-section');

    navItems.forEach(item => {
        const target = item.getAttribute('data-target');
        if (!target) return;

        const activate = () => {
            // update active state in sidebar
            navItems.forEach(n => n.classList.remove('active'));
            navItems.forEach(n => n.setAttribute('aria-selected', 'false'));
            item.classList.add('active');
            item.setAttribute('aria-selected', 'true');

            // hide all sections first
            sections.forEach(s => s.classList.add('hidden'));

            // map target shows map + all details
            if (target === 'map') {
                sections.forEach(s => s.classList.remove('hidden'));
                // ensure map redraws and is visible
                if (map && typeof map.invalidateSize === 'function') {
                    console.log('Invalidating map size for map view');
                    setTimeout(() => {
                        try {
                            map.invalidateSize();
                            console.log('Map size invalidated successfully');
                        } catch (e) {
                            console.warn('Error invalidating map size:', e);
                        }
                    }, 200);
                    // optionally focus the map container
                    const mapEl = document.getElementById('map');
                    if (mapEl) {
                        mapEl.focus();
                        console.log('Map container focused');
                    }
                } else {
                    console.log('Map not ready yet, will initialize when available');
                }
            } else if (target === 'trucks') {
                const sec = document.querySelector('.details-panel .panel-section[data-section="trucks"]');
                if (sec) sec.classList.remove('hidden');
                // focus first truck item if present
                setTimeout(() => { const first = document.querySelector('#truckList .truck-item'); if (first) first.scrollIntoView({behavior:'smooth', block:'center'}); }, 100);
            } else if (target === 'households') {
                const sec = document.querySelector('.details-panel .panel-section[data-section="colonies"]');
                if (sec) sec.classList.remove('hidden');
            } else if (target === 'analytics') {
                const sec = document.querySelector('.details-panel .panel-section[data-section="activity"]');
                if (sec) sec.classList.remove('hidden');
            } else if (target === 'alerts' || target === 'settings') {
                const sec = document.querySelector('.details-panel .panel-section[data-section="activity"]');
                if (sec) sec.classList.remove('hidden');
            }
        };

        item.addEventListener('click', (e) => { e.preventDefault(); activate(); });
        item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    });

    // Activate the initially-marked nav item (if any) so panels match UI
    const initial = document.querySelector('.sidebar .nav-item.active');
    if (initial) {
        initial.click();
    }
}

function setupMapControls() {
    const buttons = document.querySelectorAll('.map-controls .map-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = btn.getAttribute('data-filter');
            // update active class
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // call filter
            try { window.filterMap(filter); } catch (err) { console.error(err); }
        });
        btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
    });
}

// Show colony details in modal
// Show colony details in modal - Make it globally accessible
window.showColonyDetails = function(colonyId) {
    console.log('Showing colony details for:', colonyId);
    const colony = coloniesData.find(c => c.id === colonyId);
    if (!colony) {
        console.error('Colony not found:', colonyId);
        return;
    }
    
    const modal = document.getElementById('householdModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = colony.name;
    modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <h3>Colony Statistics</h3>
            <div class="colony-stats" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
                <div style="text-align: center; padding: 1rem; background: #f9fafb; border-radius: 0.5rem;">
                    <div style="font-size: 2rem; font-weight: bold;">${colony.totalHouses}</div>
                    <div style="color: #6b7280; font-size: 0.875rem;">Total Houses</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: #dbeafe; border-radius: 0.5rem;">
                    <div style="font-size: 2rem; font-weight: bold; color: #3b82f6;">${colony.collectedHouses}</div>
                    <div style="color: #6b7280; font-size: 0.875rem;">Collected</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: #fee2e2; border-radius: 0.5rem;">
                    <div style="font-size: 2rem; font-weight: bold; color: #ef4444;">${colony.missedHouses}</div>
                    <div style="color: #6b7280; font-size: 0.875rem;">Missed</div>
                </div>
            </div>
        </div>
        
        <h3>Household Details (Sample)</h3>
        <div class="household-list">
            ${colony.households.map(house => `
                <div class="household-item">
                    <div class="household-info">
                        <h4>${house.address}</h4>
                        <p>House ID: ${house.id}</p>
                    </div>
                    <div>
                        <div class="household-status ${house.status}">
                            ${house.status === 'collected' ? 
                                `<i class="fas fa-check"></i> Collected (${house.waste} kg)` : 
                                `<i class="fas fa-times"></i> Missed`}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <p style="margin-top: 1rem; color: #6b7280; font-size: 0.875rem; font-style: italic;">
            * Showing sample of ${colony.households.length} houses. Total houses in colony: ${colony.totalHouses}
        </p>
    `;
    
    modal.classList.add('active');
    console.log('Modal opened successfully');
}

// Close modal - Make it globally accessible
window.closeModal = function() {
    document.getElementById('householdModal').classList.remove('active');
    console.log('Modal closed');
}

// Filter map view - Make it globally accessible
window.filterMap = function(filter) {
    console.log('Filtering map:', filter);
    // Implement filter logic here - placeholder behavior
    if (!map) {
        console.warn('Map not initialized yet - filter deferred');
        return;
    }

    // Example: adjust marker visibility based on truck status
    if (filter === 'all') {
        markers.trucks.forEach(t => t.marker.addTo(map));
    } else if (filter === 'active') {
        markers.trucks.forEach(t => {
            if (t.data.status === 'active') t.marker.addTo(map); else map.removeLayer(t.marker);
        });
    } else if (filter === 'idle') {
        markers.trucks.forEach(t => {
            if (t.data.status === 'idle') t.marker.addTo(map); else map.removeLayer(t.marker);
        });
    } else if (filter === 'missed') {
        // show all colony missed markers — no-op for now
        console.log('Missed filter selected - highlighting colonies');
    }

    console.log('Filter applied:', filter);
}

// Update truck positions (simulate real-time updates)
function updateTruckPositions() {
    // Simulate truck movement
    trucksData.forEach(truck => {
        if (truck.status === 'active') {
            // Randomly move truck slightly
            truck.location[0] += (Math.random() - 0.5) * 0.001;
            truck.location[1] += (Math.random() - 0.5) * 0.001;
            
            // Update marker position
            const truckMarker = markers.trucks.find(m => m.id === truck.id);
            if (truckMarker) {
                truckMarker.marker.setLatLng(truck.location);
            }
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initDashboard();
});

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('householdModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Focus on truck on the map
window.focusTruck = function(truckId) {
    const truck = trucksData.find(t => t.id === truckId);
    if (truck && map) {
        // Center map on truck
        map.setView(truck.location, 15);
        
        // Highlight the truck marker
        const truckMarker = markers.trucks.find(m => m.id === truckId);
        if (truckMarker) {
            truckMarker.marker.openPopup();
        }
        
        // Switch to map view
        const mapPanel = document.querySelector('[data-target="map"]');
        if (mapPanel) {
            mapPanel.click();
        }
    }
}

// Logout function - Make it globally accessible
window.logout = function() {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing SmartWaste Dashboard...');
    
    // Load data first
    await loadData();
    console.log('✅ Data loaded successfully');
    
    // Then initialize the dashboard UI
    initDashboard();
    console.log('✅ Dashboard UI initialized');
    
    // Ensure map is visible and properly focused/sized
    setTimeout(() => {
        // Switch to map view
        const mapNavItem = document.querySelector('[data-target="map"]');
        if (mapNavItem) {
            mapNavItem.click();
            console.log('✅ Map view activated');
        }
        
        // Force map to recalculate size after view switch
        if (map && typeof map.invalidateSize === 'function') {
            map.invalidateSize(true);
            console.log('✅ Map size invalidated and focused');
        }
    }, 600);
    
    console.log('✅ Dashboard initialization complete!');
});
