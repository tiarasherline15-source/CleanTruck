# WeMS Frontend-to-Backend Mapping Report

This report is based on the current React + TypeScript frontend in the project, including the login, registration, resident dashboard, collector dashboard, admin dashboard, and notification drawer.

> Key observation: the frontend currently uses mock arrays and local state rather than formal domain interfaces. Most “entities” are inferred from the mock data and UI rendering logic.

---

## 1. User Roles & Auth

### Roles present in the UI
- Resident
  - Entry route: `/dashboard`
  - Main purpose: request waste pickup, view request history, manage preferences
- Collector
  - Entry route: `/collector`
  - Main purpose: manage assigned pickups, operate routes, view collection history
- Admin
  - Entry route: `/admin`
  - Main purpose: oversee platform metrics, manage users, review reports

### Auth flow
- Login screen
  - Fields: email, password
  - Action: form submit placeholder only; no backend auth logic yet
- Register screen
  - Fields: name, email, phone, address, zone, password, confirmPassword
  - Action: form submit placeholder only; no backend registration logic yet

### Role-specific navigation and dashboard behavior

#### Resident
- Sidebar:
  - Overview
  - My Requests
  - Schedule Pickup
  - Settings
- Main actions:
  - Create a pickup request via a dialog
  - View recent activity
  - View all requests by status
  - Open settings/profile dialogs
  - Open notifications

#### Collector
- Sidebar:
  - Overview
  - Route Management
  - Collection History
  - Settings
- Main actions:
  - Start/pause route
  - Complete pickup
  - View assigned pickups
  - View route cards
  - View historical collection records
  - Open settings/profile dialogs

#### Admin
- Sidebar:
  - Overview
  - User Management
  - Collection Reports
  - Settings
- Main actions:
  - View platform stats and charts
  - Search/filter users
  - View reports and sector performance
  - Export data
  - View/edit/delete user actions (UI buttons only; no implemented handlers)

### User/profile fields visible in the UI

#### Registration form shape
- name: string
- email: string
- phone: string
- address: string
- zone: string
- password: string
- confirmPassword: string

#### Resident profile shape
- name: string
- email: string
- phone: string
- address: string
- memberSince: string
- totalRequests: number

#### Collector profile shape
- name: string
- email: string
- phone: string
- zone: string
- memberSince: string
- totalCollections: number

#### Admin user list shape
- id: number
- name: string
- email: string
- role: string
- status: string
- collections: number
- joinDate: string

---

## 2. Data Models

### Important note
There are no formal domain interfaces like `interface CollectionRequest` in the current frontend. The entities below are inferred from the mock arrays and UI rendering logic.

### A. CollectionRequest
Used by the resident dashboard.

| Field | Type | Required? | Notes |
|---|---|---:|---|
| id | number | Yes | Unique request id |
| date | string | Yes | Displayed as date |
| time | string | Yes | Displayed as time |
| wasteType | string | Yes | Example values: General Waste, Recyclables, Organic Waste, E-Waste |
| status | string | Yes | Values used: pending, in_progress, completed |
| address | string | Yes | Pickup address |

### B. AssignedPickup
Used by the collector dashboard.

| Field | Type | Required? | Notes |
|---|---|---:|---|
| id | number | Yes | Unique pickup id |
| address | string | Yes | Pickup address |
| resident | string | Yes | Resident name |
| phone | string | Yes | Resident phone |
| wasteType | string | Yes | Waste category |
| scheduledTime | string | Yes | Time slot |
| priority | string | Yes | Values: high, normal, low |
| status | string | Yes | Values: pending, completed |
| estimatedWeight | string | Yes | Example: “15 kg” |

### C. Route
Used by the collector dashboard’s route management tab.

| Field | Type | Required? | Notes |
|---|---|---:|---|
| id | number | Yes | Unique route id |
| name | string | Yes | Display name |
| stops | number | Yes | Count of stops |
| distance | string | Yes | Displayed as distance |
| estimatedTime | string | Yes | Displayed as journey duration |
| status | string | Yes | Values: active, upcoming |

### D. CollectionHistoryRecord
Used by the collector dashboard’s history tab.

| Field | Type | Required? | Notes |
|---|---|---:|---|
| id | number | Yes | Unique history id |
| date | string | Yes | Date of collection summary |
| pickups | number | Yes | Count of pickups in that record |
| weight | string | Yes | Total weight |
| route | string | Yes | Route label |
| duration | string | Yes | Duration of that route/day |

### E. UserAccount / UserProfile
Used by the admin dashboard and profile dialogs.

| Field | Type | Required? | Notes |
|---|---|---:|---|
| id | number | Yes in admin mock data | Not always present in profile dialogs |
| name | string | Yes | Full name |
| email | string | Yes | Login/contact identifier |
| role | string | Yes in admin mock data | Values: resident, collector, admin |
| status | string | Yes in admin mock data | Values: active, inactive, on_leave |
| collections | number | Yes in admin mock data | Used as activity metric |
| joinDate | string | Yes in admin mock data | Date joined |
| phone | string | Optional/implicit | Present in profile dialogs |
| address | string | Optional/implicit | Present in profile dialogs |
| zone | string | Optional/implicit | Present in collector/resident registration UI |
| memberSince | string | Optional/implicit | Displayed in profile dialogs |
| totalRequests | number | Optional/implicit | Resident profile |
| totalCollections | number | Optional/implicit | Collector profile |

### F. AnalyticsData
Used by the admin overview.

| Field | Type | Required? | Notes |
|---|---|---:|---|
| totalCollections | number | Yes | Overall count |
| totalWeight | string | Yes | Displayed as “tons” |
| activeUsers | number | Yes | Total active users |
| activeCollectors | number | Yes | Total active collectors |
| collectionRate | number | Yes | Percentage |
| recyclingRate | number | Yes | Percentage |
| weeklyGrowth | number | Yes | Growth metric |
| avgResponseTime | string | Yes | Example: “2.4 hrs” |

### G. WeeklyStat
Used for admin weekly charts.

| Field | Type | Required? | Notes |
|---|---|---:|---|
| day | string | Yes | Weekday label |
| collections | number | Yes | Daily count |
| weight | number | Yes | Tons or weight value |

### H. WasteDistributionItem
Used in admin waste distribution chart.

| Field | Type | Required? | Notes |
|---|---|---:|---|
| type | string | Yes | Waste type label |
| percentage | number | Yes | Percentage |
| color | string | Yes | Tailwind-style class |

### I. MonthlyReport
Used by admin reports tab.

| Field | Type | Required? | Notes |
|---|---|---:|---|
| id | number | Yes | Unique report id |
| period | string | Yes | Month/year label |
| totalCollections | number | Yes | Count |
| totalWeight | string | Yes | String label |
| recyclingRate | number | Yes | Percentage |
| status | string | Yes | Current value: completed |

### J. SectorReport
Used by admin sector performance table.

| Field | Type | Required? | Notes |
|---|---|---:|---|
| sector | string | Yes | Sector label |
| collections | number | Yes | Count |
| weight | string | Yes | Displayed weight |
| efficiency | number | Yes | Percentage |
| collectors | number | Yes | Collector count |

### K. Alert
Used by admin alerts panel.

| Field | Type | Required? | Notes |
|---|---|---:|---|
| id | number | Yes | Unique alert id |
| type | string | Yes | Values: warning, info, success, error |
| message | string | Yes | Text |
| time | string | Yes | Relative time |

### L. NotificationItem
Used by the notification drawer.

| Field | Type | Required? | Notes |
|---|---|---:|---|
| id | number | Yes | Unique notification id |
| title | string | Yes | Title |
| description | string | Yes | Message body |
| time | string | Yes | Relative time |
| unread | boolean | Optional | Present in some sample items |

### Relationships implied by the UI
- A resident request is associated with a resident address and waste type, but the UI does not model a real `residentId` or `requesterId`.
- A collector pickup is associated with a resident and a collector context, but no explicit `collectorId` or `residentId` relation exists in the UI data.
- A route appears to be an aggregate of multiple stops, but the UI does not model individual stops as first-class entities.
- A collection history record appears to summarize one route/day, but it is not linked to underlying pickup records.
- An admin user is associated with a role and status, and the UI implies that a role controls which dashboard the user sees.
- Notifications appear conceptually tied to a user, but no notification receiver or related entity is modeled.

---

## 3. Features Per Screen / Component

### Public / entry screens
- Landing page
  - Displays marketing content and CTAs
  - No real backend data consumed
- Login
  - Collects credentials
  - No real auth action implemented
- Register
  - Collects account/profile information
  - No actual account creation implemented

### Resident dashboard
Displays:
- Welcome banner with next pickup
- Recent activity list of requests
- Request stats
- Full request history by status

Actions:
- Create a new request via dialog
- View all requests
- Change notification/settings preferences
- Open profile dialog
- Open notifications

State changes:
- `activeTab`
- `scheduleOpen`
- `viewAllOpen`
- `settingsOpen`
- `profileOpen`
- `notificationsOpen`

### Collector dashboard
Displays:
- Welcome banner
- Pickup statistics
- Assigned pickups list with resident, address, waste type, priority, weight, status
- Route management cards
- Collection history table

Actions:
- Mark a pickup as completed
- Start or pause a route
- View route details
- View historical collection records
- Open settings/profile dialogs

State changes:
- `activeTab`
- `pickups` array (mutated when a pickup is completed)
- `isRouteActive`
- `settingsOpen`
- `profileOpen`
- `notificationsOpen`

### Collector route management UI (important)
The route management screen is currently a lightweight planning UI:

- A “route” is represented as:
  - name
  - stop count
  - distance
  - estimated time
  - status (active/upcoming)

What the UI does:
- Displays route cards
- Shows route metrics
- Lets the collector start/view an active route
- Does not currently show an ordered list of actual stop objects
- Does not support drag-and-drop reordering
- Does not support stop-level actions such as skip, delay, or complete from the route UI itself

This is an important gap for backend modeling: the current UI implies a route contains stops, but the actual stop entity is not implemented.

### Admin dashboard
Displays:
- Summary metric cards
- Recent activity/alerts
- Weekly collections chart
- Waste distribution chart
- Collection rate/recycling rate widgets
- User management table
- Monthly reports table
- Sector performance table

Actions:
- Search users
- Filter users by role
- View/Edit/Delete user actions (buttons only, no handlers)
- Export data
- View reports

State changes:
- `activeTab`
- `searchQuery`
- `roleFilter`

---

## 4. Mock Data Review

### Mock data sources
- Resident requests: `src/pages/Dashboard.tsx`
- Collector pickups/routes/history: `src/pages/CollectorDashboard.tsx`
- Admin analytics/users/reports: `src/pages/AdminDashboard.tsx`
- Notifications: `src/components/ui/NotificationDrawer.tsx`

### Example records

#### CollectionRequest
```json
{
  "id": 1,
  "date": "2026-01-10",
  "time": "08:00 AM",
  "wasteType": "General Waste",
  "status": "pending",
  "address": "123 Main St"
}
```

#### AssignedPickup
```json
{
  "id": 1,
  "address": "123 Green Lane, Sector 5",
  "resident": "John Doe",
  "phone": "+1 234 567 890",
  "wasteType": "General Waste",
  "scheduledTime": "08:00 AM",
  "priority": "high",
  "status": "pending",
  "estimatedWeight": "15 kg"
}
```

#### Route
```json
{
  "id": 1,
  "name": "Sector 5-7 Morning Route",
  "stops": 8,
  "distance": "12.5 km",
  "estimatedTime": "2h 30m",
  "status": "active"
}
```

#### CollectionHistoryRecord
```json
{
  "id": 1,
  "date": "2026-01-09",
  "pickups": 12,
  "weight": "156 kg",
  "route": "Sector 5-7",
  "duration": "2h 15m"
}
```

#### Admin user
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "resident",
  "status": "active",
  "collections": 24,
  "joinDate": "2025-08-15"
}
```

#### Monthly report
```json
{
  "id": 1,
  "period": "January 2026",
  "totalCollections": 2847,
  "totalWeight": "42.5 tons",
  "recyclingRate": 67.8,
  "status": "completed"
}
```

#### Alert
```json
{
  "id": 1,
  "type": "warning",
  "message": "High volume expected in Sector 3 tomorrow",
  "time": "2 hours ago"
}
```

#### Notification
```json
{
  "id": 1,
  "title": "Pickup confirmed",
  "description": "Your next waste collection has been scheduled for tomorrow morning.",
  "time": "2 minutes ago",
  "unread": true
}
```

---

## 5. Gaps or Ambiguities

### Auth / identity gaps
- Login and registration are placeholders; there is no implemented auth backend.
- The UI has resident/collector/admin roles, but there is no clear signup flow for assigning a role.
- No session or JWT/auth token model is represented in the frontend.

### Data modeling gaps
- No formal TypeScript interfaces for core business entities.
- The UI implies relationships between users, requests, pickups, routes, and notifications, but these are not explicitly modeled.
- The resident request has no explicit `residentId` or `collectorId` field.
- The collector pickup has no explicit `collectorId` or `requestId` link.

### Route / stop design gap
- The collector UI suggests a route contains stops, but there is no actual stop entity in the mock data.
- The route UI displays only aggregate counts and metrics; there is no ordered stop list, no route-stop assignment model, and no stop-level actions.
- A backend schema would need to decide whether stops are a separate entity or embedded inside a route.

### Status / enum ambiguity
- Status values are used inconsistently:
  - Resident requests: pending, in_progress, completed
  - Collector pickups: pending, completed
  - Admin users: active, inactive, on_leave
  - Routes: active, upcoming
- Some status values are referenced in UI config but not present in mock data (for example, cancelled).

### Derived vs stored fields
- Fields like “memberSince”, “totalRequests”, “totalCollections”, and “weeklyGrowth” appear to be derived or display-only values rather than clearly defined source fields.
- The admin metrics are aggregates, but the UI does not show how they are computed from the underlying entities.

### Action gaps
- Buttons like “Add User”, “Edit User”, “Delete User”, “View”, and “Export” exist in the UI but have no implemented backend actions.
- Settings toggles are present but not backed by any state model.

---

## Recommended backend starting point for the next AI/developer

A practical first backend schema would likely include:
- User
- Profile
- WasteRequest
- Pickup
- Route
- RouteStop
- CollectionHistory
- Notification
- ReportSummary / AnalyticsSnapshot
