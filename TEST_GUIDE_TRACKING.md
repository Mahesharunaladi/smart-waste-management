# Live Tracking - Test Guide with Sample Data

## 🧪 Testing the Live Tracking Feature

### Prerequisites
- Backend running: `http://localhost:3001` ✅
- Frontend running: `http://localhost:3000` ✅
- Database: MongoDB connected ✅

---

## 📞 Sample Driver Phone Numbers to Test

These are the default phone numbers in the sample data:

```
Driver 1:  9876543210  → Truck T001 (Jayanagar)
Driver 2:  9876543211  → Truck T002 (Kuvempunagar)
Driver 3:  9876543212  → Truck T003 (Depot)
Driver 4:  9876543213  → Truck T004 (Vijayanagar)
```

---

## 🧬 Test Case 1: Basic Search

### Steps:
1. Open: http://localhost:3000/live-tracking.html
2. Enter: `9876543210`
3. Click: "Track" button

### Expected Results:
✓ Truck T001 appears on map
✓ Driver "Ramesh Kumar" displays
✓ Location: Jayanagar shown
✓ Waste collected: 245 kg
✓ 7 households listed
✓ Map auto-centers

### Data Shown:
```
Truck ID: T001
Driver: Ramesh Kumar
Phone: 9876543210
Status: Active (green)
Zone: Jayanagar
Waste: 245 kg
Collections: 15
Capacity: 24.5% (245/1000 kg)
Last Update: [Current Time]
```

---

## 🧬 Test Case 2: Autocomplete Suggestions

### Steps:
1. Open: http://localhost:3000/live-tracking.html
2. Start typing: `987`
3. Wait for suggestions

### Expected Results:
✓ Dropdown shows suggestions
✓ Shows driver name
✓ Shows phone number
✓ Shows current status
✓ Shows zone

### Suggestions Shown:
```
Ramesh Kumar
9876543210 • Jayanagar
[Status: Active]

Suresh Babu
9876543211 • Kuvempunagar
[Status: Active]

...more results
```

---

## 🧬 Test Case 3: Quick Search (Press Enter)

### Steps:
1. Open: http://localhost:3000/live-tracking.html
2. Enter: `9876543211`
3. Press: Enter key

### Expected Results:
✓ Auto-triggers search
✓ Truck T002 loads
✓ Driver "Suresh Babu" displays
✓ Kuvempunagar location shows
✓ 6 households listed

---

## 🧬 Test Case 4: Dashboard Integration

### Steps:
1. Open: http://localhost:3000/dashboard.html
2. Navigate to: "Trucks" section
3. Find: Truck card with "Track Live" button
4. Click: "Track Live" button

### Expected Results:
✓ Redirected to live-tracking.html
✓ Phone number pre-filled
✓ Truck automatically tracked
✓ Map and info load automatically

---

## 🧬 Test Case 5: Real-Time Updates

### Steps:
1. Track any truck (9876543213)
2. Wait 5 seconds
3. Observe coordinates

### Expected Results:
✓ Location slightly changes (simulated movement)
✓ Last update timestamp updates
✓ Map marker moves
✓ Live indicator pulsing
✓ No manual refresh needed

### Data Updates Every 5 Seconds:
```
Last updated: 14:35:22
(wait 5 seconds)
Last updated: 14:35:27
(wait 5 seconds)
Last updated: 14:35:32
```

---

## 🧬 Test Case 6: Invalid Phone Number

### Steps:
1. Open: http://localhost:3000/live-tracking.html
2. Enter: `1234567890` (invalid)
3. Click: "Track"

### Expected Results:
✓ Error message appears: "No truck found"
✓ Red error box displays
✓ Map remains empty
✓ Info section shows "Error"

---

## 🧬 Test Case 7: Partial Phone Search

### Steps:
1. Open: http://localhost:3000/live-tracking.html
2. Start typing: `9876543` (partial)
3. Observe suggestions

### Expected Results:
✓ All matching trucks appear
✓ Shows all drivers with this prefix
✓ Can select any suggestion
✓ Completes the phone number

---

## 🧬 Test Case 8: Map Interaction

### Steps:
1. Track a truck: `9876543210`
2. Click on truck marker
3. Click on household marker
4. Zoom in/out
5. Drag map

### Expected Results:
✓ Truck popup shows details
✓ Household popup shows address
✓ Map zooms smoothly
✓ Pan works smoothly
✓ Markers stay visible

---

## 🧬 Test Case 9: Capacity Indicator

### Steps:
1. Track truck: `9876543213` (highest waste: 312 kg)
2. Observe capacity bar

### Expected Results:
✓ Capacity bar shows percentage
✓ For 312/1000: ~31% filled
✓ Color: Gradient (blue-purple)
✓ Label shows exact values

### Capacity Display:
```
Truck Capacity: 312 / 1000 kg
[████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 31.2%
```

---

## 🧬 Test Case 10: Assigned Households

### Steps:
1. Track truck: `9876543210`
2. Scroll to "Assigned Households"
3. Count households
4. Verify coordinates on map

### Expected Results:
✓ 7 households listed
✓ Each with ID and address
✓ Markers appear on map
✓ Household names match

### Expected Households:
```
House #12, 1st Main (H001)
House #15, 1st Main (H002)
House #18, 2nd Cross (H003)
House #21, 2nd Cross (H004)
House #25, 3rd Main (H005)
House #30, 4th Main (H006)
House #35, 5th Cross (H007)
```

---

## 🧬 Test Case 11: Manual Refresh

### Steps:
1. Track any truck
2. Note the timestamp
3. Wait
4. Click "Refresh Now" button
5. Check timestamp

### Expected Results:
✓ Timestamp updates immediately
✓ Data refreshes
✓ No need to re-enter phone
✓ Button is always available

---

## 🧬 Test Case 12: Different Truck Statuses

### Steps:
1. Track truck T001 (Active)
2. Check marker color: Green
3. Track truck T003 (Idle)
4. Check marker color: Orange

### Expected Results:
✓ T001: Green marker = Active
✓ T003: Orange marker = Idle
✓ Status badge shows correctly
✓ Color matches status

### Color Reference:
```
Active     → 🟢 Green (#10b981)
Idle       → 🟠 Orange (#f59e0b)
Maintenance → 🟡 Yellow (#fbbf24)
Offline    → ⚫ Gray (#d1d5db)
```

---

## 📊 Test Data Summary

| Truck | Driver | Phone | Status | Location | Waste |
|-------|--------|-------|--------|----------|-------|
| T001 | Ramesh Kumar | 9876543210 | Active | Jayanagar | 245 kg |
| T002 | Suresh Babu | 9876543211 | Active | Kuvempunagar | 189 kg |
| T003 | Yallappa | 9876543212 | Idle | Depot | 0 kg |
| T004 | Ravi Shankar | 9876543213 | Active | Vijayanagar | 312 kg |

---

## 🔍 Inspection Tips

### Check Browser Console (F12)
```javascript
// Should show no errors
// Check Console tab for logs
// Check Network tab for API calls
```

### API Calls Made:
1. **Search**: `GET /api/trucks/search/phone/:query`
   - Response: List of matching trucks

2. **Track**: `GET /api/trucks/track/by-phone/:phone`
   - Response: Complete truck data

3. **Auto-refresh**: Same track endpoint every 5s

---

## ✅ Success Checklist

- [ ] Can enter phone number
- [ ] Autocomplete suggestions appear
- [ ] Can track truck by phone
- [ ] Map loads correctly
- [ ] Truck marker appears
- [ ] Household markers appear
- [ ] Real-time updates work (5s)
- [ ] Information displays correctly
- [ ] Capacity bar shows percentage
- [ ] Status badges are correct colors
- [ ] Error handling works
- [ ] Manual refresh works
- [ ] Can click markers for popups
- [ ] Dashboard integration works
- [ ] Mobile responsive

---

## 🐛 Debugging

### If Search Not Working:
```javascript
// Check in console:
// 1. Is API responding?
fetch('http://localhost:3001/api/trucks/search/phone/987')
  .then(r => r.json())
  .then(d => console.log(d))

// 2. Expected response:
{
  "success": true,
  "count": 2,
  "results": [...]
}
```

### If Track Not Working:
```javascript
// Check full truck data:
fetch('http://localhost:3001/api/trucks/track/by-phone/9876543210')
  .then(r => r.json())
  .then(d => console.log(d))

// Expected keys:
{
  "success": true,
  "tracking": {
    "truckId": "T001",
    "driverName": "...",
    "location": {...},
    "assignedHouseholds": [...]
  }
}
```

### If Map Not Loading:
```javascript
// Check Leaflet:
console.log(L) // Should show Leaflet object
console.log(map) // Should show map instance after loading
```

---

## 📈 Performance Metrics

### Expected Response Times:
- Search API: < 500ms
- Track API: < 500ms
- Map Load: 2-3 seconds
- Suggestions: Real-time < 100ms
- Auto-refresh: Every 5 seconds

---

## 🎓 Learning Outcomes

After testing, you should understand:
- ✓ How to track trucks by phone
- ✓ How real-time updates work
- ✓ How autocomplete suggestions work
- ✓ How the map displays data
- ✓ How status indicators work
- ✓ How capacity percentages calculate
- ✓ How to handle errors
- ✓ How dashboard integrates with tracking

---

**Test Completed**: Use these scenarios to verify all functionality works correctly!
