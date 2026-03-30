# Live Tracking via Driver Phone Number

## Overview
This feature allows you to track trucks in real-time using the driver's phone number. It's useful for dispatchers and managers who need to locate specific trucks or monitor their movements.

## Features

### 1. **Phone Number Search**
- Enter any driver's phone number to instantly locate their truck
- Auto-complete suggestions show available drivers and their current status
- Real-time filtering as you type

### 2. **Live Map Display**
- Interactive map showing the truck's current location
- Markers for assigned households the truck needs to visit
- Map automatically centers and zooms to fit all markers

### 3. **Real-Time Updates**
- Auto-refresh every 5 seconds to keep location data current
- Live indicator showing tracking is active
- Last update timestamp

### 4. **Detailed Truck Information**
- Driver name and phone number
- Current truck status (Active, Idle, Maintenance, Offline)
- Waste collected today
- Number of collections completed
- Truck capacity percentage
- Assigned households list
- Zone information
- Exact coordinates

### 5. **Quick Access from Dashboard**
- "Track Live" button on each truck in the Trucks section
- Automatically populates the phone tracking page

## How to Use

### Method 1: Direct Phone Number Search
1. Navigate to **"Phone Tracking"** from the sidebar
2. Enter the driver's phone number (e.g., 9876543210)
3. Click **"Track"** or press Enter
4. View truck location and details in real-time

### Method 2: From Dashboard
1. Go to the **"Trucks"** section
2. Find the desired truck
3. Click the **"Track Live"** button
4. You'll be redirected to the tracking page with the phone number pre-filled

### Method 3: Autocomplete Selection
1. Start typing a phone number
2. Suggestions will appear with driver names and current status
3. Click on a suggestion to select it
4. Truck will be tracked automatically

## Backend API Endpoints

### Get Truck by Driver Phone
```
GET /api/trucks/track/by-phone/:phone
```
Returns complete truck data including location, driver info, and assigned households.

**Response:**
```json
{
  "success": true,
  "tracking": {
    "truckId": "T001",
    "driverName": "Ramesh Kumar",
    "driverPhone": "9876543210",
    "status": "active",
    "location": { "coordinates": [76.6553, 12.3051] },
    "totalWasteCollectedToday": 245,
    "totalCollectionsToday": 15,
    "currentCapacity": 450,
    "maxCapacity": 1000,
    "zone": "Jayanagar",
    "assignedHouseholds": [...]
  }
}
```

### Search Trucks by Phone
```
GET /api/trucks/search/phone/:query
```
Returns a list of trucks matching the phone number query (for autocomplete).

**Response:**
```json
{
  "success": true,
  "count": 2,
  "results": [
    {
      "truckId": "T001",
      "driverName": "Ramesh Kumar",
      "driverPhone": "9876543210",
      "status": "active",
      "zone": "Jayanagar"
    },
    ...
  ]
}
```

## Status Indicators

### Truck Status
- **Active** (Green): Truck is currently on duty collecting waste
- **Idle** (Orange): Truck is at depot or not actively collecting
- **Maintenance** (Yellow): Truck is under maintenance
- **Offline** (Gray): Truck is offline or no signal

## Map Features

### Truck Marker (Large)
- Shows current location with color-coded status
- Click to view popup with quick info
- Updates in real-time

### Household Markers (Small Blue)
- Shows assigned households for this truck
- Click to see household name and ID
- Helps visualize the route

### Map Controls
- Zoom in/out for detailed view
- Pan to explore surrounding areas
- Auto-fit button to center all markers

## Capacity Indicator

The capacity bar shows:
- Current waste load vs maximum capacity
- Visual percentage indicator
- Color-coded (fills up as truck collects waste)

## Refresh Options

- **Auto-Refresh**: Updates every 5 seconds automatically
- **Manual Refresh**: Click "Refresh Now" button for immediate update
- **Last Updated**: Shows timestamp of last data fetch

## Phone Number Format

Supported formats:
- `9876543210` (10 digits)
- `+919876543210` (International)
- `+91 9876 543210` (Formatted)
- All variations stored in database

## Error Handling

- **Phone Not Found**: Check if phone number is correct and exists in system
- **Truck Offline**: Truck may be offline or out of range
- **Network Error**: Check internet connection and server status
- Clear error messages help troubleshoot issues

## Performance

- **Live Updates**: 5-second refresh interval
- **Search Suggestions**: Real-time as you type
- **Map Rendering**: Optimized for smooth performance
- **Auto-cleanup**: Resources freed when page unloads

## Security Notes

- Phone number searches are performed on the backend
- No sensitive data exposed in URLs
- Session-based tracking prevents unauthorized access
- Phone numbers validated before database queries

## Browser Compatibility

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Truck Not Found
- Verify the phone number is correct
- Check if truck is registered in the system
- Ensure truck has driver assigned

### Map Not Loading
- Check internet connection
- Verify API server is running
- Clear browser cache

### Auto-Refresh Not Working
- Check browser console for errors
- Verify API endpoint is accessible
- Reload the page

## Future Enhancements

- [ ] Route history playback
- [ ] Multiple truck comparison
- [ ] Geofencing alerts
- [ ] Offline tracking
- [ ] Export tracking reports
- [ ] SMS notifications
- [ ] Integration with GPS devices
