// Sample Data
const trucksData = [
    {
        id: 'TRUCK-001',
        status: 'active',
        driver: 'Mallanna',
        location: [12.9716, 77.5946],
        capacity: 75,
        route: 'Zone A',
        lastCollection: '10 mins ago'
    },
    {
        id: 'TRUCK-002',
        status: 'active',
        driver: 'Ramesh',
        location: [12.9750, 77.6000],
        capacity: 60,
        route: 'Zone B',
        lastCollection: '5 mins ago'
    },
    {
        id: 'TRUCK-003',
        status: 'idle',
        driver: 'Manjunath',
        location: [12.9680, 77.5900],
        capacity: 20,
        route: 'Zone C',
        lastCollection: '45 mins ago'
    },
    {
        id: 'TRUCK-004',
        status: 'active',
        driver: 'Rakesh',
        location: [12.9780, 77.6050],
        capacity: 85,
        route: 'Zone D',
        lastCollection: '2 mins ago'
    },
    {
        id: 'TRUCK-005',
        status: 'active',
        driver: 'Durga parsad',
        location: [12.9730, 77.5980],
        capacity: 45,
        route: 'Zone A',
        lastCollection: '15 mins ago'
    }
];

const householdsData = [
    {
        id: 'H-001',
        name: 'Sharma Family',
        address: '123 Green Lane, Block A',
        status: 'compliant',
        phone: '+91 98765 43210',
        residents: 4,
        lastDump: '2024-03-01',
        wasteAmount: 12.5,
        monthlyWaste: 285,
        collectionHistory: [
            { date: '2024-03-01', amount: 12.5, type: 'Mixed' },
            { date: '2024-02-28', amount: 10.2, type: 'Mixed' },
            { date: '2024-02-27', amount: 15.1, type: 'Organic' }
        ]
    },
    {
        id: 'H-002',
        name: 'Patel Residence',
        address: '456 Oak Street, Block B',
        status: 'compliant',
        phone: '+91 98765 43211',
        residents: 5,
        lastDump: '2024-03-01',
        wasteAmount: 18.3,
        monthlyWaste: 342,
        collectionHistory: [
            { date: '2024-03-01', amount: 18.3, type: 'Mixed' },
            { date: '2024-02-28', amount: 16.5, type: 'Recyclable' },
            { date: '2024-02-27', amount: 14.8, type: 'Mixed' }
        ]
    },
    {
        id: 'H-003',
        name: 'Kumar Household',
        address: '789 Pine Avenue, Block A',
        status: 'pending',
        phone: '+91 98765 43212',
        residents: 3,
        lastDump: '2024-02-28',
        wasteAmount: 0,
        monthlyWaste: 198,
        collectionHistory: [
            { date: '2024-02-28', amount: 8.5, type: 'Organic' },
            { date: '2024-02-27', amount: 9.2, type: 'Mixed' },
            { date: '2024-02-26', amount: 7.8, type: 'Mixed' }
        ]
    },
    {
        id: 'H-004',
        name: 'Reddy Family',
        address: '321 Maple Drive, Block C',
        status: 'compliant',
        phone: '+91 98765 43213',
        residents: 6,
        lastDump: '2024-03-01',
        wasteAmount: 22.1,
        monthlyWaste: 456,
        collectionHistory: [
            { date: '2024-03-01', amount: 22.1, type: 'Mixed' },
            { date: '2024-02-28', amount: 20.5, type: 'Mixed' },
            { date: '2024-02-27', amount: 19.3, type: 'Organic' }
        ]
    },
    {
        id: 'H-005',
        name: 'Singh Residence',
        address: '654 Birch Road, Block D',
        status: 'compliant',
        phone: '+91 98765 43214',
        residents: 4,
        lastDump: '2024-03-01',
        wasteAmount: 14.7,
        monthlyWaste: 312,
        collectionHistory: [
            { date: '2024-03-01', amount: 14.7, type: 'Recyclable' },
            { date: '2024-02-28', amount: 13.2, type: 'Mixed' },
            { date: '2024-02-27', amount: 15.9, type: 'Mixed' }
        ]
    },
    {
        id: 'H-006',
        name: 'Gupta Family',
        address: '987 Cedar Lane, Block B',
        status: 'missed',
        phone: '+91 98765 43215',
        residents: 3,
        lastDump: '2024-02-26',
        wasteAmount: 0,
        monthlyWaste: 167,
        collectionHistory: [
            { date: '2024-02-26', amount: 11.2, type: 'Mixed' },
            { date: '2024-02-25', amount: 9.8, type: 'Organic' },
            { date: '2024-02-24', amount: 10.5, type: 'Mixed' }
        ]
    },
    {
        id: 'H-007',
        name: 'Verma Household',
        address: '147 Elm Street, Block A',
        status: 'compliant',
        phone: '+91 98765 43216',
        residents: 5,
        lastDump: '2024-03-01',
        wasteAmount: 16.8,
        monthlyWaste: 389,
        collectionHistory: [
            { date: '2024-03-01', amount: 16.8, type: 'Mixed' },
            { date: '2024-02-28', amount: 17.5, type: 'Mixed' },
            { date: '2024-02-27', amount: 15.2, type: 'Recyclable' }
        ]
    },
    {
        id: 'H-008',
        name: 'Mehta Residence',
        address: '258 Willow Way, Block C',
        status: 'compliant',
        phone: '+91 98765 43217',
        residents: 4,
        lastDump: '2024-03-01',
        wasteAmount: 13.4,
        monthlyWaste: 298,
        collectionHistory: [
            { date: '2024-03-01', amount: 13.4, type: 'Organic' },
            { date: '2024-02-28', amount: 12.1, type: 'Mixed' },
            { date: '2024-02-27', amount: 14.6, type: 'Mixed' }
        ]
    }
];

const activityData = [
    {
        icon: 'fa-truck',
        title: 'TRUCK-002 completed collection',
        description: 'Collected 18.3 kg from Patel Residence',
        time: '5 mins ago'
    },
    {
        icon: 'fa-check-circle',
        title: 'Sharma Family waste collected',
        description: '12.5 kg of mixed waste collected',
        time: '10 mins ago'
    },
    {
        icon: 'fa-route',
        title: 'TRUCK-005 started new route',
        description: 'Started collection in Zone A',
        time: '15 mins ago'
    },
    {
        icon: 'fa-exclamation-triangle',
        title: 'Kumar Household - Pending',
        description: 'No waste collected today',
        time: '30 mins ago'
    },
    {
        icon: 'fa-trophy',
        title: 'New record achieved',
        description: 'Reddy Family - Highest contributor this month',
        time: '1 hour ago'
    }
];

// Map initialization
let map;
let truckMarkers = [];
let selectedTruck = null;

function initMap() {
    // Initialize map centered on Bengaluru
    map = L.map('map').setView([12.9716, 77.5946], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add truck markers
    updateTruckMarkers();

    // Add household markers (sample locations)
    const householdLocations = [
        [12.9720, 77.5960],
        [12.9760, 77.5980],
        [12.9690, 77.5920],
        [12.9790, 77.6040],
        [12.9740, 77.5970]
    ];

    householdLocations.forEach((location, index) => {
        const marker = L.circleMarker(location, {
            radius: 8,
            fillColor: '#f59e0b',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`<b>Household ${index + 1}</b><br>Click for details`);
    });

    // Simulate truck movement
    setInterval(updateTruckPositions, 5000);
}

function updateTruckMarkers() {
    // Clear existing markers
    truckMarkers.forEach(marker => marker.remove());
    truckMarkers = [];

    // Add new markers
    trucksData.forEach(truck => {
        const truckIcon = L.divIcon({
            className: 'custom-truck-marker',
            html: `<div style="background: ${truck.status === 'active' ? '#06b6d4' : '#f59e0b'}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                       <i class="fas fa-truck" style="font-size: 14px;"></i>
                   </div>`,
            iconSize: [30, 30]
        });

        const marker = L.marker(truck.location, { icon: truckIcon }).addTo(map);
        
        marker.bindPopup(`
            <div style="padding: 5px;">
                <b>${truck.id}</b><br>
                Driver: ${truck.driver}<br>
                Capacity: ${truck.capacity}%<br>
                Route: ${truck.route}<br>
                Status: ${truck.status}
            </div>
        `);

        marker.on('click', () => {
            focusTruck(truck.id);
        });

        truckMarkers.push(marker);
    });
}

function updateTruckPositions() {
    trucksData.forEach(truck => {
        if (truck.status === 'active') {
            // Simulate movement by slightly adjusting coordinates
            truck.location[0] += (Math.random() - 0.5) * 0.001;
            truck.location[1] += (Math.random() - 0.5) * 0.001;
        }
    });
    updateTruckMarkers();
    renderTruckList();
}

function focusTruck(truckId) {
    const truck = trucksData.find(t => t.id === truckId);
    if (truck) {
        map.setView(truck.location, 15);
        selectedTruck = truckId;
    }
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Initialize map if truck tracking section
    if (sectionId === 'truck-tracking' && !map) {
        setTimeout(initMap, 100);
    }

    // Initialize charts if analytics section
    if (sectionId === 'analytics') {
        initCharts();
    }
}

// Event listeners for navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        showSection(sectionId);
    });
});

// Render Activity List
function renderActivityList() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = activityData.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

// Render Truck List
function renderTruckList() {
    const container = document.getElementById('truckListContainer');
    container.innerHTML = trucksData.map(truck => `
        <div class="truck-item ${truck.status}" onclick="focusTruck('${truck.id}')">
            <div class="truck-header">
                <span class="truck-id">${truck.id}</span>
                <span class="truck-status ${truck.status}">${truck.status.toUpperCase()}</span>
            </div>
            <div class="truck-info">
                <div><i class="fas fa-user"></i> ${truck.driver}</div>
                <div><i class="fas fa-route"></i> ${truck.route}</div>
                <div><i class="fas fa-fill-drip"></i> Capacity: ${truck.capacity}%</div>
                <div><i class="fas fa-clock"></i> ${truck.lastCollection}</div>
            </div>
        </div>
    `).join('');
}

// Filter Trucks
function filterTrucks(filter) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter and render trucks
    const filteredTrucks = filter === 'all' 
        ? trucksData 
        : trucksData.filter(truck => truck.status === filter);

    const container = document.getElementById('truckListContainer');
    container.innerHTML = filteredTrucks.map(truck => `
        <div class="truck-item ${truck.status}" onclick="focusTruck('${truck.id}')">
            <div class="truck-header">
                <span class="truck-id">${truck.id}</span>
                <span class="truck-status ${truck.status}">${truck.status.toUpperCase()}</span>
            </div>
            <div class="truck-info">
                <div><i class="fas fa-user"></i> ${truck.driver}</div>
                <div><i class="fas fa-route"></i> ${truck.route}</div>
                <div><i class="fas fa-fill-drip"></i> Capacity: ${truck.capacity}%</div>
                <div><i class="fas fa-clock"></i> ${truck.lastCollection}</div>
            </div>
        </div>
    `).join('');
}

// Render Households
function renderHouseholds(households = householdsData) {
    const grid = document.getElementById('householdsGrid');
    grid.innerHTML = households.map(household => `
        <div class="household-card ${household.status}" onclick="showHouseholdDetails('${household.id}')">
            <div class="household-header">
                <div class="household-title">
                    <i class="fas fa-home"></i>
                    <div>
                        <h3>${household.name}</h3>
                        <p style="font-size: 0.875rem; color: var(--text-light);">${household.id}</p>
                    </div>
                </div>
                <span class="household-badge ${household.status}">${household.status.toUpperCase()}</span>
            </div>
            <div class="household-details">
                <div class="detail-row">
                    <span class="detail-label"><i class="fas fa-map-marker-alt"></i> Address</span>
                    <span class="detail-value">${household.address}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label"><i class="fas fa-users"></i> Residents</span>
                    <span class="detail-value">${household.residents}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label"><i class="fas fa-calendar"></i> Last Dump</span>
                    <span class="detail-value">${household.lastDump}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label"><i class="fas fa-trash"></i> Today's Waste</span>
                    <span class="detail-value waste-amount">${household.wasteAmount} kg</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label"><i class="fas fa-chart-line"></i> Monthly Total</span>
                    <span class="detail-value">${household.monthlyWaste} kg</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Search Households
function searchHouseholds() {
    const searchTerm = document.getElementById('searchHousehold').value.toLowerCase();
    const filtered = householdsData.filter(household => 
        household.name.toLowerCase().includes(searchTerm) ||
        household.id.toLowerCase().includes(searchTerm) ||
        household.address.toLowerCase().includes(searchTerm)
    );
    renderHouseholds(filtered);
}

// Filter Households
function filterHouseholds() {
    const status = document.getElementById('filterStatus').value;
    const filtered = status === 'all' 
        ? householdsData 
        : householdsData.filter(household => household.status === status);
    renderHouseholds(filtered);
}

// Show Household Details Modal
function showHouseholdDetails(householdId) {
    const household = householdsData.find(h => h.id === householdId);
    if (!household) return;

    const modal = document.getElementById('householdModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2><i class="fas fa-home"></i> ${household.name}</h2>
            <p style="color: var(--text-light);">${household.id} - ${household.address}</p>
        </div>

        <div class="profile-section">
            <h3>Household Information</h3>
            <div class="profile-grid">
                <div class="profile-item">
                    <label><i class="fas fa-phone"></i> Contact</label>
                    <span>${household.phone}</span>
                </div>
                <div class="profile-item">
                    <label><i class="fas fa-users"></i> Residents</label>
                    <span>${household.residents} members</span>
                </div>
                <div class="profile-item">
                    <label><i class="fas fa-badge-check"></i> Status</label>
                    <span class="household-badge ${household.status}">${household.status.toUpperCase()}</span>
                </div>
                <div class="profile-item">
                    <label><i class="fas fa-calendar"></i> Last Collection</label>
                    <span>${household.lastDump}</span>
                </div>
            </div>
        </div>

        <div class="profile-section">
            <h3>Waste Statistics</h3>
            <div class="profile-grid">
                <div class="profile-item">
                    <label><i class="fas fa-trash"></i> Today's Waste</label>
                    <span style="color: var(--primary-color); font-size: 1.5rem;">${household.wasteAmount} kg</span>
                </div>
                <div class="profile-item">
                    <label><i class="fas fa-chart-line"></i> Monthly Total</label>
                    <span style="color: var(--secondary-color); font-size: 1.5rem;">${household.monthlyWaste} kg</span>
                </div>
                <div class="profile-item">
                    <label><i class="fas fa-calculator"></i> Daily Average</label>
                    <span>${(household.monthlyWaste / 30).toFixed(1)} kg</span>
                </div>
                <div class="profile-item">
                    <label><i class="fas fa-user"></i> Per Capita</label>
                    <span>${(household.monthlyWaste / 30 / household.residents).toFixed(2)} kg</span>
                </div>
            </div>
        </div>

        <div class="profile-section">
            <h3>Collection History</h3>
            <div class="collection-history">
                ${household.collectionHistory.map(item => `
                    <div class="history-item">
                        <div>
                            <strong>${item.date}</strong>
                            <p style="font-size: 0.875rem; color: var(--text-light);">${item.type}</p>
                        </div>
                        <div style="text-align: right;">
                            <strong style="color: var(--primary-color); font-size: 1.25rem;">${item.amount} kg</strong>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('householdModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('householdModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Initialize Charts
function initCharts() {
    // Waste Collection Trends Chart
    const wasteCtx = document.getElementById('wasteChart');
    if (wasteCtx && !wasteCtx.chartInstance) {
        wasteCtx.chartInstance = new Chart(wasteCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Waste Collected (kg)',
                    data: [1650, 1820, 1730, 1890, 1950, 1680, 1847],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Compliance Chart
    const complianceCtx = document.getElementById('complianceChart');
    if (complianceCtx && !complianceCtx.chartInstance) {
        complianceCtx.chartInstance = new Chart(complianceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Compliant', 'Pending', 'Missed'],
                datasets: [{
                    data: [75, 15, 10],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Render Leaderboard
    renderLeaderboard();
}

// Render Leaderboard
function renderLeaderboard() {
    const leaderboard = householdsData
        .sort((a, b) => b.monthlyWaste - a.monthlyWaste)
        .slice(0, 5);

    const container = document.getElementById('leaderboardList');
    container.innerHTML = leaderboard.map((household, index) => {
        let rankClass = 'regular';
        if (index === 0) rankClass = 'gold';
        else if (index === 1) rankClass = 'silver';
        else if (index === 2) rankClass = 'bronze';

        return `
            <div class="leaderboard-item">
                <div class="rank ${rankClass}">${index + 1}</div>
                <div class="leaderboard-info">
                    <h4>${household.name}</h4>
                    <p>${household.address}</p>
                </div>
                <div class="leaderboard-score">${household.monthlyWaste} kg</div>
            </div>
        `;
    }).join('');
}

// Generate Report
function generateReport() {
    alert('Generating comprehensive report...\n\nReport will include:\n- Daily waste collection summary\n- Truck performance metrics\n- Household compliance rates\n- Zone-wise analysis\n\nReport will be downloaded as PDF.');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderActivityList();
    renderTruckList();
    renderHouseholds();
});
