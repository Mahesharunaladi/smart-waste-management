# Smart Waste Management System

An attractive, real-time web application for monitoring and managing waste collection in residential colonies. Track garbage trucks, monitor household waste disposal, and analyze collection data with an intuitive dashboard.

## Features

### Dashboard
- **Real-time Statistics**: View active trucks, total waste collected, household count, and daily collections
- **Activity Feed**: Monitor recent activities including collections, truck movements, and alerts
- **Quick Actions**: Fast access to truck tracking, household management, and report generation

### Live Truck Tracking
- **Real-time GPS Tracking**: Monitor garbage truck locations on an interactive map
- **Truck Details**: View truck ID, driver name, capacity level, route, and last collection time
- **Status Filtering**: Filter trucks by status (All, Active, Idle)
- **Live Updates**: Automatic position updates every 5 seconds
- **Interactive Map**: Click on trucks or households for detailed information

### Household Management
- **Comprehensive Profiles**: Track each household's waste disposal history
- **Search & Filter**: Easily find households by name, ID, or address
- **Status Monitoring**: See which households are compliant, pending, or missed collections
- **Detailed Information**:
  - Contact details and resident count
  - Today's waste collected
  - Monthly waste totals
  - Per capita waste generation
  - Complete collection history with dates, amounts, and waste types

### Analytics & Reports
- **Waste Collection Trends**: Visual charts showing daily/weekly collection patterns
- **Compliance Rates**: Pie chart showing household compliance statistics
- **Leaderboard**: Top contributing households ranked by monthly waste collection
- **Report Generation**: Download comprehensive PDF reports

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection (for loading external libraries)

### Installation

1. **Clone or download** the repository to your local machine

2. **Navigate** to the project directory:
   ```bash
   cd smart-waste-management-1
   ```

3. **Open** `index.html` in your web browser:
   - Double-click the file, or
   - Right-click and select "Open with" your preferred browser, or
   - Use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     ```

4. **Access** the application at:
   - Direct: `file:///path/to/index.html`
   - Local server: `http://localhost:8000`

## 📁 Project Structure

```
smart-waste-management-1/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── app.js              # JavaScript logic and data management
└── README.md           # Project documentation
```

## 🎨 Features Breakdown

### Dashboard Section
- 4 statistics cards showing key metrics
- Recent activity timeline
- Quick action buttons for common tasks

### Truck Tracking Section
- Split-screen layout with truck list and map
- Real-time truck position updates
- Truck status indicators (Active/Idle)
- Capacity levels and route information
- Interactive markers with popups

### Households Section
- Grid layout with household cards
- Color-coded status badges:
  - 🟢 **Green** (Compliant): Waste collected today
  - 🟡 **Yellow** (Pending): Collection scheduled
  - 🔴 **Red** (Missed): Collection overdue
- Detailed modal view with complete household information
- Search functionality
- Status-based filtering

### Analytics Section
- Line chart: 7-day waste collection trends
- Doughnut chart: Household compliance distribution
- Top 5 contributors leaderboard with rankings

## 🛠️ Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with gradients, animations, and flexbox/grid layouts
- **JavaScript (ES6+)**: Interactive functionality and data management
- **Leaflet.js**: Interactive maps and markers
- **Chart.js**: Data visualization and charts
- **Font Awesome**: Icons throughout the interface

## 📱 Responsive Design

The application is fully responsive and works on:
- 🖥️ Desktop computers (1400px+)
- 💻 Laptops (1024px - 1400px)
- 📱 Tablets (768px - 1024px)
- 📱 Mobile phones (<768px)

## 🎯 Usage Guide

### Monitoring Trucks
1. Click **"Truck Tracking"** in the navigation bar
2. View the list of all active trucks on the left
3. Click any truck to focus on it on the map
4. Use filters to view Active or Idle trucks only
5. Watch real-time position updates

### Checking Household Profiles
1. Click **"Households"** in the navigation bar
2. Browse through household cards or use search
3. Click any household card to view detailed profile
4. View collection history, waste statistics, and contact information
5. Filter by status (All, Compliant, Pending, Missed)

### Viewing Analytics
1. Click **"Analytics"** in the navigation bar
2. Review waste collection trends over time
3. Check household compliance rates
4. See top contributing households
5. Click "Generate Report" for detailed PDF reports

## 🔧 Customization

### Adding New Trucks
Edit the `trucksData` array in `app.js`:
```javascript
{
    id: 'TRUCK-006',
    status: 'active',
    driver: 'Driver Name',
    location: [latitude, longitude],
    capacity: 50,
    route: 'Zone E',
    lastCollection: '10 mins ago'
}
```

### Adding New Households
Edit the `householdsData` array in `app.js`:
```javascript
{
    id: 'H-009',
    name: 'Family Name',
    address: 'Complete Address',
    status: 'compliant',
    phone: '+91 xxxxx xxxxx',
    residents: 4,
    lastDump: '2024-03-01',
    wasteAmount: 15.0,
    monthlyWaste: 350,
    collectionHistory: [...]
}
```

### Changing Map Center
Modify the map initialization in `app.js`:
```javascript
map = L.map('map').setView([YOUR_LAT, YOUR_LONG], ZOOM_LEVEL);
```

## 🎨 Color Scheme

- **Primary Green**: `#10b981` - Success, compliant status
- **Secondary Cyan**: `#06b6d4` - Active elements, links
- **Warning Orange**: `#f59e0b` - Pending status, alerts
- **Danger Red**: `#ef4444` - Missed collections, errors
- **Dark Background**: `#1f2937` - Navigation bar
- **Light Background**: `#f9fafb` - Main content area

## 🔮 Future Enhancements

- [ ] Backend integration with real database
- [ ] User authentication and role-based access
- [ ] SMS/Email notifications for collections
- [ ] Mobile app version (React Native)
- [ ] AI-powered route optimization
- [ ] Integration with IoT sensors in bins
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Export data to Excel/CSV
- [ ] Real-time notifications
- [ ] Weather-based collection scheduling

## 📄 License

This project is open source and available for educational and commercial use.

## 👤 Author

**Mahesh Arun Aladi**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, email your contact or create an issue in the repository.

---

