# Live Tracking API Documentation

## Overview

The Live Tracking API allows you to find and track waste collection trucks in real-time using driver phone numbers.

---

## Base URL

```
http://localhost:3001/api
```

---

## Authentication

Currently, these endpoints are **public** (no authentication required). They can be restricted by adding auth middleware.

---

## Endpoints

### 1. Track Truck by Phone Number

Track a specific truck using the driver's phone number.

#### Request

```
GET /trucks/track/by-phone/:phone
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| phone | string | Yes | Driver's phone number (any format) |

#### Example Requests

```bash
# Basic format
curl "http://localhost:3001/api/trucks/track/by-phone/9876543210"

# With international format
curl "http://localhost:3001/api/trucks/track/by-phone/+919876543210"

# With formatting
curl "http://localhost:3001/api/trucks/track/by-phone/98765%2043210"
```

#### Response - Success (200)

```json
{
  "success": true,
  "message": "Truck tracking data retrieved",
  "tracking": {
    "truckId": "T001",
    "driverName": "Ramesh Kumar",
    "driverPhone": "9876543210",
    "status": "active",
    "location": {
      "type": "Point",
      "coordinates": [76.6553, 12.3051]
    },
    "address": "Jayanagar Colony, Mysore",
    "zone": "Jayanagar",
    "currentCapacity": 245,
    "maxCapacity": 1000,
    "totalWasteCollectedToday": 245,
    "totalCollectionsToday": 15,
    "assignedHouseholds": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "householdId": "H001",
        "name": "Rajesh Family",
        "address": "House #12, 1st Main",
        "location": {
          "type": "Point",
          "coordinates": [76.6553, 12.3051]
        }
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "householdId": "H002",
        "name": "Priya Household",
        "address": "House #15, 1st Main",
        "location": {
          "type": "Point",
          "coordinates": [76.6555, 12.3053]
        }
      }
    ],
    "lastCollection": "2026-03-30T14:30:00.000Z",
    "isActive": true,
    "timestamp": "2026-03-30T15:35:22.123Z"
  },
  "truck": {
    "_id": "607f1f77bcf86cd799439001",
    "truckId": "T001",
    "driver": {
      "name": "Ramesh Kumar",
      "phone": "9876543210",
      "license": "DL01234"
    },
    "status": "active",
    "location": {
      "type": "Point",
      "coordinates": [76.6553, 12.3051],
      "address": "Jayanagar Colony, Mysore"
    },
    "capacity": {
      "current": 245,
      "max": 1000
    },
    "route": {
      "zone": "Jayanagar",
      "assignedHouseholds": [...]
    },
    "createdAt": "2026-03-15T08:00:00.000Z",
    "updatedAt": "2026-03-30T15:35:22.123Z"
  }
}
```

#### Response - Not Found (404)

```json
{
  "success": false,
  "message": "No truck found for this phone number",
  "phone": "1234567890"
}
```

#### Response - Error (500)

```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details here"
}
```

---

### 2. Search Trucks by Phone (Autocomplete)

Search for trucks by partial phone number for autocomplete functionality.

#### Request

```
GET /trucks/search/phone/:query
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Partial or complete phone number (min 2 chars) |

#### Example Requests

```bash
# Search with partial number
curl "http://localhost:3001/api/trucks/search/phone/987"

# Search with complete number
curl "http://localhost:3001/api/trucks/search/phone/9876543210"

# Search with international format
curl "http://localhost:3001/api/trucks/search/phone/%2B919876"
```

#### Response - Success (200)

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
      "zone": "Jayanagar",
      "location": {
        "type": "Point",
        "coordinates": [76.6553, 12.3051]
      }
    },
    {
      "truckId": "T002",
      "driverName": "Suresh Babu",
      "driverPhone": "9876543211",
      "status": "active",
      "zone": "Kuvempunagar",
      "location": {
        "type": "Point",
        "coordinates": [76.6590, 12.3110]
      }
    }
  ]
}
```

#### Response - Short Query (400)

```json
{
  "success": false,
  "message": "Query must be at least 2 characters",
  "results": []
}
```

#### Response - No Results (200)

```json
{
  "success": true,
  "count": 0,
  "results": []
}
```

---

## Data Types & Formats

### Location Object

```json
{
  "type": "Point",
  "coordinates": [longitude, latitude]
}
```

**Note**: Coordinates are in GeoJSON format [longitude, latitude], but displayed to users as [latitude, longitude] for map purposes.

### Status Values

```
- "active"       → Truck is on duty
- "idle"         → Truck is at depot
- "maintenance"  → Truck is under maintenance
- "offline"      → Truck is offline
```

### Truck Object

```json
{
  "truckId": "T001",
  "driverName": "Ramesh Kumar",
  "driverPhone": "9876543210",
  "status": "active",
  "location": {...},
  "currentCapacity": 245,
  "maxCapacity": 1000,
  "totalWasteCollectedToday": 245,
  "totalCollectionsToday": 15,
  "zone": "Jayanagar",
  "assignedHouseholds": [...],
  "lastCollection": "2026-03-30T14:30:00.000Z",
  "timestamp": "2026-03-30T15:35:22.123Z"
}
```

### Household Object

```json
{
  "householdId": "H001",
  "name": "Rajesh Family",
  "address": "House #12, 1st Main",
  "location": {
    "type": "Point",
    "coordinates": [76.6553, 12.3051]
  }
}
```

---

## Usage Examples

### JavaScript (Fetch API)

```javascript
// Track truck by phone
async function trackTruck(phone) {
  try {
    const response = await fetch(`http://localhost:3001/api/trucks/track/by-phone/${phone}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('Truck found:', data.tracking);
      console.log('Driver:', data.tracking.driverName);
      console.log('Location:', data.tracking.location.coordinates);
      console.log('Households:', data.tracking.assignedHouseholds);
    } else {
      console.error('Truck not found:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function
trackTruck('9876543210');
```

### JavaScript (Auto-refresh every 5 seconds)

```javascript
let refreshInterval;

function startTracking(phone) {
  // Track immediately
  trackTruck(phone);
  
  // Then refresh every 5 seconds
  refreshInterval = setInterval(() => {
    trackTruck(phone);
  }, 5000);
}

function stopTracking() {
  clearInterval(refreshInterval);
}
```

### JavaScript (Search with autocomplete)

```javascript
const inputField = document.getElementById('phoneInput');

inputField.addEventListener('input', async (e) => {
  const query = e.target.value.trim();
  
  if (query.length < 2) return;
  
  try {
    const response = await fetch(`http://localhost:3001/api/trucks/search/phone/${query}`);
    const data = await response.json();
    
    if (data.success) {
      // Display suggestions
      displaySuggestions(data.results);
    }
  } catch (error) {
    console.error('Search error:', error);
  }
});

function displaySuggestions(trucks) {
  const suggestions = trucks.map(truck => ({
    label: `${truck.driverName} (${truck.driverPhone})`,
    value: truck.driverPhone,
    status: truck.status
  }));
  
  // Show in UI
  console.log(suggestions);
}
```

### cURL Examples

```bash
# Track specific truck
curl -X GET "http://localhost:3001/api/trucks/track/by-phone/9876543210"

# Search trucks
curl -X GET "http://localhost:3001/api/trucks/search/phone/987"

# Pretty print JSON
curl -s "http://localhost:3001/api/trucks/track/by-phone/9876543210" | jq .

# Save response to file
curl -X GET "http://localhost:3001/api/trucks/track/by-phone/9876543210" -o truck_data.json
```

---

## Error Handling

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Truck found and tracked |
| 400 | Bad Request | Query too short |
| 404 | Not Found | No truck with phone |
| 500 | Server Error | Database error |

### Error Response Format

```json
{
  "success": false,
  "message": "Human readable error message",
  "error": "Technical error details (if applicable)"
}
```

### Handling Errors in Frontend

```javascript
async function safeTrack(phone) {
  try {
    const response = await fetch(`/api/trucks/track/by-phone/${phone}`);
    const data = await response.json();
    
    if (!data.success) {
      // Handle business logic errors
      showError(data.message);
      return null;
    }
    
    return data.tracking;
  } catch (error) {
    // Handle network errors
    console.error('Network error:', error);
    showError('Failed to connect to server');
    return null;
  }
}
```

---

## Rate Limiting & Performance

### Current Limits
- No rate limiting (can be added)
- Response time: < 500ms typically
- Database queries optimized with indexing

### Recommendations
- Implement rate limiting for production
- Cache frequent searches
- Batch multiple requests
- Use CDN for frontend

---

## Database Queries

### Truck Search

```javascript
// Searches driver phone field
db.trucks.find({ "driver.phone": { $regex: phone, $options: "i" } })
  .select('truckId driver.name driver.phone status location route.zone')
```

### Truck Track

```javascript
// Finds specific truck and populates households
db.trucks.findOne({ "driver.phone": phone })
  .populate('route.assignedHouseholds', 'householdId name address location')
```

---

## Implementation Details

### File Location
```
/backend/routes/trucks.js
```

### Route Handlers

```javascript
// Line ~186: GET /trucks/track/by-phone/:phone
router.get('/track/by-phone/:phone', async (req, res) => { ... });

// Line ~238: GET /trucks/search/phone/:query
router.get('/search/phone/:query', async (req, res) => { ... });
```

---

## Future Enhancements

- [ ] Rate limiting per IP
- [ ] Caching with Redis
- [ ] Webhook notifications
- [ ] Historical tracking data
- [ ] Multiple truck comparison
- [ ] Route prediction
- [ ] ETA calculation
- [ ] SMS notifications

---

## Support & Debugging

### Check Server Logs

```bash
# Terminal running backend
tail -f backend/backend.log
```

### Test Endpoints

```javascript
// In browser console
fetch('http://localhost:3001/api/trucks/track/by-phone/9876543210')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Verify Phone Format

```javascript
const phone = '9876543210';
const isValid = /^\d+$/.test(phone); // Basic validation
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-30 | Initial implementation |

---

**Last Updated**: March 30, 2026
**Status**: ✅ Production Ready
