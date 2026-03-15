// Check authentication on page load
(function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        // No token found, redirect to login
        window.location.href = 'login.html';
        return;
    }
})();

// Initialize Map
let map;
let markers = {
    trucks: [],
    houses: []
};

// Sample Data - Replace with actual API calls
const trucksData = [
    {
        id: 'T001',
        name: 'Truck 1',
        truckNumber: 'KA-09-MX-1234',
        registrationNumber: 'KA09MX1234',
        status: 'active',
        location: [12.3051, 76.6553], // Mysuru coordinates
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

const coloniesData = [
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
            { id: 'H002', address: 'House #15, 1st Main', status: 'collected', waste: 3.2 },
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

const recentActivities = [
    {
        type: 'success',
        icon: 'fa-check',
        title: 'Truck T001 completed collection in Jayanagar',
        time: '5 minutes ago'
    },
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
    initMap();
    updateStats();
    renderTrucks();
    renderColonies();
    renderActivities();
    
    // Auto-refresh every 30 seconds
    setInterval(() => {
        updateStats();
        updateTruckPositions();
    }, 30000);

    // Wire sidebar navigation items to show/hide panels
    setupSidebarNavigation();
    // Wire map control buttons
    setupMapControls();
}

// Initialize Leaflet Map
function initMap() {
    map = L.map('map').setView([12.3051, 76.6553], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add truck markers
    trucksData.forEach(truck => {
        addTruckMarker(truck);
    });
    
    // Add colony markers
    coloniesData.forEach(colony => {
        addColonyMarker(colony);
    });
}

// Add truck marker to map
function addTruckMarker(truck) {
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
    
    markers.trucks.push({ id: truck.id, marker, data: truck });
}

// Add colony marker to map
function addColonyMarker(colony) {
    // Add collected houses
    const collectedIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: #3b82f6; color: white; padding: 4px 8px; 
                border-radius: 4px; font-size: 12px; font-weight: bold;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                ${colony.collectedHouses}
              </div>`,
        iconSize: [30, 30]
    });
    
    L.marker([colony.location[0] + 0.002, colony.location[1]], { icon: collectedIcon })
        .addTo(map)
        .bindPopup(`
            <div class="popup-content">
                <h4>${colony.name}</h4>
                <p><strong>Collected:</strong> ${colony.collectedHouses} houses</p>
            </div>
        `);
    
    // Add missed houses if any
    if (colony.missedHouses > 0) {
        const missedIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: #ef4444; color: white; padding: 4px 8px; 
                    border-radius: 4px; font-size: 12px; font-weight: bold;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                    ${colony.missedHouses}
                  </div>`,
            iconSize: [30, 30]
        });
        
        L.marker([colony.location[0] - 0.002, colony.location[1]], { icon: missedIcon })
            .addTo(map)
            .bindPopup(`
                <div class="popup-content">
                    <h4>${colony.name}</h4>
                    <p><strong>Missed:</strong> ${colony.missedHouses} houses</p>
                </div>
            `);
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

// Render trucks list
// Render trucks list
function renderTrucks() {
    const truckList = document.getElementById('truckList');
    truckList.innerHTML = trucksData.map(truck => `
        <div class="truck-item" onclick="focusTruck('${truck.id}')" title="Click to view on map">
            <div class="truck-header">
                <div class="truck-name">
                    <i class="fas fa-truck"></i>
                    ${truck.name} - ${truck.truckNumber}
                </div>
                <span class="status-badge ${truck.status}">${truck.status.toUpperCase()}</span>
            </div>
            <div class="truck-details">
                <div style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem;">
                    <span style="font-size: 0.85rem;"><i class="fas fa-id-card"></i> <strong>Registration:</strong> ${truck.registrationNumber}</span>
                    <span style="font-size: 0.85rem;"><i class="fas fa-user"></i> <strong>Driver:</strong> ${truck.driver}</span>
                    <span style="font-size: 0.85rem;"><i class="fas fa-phone"></i> <strong>Phone:</strong> ${truck.driverPhone}</span>
                </div>
                <div style="margin-top: 0.5rem; display: flex; gap: 1rem; padding-top: 0.5rem; border-top: 1px solid #e5e7eb;">
                    <span><i class="fas fa-weight"></i> ${truck.wasteCollected} kg</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${truck.currentColony}</span>
                </div>
            </div>
        </div>
    `).join('');
    console.log('Trucks rendered:', trucksData.length);
}

// Render colonies list
function renderColonies() {
    const colonyList = document.getElementById('colonyList');
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
                    setTimeout(() => { try { map.invalidateSize(); } catch (e) { console.warn(e); } }, 200);
                    // optionally focus the map container
                    const mapEl = document.getElementById('map'); if (mapEl) mapEl.focus();
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
document.addEventListener('DOMContentLoaded', initDashboard);

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('householdModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Logout function
// Logout function - Make it globally accessible
window.logout = function() {
    console.log('Logging out...');
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    
    // Redirect to home page
    window.location.href = 'index.html';
}
