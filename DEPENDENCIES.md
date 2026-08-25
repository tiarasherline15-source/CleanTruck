# CleanTruck Dependencies & Project Report

> **Last Updated:** August 25, 2026
> **Status:** Full-stack waste management platform - authentication, CRUD APIs, role-based dashboards, interactive maps, route management, and transactional email/SMS.

---

## Project Audit Summary

### Health Score: 7/10

| Area | Status | Notes |
|------|--------|-------|
| Backend Core | Good | Django 5.2, DRF, JWT auth, PostgreSQL |
| Frontend Core | Good | React 18, Vite, TypeScript, TailwindCSS |
| Unused Dependencies | Warning | 22 unused Shadcn/ui components installed |
| Security | Warning | Debug mode on by default, insecure secret key fallback |
| Email | Working | Resend integration functional (domain verification needed for production) |
| SMS | Ready | Africa's Talking installed, not yet wired to frontend |
| Maps | Good | Leaflet + OpenStreetMap with live tracking |
| Real-time | Installed | Channels + Redis installed but not wired to frontend |

---

## Backend Setup

### Python Requirements
**Location:** `Backend/CleanTruck_backend/requirements.txt`

**Install:**
```bash
cd Backend/CleanTruck_backend
pip install -r requirements.txt
```

### Core Dependencies
| Package | Version | Purpose | Status |
|---|---|---|---|
| Django | 5.2.17 | Web framework | Current |
| djangorestframework | 3.18.0 | REST API toolkit | Current |
| djangorestframework_simplejwt | 5.5.1 | JWT authentication | Current |
| PyJWT | 2.13.0 | JSON Web Token library | Current |
| django-cors-headers | 4.9.0 | CORS support for frontend | Current |
| psycopg2-binary | 2.9.12 | PostgreSQL driver | Current |
| Pillow | 12.1.0 | Image processing | Current |
| python-dotenv | 1.2.2 | Load `.env` files into Django settings | Current |
| sqlparse | 0.5.5 | SQL parsing | Current |

### External Services
| Package | Version | Purpose | Status |
|---|---|---|---|
| django-anymail | 15.1 | Email framework (multi-provider) | Configured |
| resend | 2.36.0 | Resend transactional email API | Active |
| africastalking | 2.0.3 | SMS / OTP via Africa's Talking | Installed, not wired to UI |
| geopy | 2.5.0 | Geocoding via Nominatim (OpenStreetMap) | Active |
| geographiclib | 2.1 | Geodesic calculations (geopy dep) | Dependency |
| django-cloudinary-storage | 0.3.0 | Django file storage backend | Active |
| cloudinary | 1.46.0 | Cloudinary Python SDK for uploaded media | Active |

### Real-Time Features (Optional, Installed)
| Package | Version | Purpose | Status |
|---|---|---|---|
| channels | 4.0.0 | WebSocket support | Installed, not wired |
| channels-redis | 4.1.0 | Redis channel layer | Installed, requires Redis |
| daphne | 4.0.0 | ASGI server for channels | Installed |
| redis | 7.1.0 | Redis client | Installed, requires Redis |
| asgiref | 3.11.0 | ASGI reference implementation | Dependency |

> **Note:** Real-time features require Redis running as a separate service. Not yet connected to the frontend.

### HTTP / Networking
| Package | Version | Purpose |
|---|---|---|
| requests | 2.34.2 | HTTP client library |
| certifi | 2026.7.22 | SSL certificate bundle |
| charset-normalizer | 3.5.1 | Character encoding detection |
| idna | 3.11 | Internationalized domain names |
| urllib3 | 2.7.0 | HTTP client library |

### Python Environment Note
Your virtual environment has extra packages not in requirements.txt:
- Flask, Flask-Login, Flask-SQLAlchemy, Flask-WTF (not used by this project)
- fpdf2, fonttools, freetype-py (not used by this project)
- git-filter-repo (development utility)
- Total: ~90 packages installed vs ~27 required

---

## Frontend Setup

### Node.js Requirements
**Location:** `Frontend/package.json`

**Install:**
```bash
cd Frontend
npm install
```

**Run Development Server:**
```bash
npm run dev
# Runs on http://localhost:5173
```

### Core Dependencies
| Package | Version | Purpose | Status |
|---|---|---|---|
| React | 18.3.1 | UI framework | Current |
| react-dom | 18.3.1 | React DOM renderer | Current |
| react-router-dom | 6.30.1 | Client-side routing | Current |
| TailwindCSS | 3.4.17 | Utility-first CSS styling | Current |
| React Hook Form | 7.61.1 | Form state management & validation | Active |
| @hookform/resolvers | 3.10.0 | Zod resolver for React Hook Form | Active |
| Zod | 3.25.76 | Schema validation | Active |
| @tanstack/react-query | 5.83.0 | Server state management & caching | Active |
| date-fns | 3.6.0 | Date utility library | Active |
| class-variance-authority | 0.7.1 | Component variant styling (CVA) | Dependency |
| clsx | 2.1.1 | Conditional classnames | Dependency |
| tailwind-merge | 2.6.0 | Merge Tailwind classes without conflicts | Dependency |
| tailwindcss-animate | 1.0.7 | Animation utilities for Tailwind | Dependency |
| next-themes | 0.3.0 | Theme management | Used by sonner toast |

### UI Components (Radix UI + Shadcn/ui)
**Actively Used (imported by project components):**

| Package | Used By |
|---|---|
| @radix-ui/react-checkbox | forms |
| @radix-ui/react-collapsible | sidebar |
| @radix-ui/react-dialog | DashboardDialog, dialog.tsx |
| @radix-ui/react-dropdown-menu | user menus |
| @radix-ui/react-label | form labels |
| @radix-ui/react-popover | date pickers |
| @radix-ui/react-progress | route progress bars |
| @radix-ui/react-scroll-area | notification drawer |
| @radix-ui/react-select | collector zone picker |
| @radix-ui/react-separator | visual separators |
| @radix-ui/react-slider | range inputs |
| @radix-ui/react-slot | component composition |
| @radix-ui/react-switch | toggle switches |
| @radix-ui/react-tabs | dashboard tabs |
| @radix-ui/react-toast | toast notifications |
| @radix-ui/react-toggle | toggle buttons |
| @radix-ui/react-tooltip | tooltips |
| lucide-react | 0.462.0 — Icon library (used everywhere) |
| sonner | 1.7.4 — Toast notification library |

**Unused (installed but no imports found):**

| Package | Purpose |
|---|---|
| @radix-ui/react-accordion | Collapsible content panels |
| @radix-ui/react-alert-dialog | Confirmation dialogs |
| @radix-ui/react-aspect-ratio | Responsive aspect ratios |
| @radix-ui/react-avatar | User avatars |
| @radix-ui/react-context-menu | Right-click context menus |
| @radix-ui/react-hover-card | Hover preview cards |
| @radix-ui/react-menubar | Application menus |
| @radix-ui/react-navigation-menu | Navigation menus |
| @radix-ui/react-radio-group | Radio button groups |
| @radix-ui/react-toggle-group | Grouped toggles |

**Unused Shadcn/ui component files (22 files):**
accordion, alert-dialog, aspect-ratio, avatar, breadcrumb, calender, carousel, chart, command, context-menu, drawer, ExportButton, hover-card, input-otp, menubar, navigation-menu, pagination, radio-group, resizable, scroll-area, sidebar, toggle-group

> These can be safely removed to reduce bundle size: `npm remove @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-context-menu @radix-ui/react-hover-card @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-radio-group @radix-ui/react-toggle-group`

### Maps & Charting
| Package | Version | Purpose | Status |
|---|---|---|---|
| leaflet | 1.9.4 | Interactive map library | Active (live tracking, route lines) |
| @types/leaflet | 1.9.22 | TypeScript types for Leaflet | Active |
| recharts | 2.15.4 | Charts and data visualization | Active (admin analytics) |

### PDF & Export
| Package | Version | Purpose | Status |
|---|---|---|---|
| jspdf | 4.2.1 | PDF generation | Active (exportCsv.ts) |
| jspdf-autotable | 5.0.8 | PDF table generation | Active (exportCsv.ts) |

> **Note:** `@types/jspdf` is pinned at 1.3.3 but jspdf is at 4.2.1. This type mismatch may cause issues. Consider removing `@types/jspdf` as jspdf 4.x ships its own types.

### Image Editing
| Package | Version | Purpose | Status |
|---|---|---|---|
| react-easy-crop | 6.2.3 | Image cropping for profile pictures | Active (ImageUpload.tsx) |

### Dev Dependencies
| Package | Version | Purpose | Status |
|---|---|---|---|
| TypeScript | 5.8.3 | Type checking | Current |
| Vite | 5.4.19 | Build tool & dev server | Current |
| @vitejs/plugin-react-swc | 3.11.0 | React SWC plugin for Vite | Current |
| ESLint | 9.32.0 | Code linting | Current |
| @eslint/js | 9.32.0 | ESLint core config | Current |
| typescript-eslint | 8.38.0 | TypeScript ESLint parser | Current |
| eslint-plugin-react-hooks | 5.2.0 | React hooks linting rules | Current |
| eslint-plugin-react-refresh | 0.4.20 | Fast refresh linting rules | Current |
| PostCSS | 8.5.6 | CSS processing | Current |
| autoprefixer | 10.4.21 | CSS vendor prefixing | Current |
| @tailwindcss/typography | 0.5.16 | Prose typography plugin | Current |
| globals | 15.15.0 | Global variables for ESLint | Current |
| @types/node | 22.16.5 | Node.js type definitions | Current |
| @types/react | 18.3.23 | React type definitions | Current |
| @types/react-dom | 18.3.7 | React DOM type definitions | Current |

---

## Environment Variables

All secrets are loaded from `Backend/CleanTruck_backend/.env` via `python-dotenv`.

**Template:** `Backend/CleanTruck_backend/.env.example`
**Actual:** `Backend/CleanTruck_backend/.env` (gitignored, never commit)

### Required Variables

| Variable | Description | Default | Status |
|---|---|---|---|
| `DJANGO_SECRET_KEY` | Django secret key | `django-insecure-change-me-in-production` | **Change for production** |
| `DJANGO_DEBUG` | Enable debug mode | `True` | **Set to False for production** |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated hosts | `localhost,127.0.0.1` | Set for production |
| `DB_NAME` | PostgreSQL database name | `cleantruckdb` | Required |
| `DB_USER` | PostgreSQL username | `postgres` | Required |
| `DB_PASSWORD` | PostgreSQL password | *(empty)* | Required |
| `DB_HOST` | PostgreSQL host | `localhost` | Required |
| `DB_PORT` | PostgreSQL port | `5433` | Required |
| `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` | JWT access token lifetime | `60` | Optional |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | JWT refresh token lifetime | `7` | Optional |
| `EMAIL_BACKEND` | Django email backend | `console.EmailBackend` | Set for production |
| `DEFAULT_FROM_EMAIL` | Sender email address | `noreply@cleantruck.com` | **Verify domain or use onboarding@resend.dev** |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` | Only if using SMTP backend |
| `EMAIL_PORT` | SMTP port | `587` | Only if using SMTP backend |
| `EMAIL_USE_TLS` | Enable TLS | `True` | Only if using SMTP backend |
| `EMAIL_HOST_USER` | SMTP username | *(empty)* | Only if using SMTP backend |
| `EMAIL_HOST_PASSWORD` | SMTP password | *(empty)* | Only if using SMTP backend |
| `RESEND_API_KEY` | Resend API key | *(empty)* | Required for email delivery |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | *(empty)* | Required for image uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key | *(empty)* | Required for image uploads |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | *(empty)* | Required for image uploads |
| `AT_USERNAME` | Africa's Talking username | *(empty)* | Required for SMS |
| `AT_API_KEY` | Africa's Talking API key | *(empty)* | Required for SMS |
| `AT_SENDER_ID` | Africa's Talking sender ID | `cleantruck` | Required for SMS |
| `REDIS_URL` | Redis connection URL | `redis://127.0.0.1:6379/0` | Only for WebSocket features |

### Frontend Environment Variable

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000/api` |

---

## External Services Configuration

### 1. Resend (Email) - ACTIVE
**File:** `Backend/CleanTruck_backend/CleanTruck_backend/settings.py`
**Implementation:** `Backend/CleanTruck_backend/core/utils_email.py`

Reads `RESEND_API_KEY` from `.env`.

**Current status:** Emails send successfully but only to verified addresses in sandbox mode. For production, verify your domain.

**Quick test:** Set `DEFAULT_FROM_EMAIL=onboarding@resend.dev` to send to any address without domain verification.

**Production setup:**
1. Go to https://resend.com/domains
2. Add and verify your domain (`cleantruck.com`)
3. Add DNS records (TXT, CNAME, MX) to your DNS provider
4. Update `.env`:
```env
EMAIL_BACKEND=django_anymail.backends.resend.EmailBackend
RESEND_API_KEY=re_your_api_key_here
DEFAULT_FROM_EMAIL=noreply@cleantruck.com
```

### 2. Africa's Talking (SMS/OTP) - INSTALLED, NOT WIRED
**File:** `Backend/CleanTruck_backend/core/utils_sms.py`
**Backend config:** `Backend/CleanTruck_backend/CleanTruck_backend/settings.py`

Reads `AT_USERNAME`, `AT_API_KEY`, `AT_SENDER_ID` from `.env`.

```env
AT_USERNAME=sandbox
AT_API_KEY=your_api_key_here
AT_SENDER_ID=cleantruck
```

**Setup:**
1. Go to https://africastalking.com
2. Create account (free sandbox for testing)
3. Get API key
4. Test with sandbox mode first

### 3. OpenStreetMap (Maps) - ACTIVE
- Configured in frontend via Leaflet.js
- No API key required
- Free for unlimited use
- Live tracking uses browser Geolocation API

### 4. Cloudinary (Uploaded Media) - ACTIVE
Cloudinary stores profile pictures and other uploaded files.

**Setup:**
1. Create an account at https://cloudinary.com
2. Copy cloud name, API key, and API secret from dashboard
3. Add them to `.env`
4. Restart Django server after changing `.env`

---

## Database Setup

### PostgreSQL Configuration
**File:** `Backend/CleanTruck_backend/CleanTruck_backend/settings.py`

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'cleantruckdb'),
        'USER': os.environ.get('DB_USER', 'postgres'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5433'),
    }
}
```

**Create Database:**
```bash
createdb -U postgres -p 5433 cleantruckdb
```

**Run Migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Models & Database Tables

All models are defined in `core/models.py` and registered in `core/admin.py`.

| Model | Description |
|---|---|
| **User** | Custom user extending `AbstractUser` with role (resident/collector/admin), status, phone, address, zone, profile picture, must_change_password, and is_phone_verified |
| **Route** | Collection routes assigned to collectors with stops count, distance, duration, status, and waypoints (JSON) |
| **PickupRequest** | Waste pickup requests from residents with waste type, priority, scheduling, status, zone, location (lat/lng), and weight tracking |
| **CollectionHistory** | Completed collection records linking pickup requests, collectors, routes, and weight data |
| **Notification** | User notifications with types (warning/info/success/error) and read status |
| **Zone** | Nairobi zones (Westlands, Kilimani, Karen, etc.) with coordinates and active status |
| **UserSettings** | Per-user notification preferences (email/SMS) and default pickup configuration |
| **RouteStops** | Individual stops along a route with sequence number, address, zone, timing, location, and linked pickup requests |
| **OTP** | One-time passwords for password reset, registration, and SMS verification |
| **ContactMessage** | Contact form submissions with name, email, subject, message, and status |

### Model Relationships
```
User (1) ──→ (N) Route           [collector]
User (1) ──→ (N) PickupRequest   [resident]
User (1) ──→ (N) PickupRequest   [collector]
User (1) ──→ (N) Notification
User (1) ──→ (1) UserSettings
User (1) ──→ (N) OTP

Route (1) ──→ (N) RouteStops
Route (1) ──→ (N) PickupRequest
Route (1) ──→ (N) CollectionHistory

PickupRequest (1) ──→ (N) CollectionHistory
PickupRequest (N) ──→ (N) RouteStops   [M2M]

Zone (1) ──→ (N) RouteStops
```

---

## API Endpoints

**Base URL:** `http://localhost:8000/api/`

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register/` | Register a new user | Public |
| POST | `/api/token/` | Obtain JWT access + refresh tokens | Public |
| POST | `/api/token/refresh/` | Refresh an access token | Public |
| GET | `/api/users/me/` | Get current user profile | Required |
| PATCH | `/api/users/me/` | Update current user profile | Required |
| POST | `/api/users/me/change-password/` | Change password and clear forced-password state | Required |

### Users (Admin)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users/` | List users (admin: all with search/role filter; others: self only) | Required |
| GET | `/api/users/{id}/` | Get user detail | Required |
| PATCH | `/api/users/{id}/` | Update user | Required |
| POST | `/api/users/create-collector/` | Create collector with temporary password + email credentials | Admin role |

**Query params:** `?search=<query>&role=<resident|collector|admin>`

### Contact Messages
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/contact-messages/` | Submit a contact message | Public |
| GET | `/api/contact-messages/` | List contact messages | Admin role |
| PATCH | `/api/contact-messages/{id}/` | Update message status/details | Admin role |
| DELETE | `/api/contact-messages/{id}/` | Delete a contact message | Admin role |

### Pickup Requests
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/pickups/` | List pickups (role-filtered: admin=all, collector=assigned, resident=own) | Required |
| POST | `/api/pickups/` | Create pickup request (auto-sets resident + zone from profile) | Required |
| GET | `/api/pickups/{id}/` | Get pickup detail | Required |
| PATCH | `/api/pickups/{id}/` | Update pickup (auto-creates route when collector assigned) | Required |
| DELETE | `/api/pickups/{id}/` | Delete pickup | Required |
| GET | `/api/pickups/my/` | Resident's own pickup requests | Required |
| GET | `/api/pickups/assigned/` | Collector's assigned pickup requests | Required |

### Routes
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/routes/` | List routes (admin=all, others=own) | Required |
| POST | `/api/routes/` | Create route | Required |
| GET | `/api/routes/{id}/` | Get route detail (includes stops) | Required |
| PATCH | `/api/routes/{id}/` | Update route | Required |
| DELETE | `/api/routes/{id}/` | Delete route | Required |
| GET | `/api/routes/{id}/stops/` | Get stops for a specific route | Required |

### Route Stops
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/route-stops/` | List route stops | Required |
| POST | `/api/route-stops/` | Create route stop | Required |
| GET | `/api/route-stops/{id}/` | Get route stop detail | Required |
| PATCH | `/api/route-stops/{id}/` | Update route stop | Required |
| DELETE | `/api/route-stops/{id}/` | Delete route stop | Required |

### Collection History
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/collection-history/` | List collection history (read-only) | Required |
| GET | `/api/collection-history/{id}/` | Get collection detail | Required |

### Notifications
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/notifications/` | List user's notifications | Required |
| POST | `/api/notifications/` | Create notification | Required |
| GET | `/api/notifications/{id}/` | Get notification detail | Required |
| PATCH | `/api/notifications/{id}/` | Update notification | Required |
| DELETE | `/api/notifications/{id}/` | Delete notification | Required |
| PATCH | `/api/notifications/{id}/read/` | Mark single notification as read | Required |
| POST | `/api/notifications/mark-all-read/` | Mark all notifications as read | Required |

### Zones
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/zones/` | List all zones (public read) | Optional |
| POST | `/api/zones/` | Create zone | Required |

### User Settings
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/user-settings/` | Get current user's settings | Required |
| POST | `/api/user-settings/` | Create settings (auto-sets user) | Required |
| PATCH | `/api/user-settings/{id}/` | Update settings | Required |

### OTPs
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/otps/` | List OTPs (admin=all, others=own) | Required |
| POST | `/api/otps/` | Create OTP | Required |

---

## Backend Features Implemented

### Signals (`core/signals.py`)
Auto-triggers on model save:
- **PickupRequest created** -> sends "pickup scheduled" email to resident
- **PickupRequest status -> in_progress** -> sends "pickup confirmed" email with collector name
- **PickupRequest status -> completed** -> sends "pickup completed" email + creates CollectionHistory record
- **User created** -> sends welcome email + auto-creates UserSettings

### Geocoding (`core/geocoding.py`)
- `geocode_address(address)` -- converts address string to `{lat, lng}` via Nominatim
- `reverse_geocode(location)` -- converts `{lat, lng}` to human-readable address

### Email Utilities (`core/utils_email.py`)
HTML email templates for:
- Pickup scheduled
- Pickup confirmed (with collector name)
- Pickup completed
- Password reset
- Welcome email
- **Collector credentials** (temporary password sent to new collectors)

### SMS Utilities (`core/utils_sms.py`)
- OTP sending via Africa's Talking
- **Status:** Backend functions exist but not wired to frontend flows

### Auto Route Creation (`core/views.py`)
When a collector is assigned to a pickup, a route is automatically created or the pickup is added to the collector's existing active route.

---

## Frontend Architecture

### Pages
| Page | Route | Description |
|---|---|---|
| Index | `/` | Landing page with hero, features, how-it-works, stats, CTA |
| Login | `/login` | User login form |
| Register | `/register` | User registration form |
| ForgotPassword | `/forgot-password` | Password reset request |
| ChangePassword | `/change-password` | Force password change (must_change_password flow) |
| Dashboard | `/dashboard` | Resident dashboard (protected) |
| CollectorDashboard | `/collector` | Collector dashboard (role-protected) |
| AdminDashboard | `/admin` | Admin dashboard (role-protected) |
| Contact | `/contact` | Contact page |
| NotFound | `*` | 404 page |

### Key Components
| Component | Location | Description |
|---|---|---|
| `ProtectedRoute` | `components/ProtectedRoute.tsx` | Route guard with role-based access |
| `LeafletMap` | `components/LeafletMap.tsx` | Interactive map with route lines, current location tracking, numbered markers, navigation mode |
| `AssignPickupDialog` | `components/AssignPickupDialog.tsx` | Zone-first collector assignment dialog |
| `CreateCollectorDialog` | `components/CreateCollectorDialog.tsx` | Admin create collector form with zone selector |
| `AddressPicker` | `components/AddressPicker.tsx` | Address input with geocoding |
| `ExportPreviewDialog` | `components/ExportPreviewDialog.tsx` | Data export preview dialog |
| `ViewUserDialog` | `components/ViewUserDialog.tsx` | User detail view dialog |
| `EditUserDialog` | `components/EditUserDialog.tsx` | User edit dialog |
| `DeleteUserDialog` | `components/DeleteUserDialog.tsx` | User delete confirmation dialog |
| `NotificationDrawer` | `components/ui/NotificationDrawer.tsx` | Slide-out notification panel |
| `DashboardDialog` | `components/ui/DashboardDialog.tsx` | Reusable dialog with sticky header |
| `DashboardSkeleton` | `components/ui/DashboardSkeleton.tsx` | Loading skeleton for dashboards |
| `MobileSidebar` | `components/ui/MobileSidebar.tsx` | Mobile navigation sidebar |
| `ImageUpload` | `components/ui/ImageUpload.tsx` | Profile image upload with crop |
| `WelcomeCard` | `components/ui/WelcomeCard.tsx` | Welcome greeting card |
| `ScrollToTop` | `App.tsx` | Scrolls to top on route change |

### API Client (`lib/api.ts`)
- Custom `fetch` wrapper with automatic JWT token injection
- Transparent 401 -> token refresh -> retry flow
- `ApiError` class with status code and response data
- Convenience methods: `api.get()`, `api.post()`, `api.put()`, `api.patch()`, `api.delete()`
- FormData support (auto-removes Content-Type header)
- **Uses `sessionStorage`** (not localStorage) for isolated per-tab sessions

### React Query Hooks (`hooks/useApi.ts`)
| Hook | Purpose | Query Key |
|---|---|---|
| `usePickupRequests` | List all pickups (role-filtered) | `pickup-requests` |
| `useMyPickupRequests` | Resident's own pickups | `my-pickup-requests` |
| `useCreatePickupRequest` | Create new pickup request | - |
| `useUpdatePickupRequest` | Update pickup status/details | Invalidates: `pickup-requests`, `my-pickup-requests`, `collector-pickups`, `routes`, `collection-history` |
| `useCollectorPickups` | Collector's assigned pickups | `collector-pickups` |
| `useRoutes` | List routes | `routes` |
| `useUpdateRoute` | Update route details | Invalidates: `routes` |
| `useUpdateRouteStop` | Update individual route stops | Invalidates: `routes` |
| `useUsers` | List/search users (admin) | `users` |
| `useCreateCollector` | Create collector account | - |
| `useUpdateUser` | Update user details | Invalidates: `users` |
| `useDeleteUser` | Delete user | Invalidates: `users` |
| `useNotifications` | List notifications (polls every 30s) | `notifications` |
| `useMarkNotificationRead` | Mark single notification read | Invalidates: `notifications` |
| `useMarkAllNotificationsRead` | Mark all notifications read | Invalidates: `notifications` |
| `useCollectionHistory` | List collection history | `collection-history` |
| `useAnalytics` | Admin analytics data | `analytics` |
| `useReports` | Admin reports data | `reports` |

### TypeScript Types (`lib/types.ts`)
- `User` -- Custom user with role, status, zone, profile picture, must_change_password
- `PickupRequest` -- Pickup with location (lat/lng), zone, resident/collector details
- `Route` -- Route with waypoints, stops, collector
- `RouteStop` -- Individual stop with location, timing, linked pickups
- `CollectionHistory` -- Completed collection record
- `Notification` -- User notification
- `PaginatedResponse<T>` -- DRF paginated response wrapper
- `AuthTokens`, `LoginPayload`, `RegisterPayload`

### Utility Functions (`lib/normalize.ts`)
- `normalizeList<T>(data)` -- Handles both paginated and array responses
- `formatDate(iso)` -- Full date formatting
- `formatTime(iso)` -- Time-only formatting
- `formatShortDateTime(iso)` -- Short date+time formatting
- `formatMonth(iso)` -- Month+year formatting

### Export Utilities (`lib/exportCsv.ts`)
- CSV export via browser
- PDF export via jsPDF + autoTable

---

## Collector Dashboard Features

### Overview Tab
- Stats cards (pickups, completed, pending, distance)
- Live route progress banner with Leaflet map showing all pickup locations
- Next pickup navigation card with distance and "Go" button (opens Google Maps)
- Route stop badges with completion status
- Assigned pickups list with phone/navigate/complete actions

### Route Management Tab
- Active route card with:
  - Interactive Leaflet map with numbered markers, route line, and current location
  - Navigation toggle (follows GPS position, shows next stop popup)
  - Complete Route button
  - Dynamic pickup list with Go (Google Maps) and Done buttons
- All Routes list with start/view details actions

### Collection History Tab
- Desktop table + mobile cards
- CSV/PDF export

### Top Bar
- Start/Pause Route toggle
- Navigate toggle (when route is active)
- Notifications bell with unread count
- Profile button

---

## Admin Dashboard Features

### Overview Tab
- Stats cards (users, pickups, routes, completion rate)
- Live route overview map with pickup and route markers
- Weekly activity chart (Recharts)
- Recent pickups table

### Users Tab
- User list with search, role filter, and zone badges
- Create collector dialog (with zone selector, auto-emails credentials)
- View/Edit/Delete user dialogs

### Route Management Tab
- Routes list with status badges
- Route details with stops

### Pickup Requests Tab
- Pickup list with zone filter buttons, status filter, search
- Zone badges on each pickup
- Auto-assigned collector column
- Assign pickup dialog (zone-first collector matching, auto-status change to in_progress)

### Collection History Tab
- History table with export

---

## Issues Found During Audit

### Critical
1. **22 unused Shadcn/ui component files** -- Adding ~50KB+ to bundle size with no benefit
2. **`@types/jspdf` version mismatch** -- Types are for v1.3.3 but jspdf is at v4.2.1 (jspdf 4.x has built-in types)
3. **Debug mode on by default** -- `DJANGO_DEBUG=True` in settings.py fallback
4. **Insecure secret key fallback** -- `django-insecure-change-me-in-production` used when env var missing

### Warning
5. **Resend sandbox mode** -- Emails only deliver to verified addresses; custom domain not verified
6. **Africa's Talking not wired to frontend** -- SMS OTP functions exist in backend but no UI triggers them
7. **WebSocket/Channels installed but unused** -- Redis required but not configured for frontend
8. **Flask packages in Python venv** -- Flask, Flask-Login, etc. are installed but not used by this Django project
9. **`calender.tsx` typo** -- File is named `calender.tsx` instead of `calendar.tsx`

### Minor
10. **Frontend builds are slow** (~44s) -- Large bundle with unused dependencies
11. **No test coverage** -- `tests.py` exists but is empty
12. **No CORS configuration for production** -- Only localhost:5173 allowed

---

## Cleanup Recommendations

### Quick Wins (Frontend)
Remove unused Shadcn/ui components and their Radix dependencies:
```bash
cd Frontend
# Remove unused component files
rm src/components/ui/accordion.tsx src/components/ui/alert-dialog.tsx \
   src/components/ui/aspect-ratio.tsx src/components/ui/avatar.tsx \
   src/components/ui/breadcrumb.tsx src/components/ui/calender.tsx \
   src/components/ui/carousel.tsx src/components/ui/chart.tsx \
   src/components/ui/command.tsx src/components/ui/context-menu.tsx \
   src/components/ui/drawer.tsx src/components/ui/ExportButton.tsx \
   src/components/ui/hover-card.tsx src/components/ui/input-otp.tsx \
   src/components/ui/menubar.tsx src/components/ui/navigation-menu.tsx \
   src/components/ui/pagination.tsx src/components/ui/radio-group.tsx \
   src/components/ui/resizable.tsx src/components/ui/scroll-area.tsx \
   src/components/ui/sidebar.tsx src/components/ui/toggle-group.tsx

# Remove unused npm packages
npm remove @radix-ui/react-accordion @radix-ui/react-alert-dialog \
  @radix-ui/react-aspect-ratio @radix-ui/react-avatar \
  @radix-ui/react-context-menu @radix-ui/react-hover-card \
  @radix-ui/react-menubar @radix-ui/react-navigation-menu \
  @radix-ui/react-radio-group @radix-ui/react-toggle-group \
  @types/jspdf
```

### Cleanup (Backend)
Remove unused packages from venv:
```bash
pip uninstall flask flask-login flask-sqlalchemy flask-wtf fpdf2 fonttools freetype-py git-filter-repo
```

---

## Running the Application

### Terminal 1: Backend
```bash
cd Backend/CleanTruck_backend
python manage.py runserver
# Runs on http://127.0.0.1:8000
```

### Terminal 2: Frontend
```bash
cd Frontend
npm run dev
# Runs on http://localhost:5173
```

### Terminal 3: Django Admin (Optional)
```bash
python manage.py createsuperuser
# Then visit http://127.0.0.1:8000/admin
```

---

## File Structure

```
CleanTruck/
├── Backend/
│   ├── .gitignore
│   └── CleanTruck_backend/
│       ├── requirements.txt
│       ├── .env.example
│       ├── .env                        (gitignored)
│       ├── manage.py
│       ├── CleanTruck_backend/
│       │   ├── settings.py
│       │   ├── urls.py
│       │   ├── asgi.py
│       │   └── wsgi.py
│       └── core/
│           ├── __init__.py
│           ├── admin.py                (10 models registered)
│           ├── apps.py                 (auto-imports signals)
│           ├── geocoding.py            (Nominatim forward + reverse)
│           ├── models.py              (10 models)
│           ├── serializers.py         (12 serializers)
│           ├── signals.py             (auto-email + collection history on events)
│           ├── tests.py               (empty)
│           ├── urls.py                (router + auth endpoints)
│           ├── utils_email.py         (7 email templates)
│           ├── utils_sms.py           (SMS utility functions)
│           ├── views.py               (15 viewsets/views)
│           └── migrations/
├── Frontend/
│   ├── .env.example
│   ├── package.json
│   ├── src/
│   │   ├── App.tsx                    (routes + ScrollToTop)
│   │   ├── main.tsx
│   │   ├── vite-env.d.ts
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx         (JWT auth, sessionStorage)
│   │   ├── hooks/
│   │   │   ├── useApi.ts              (18 React Query hooks)
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   ├── lib/
│   │   │   ├── api.ts                 (fetch wrapper, auto-refresh)
│   │   │   ├── exportCsv.ts           (CSV + PDF export)
│   │   │   ├── normalize.ts           (list normalization + date formatting)
│   │   │   ├── types.ts               (TypeScript interfaces)
│   │   │   └── utils.ts
│   │   ├── components/
│   │   │   ├── AddressPicker.tsx
│   │   │   ├── AssignPickupDialog.tsx
│   │   │   ├── CreateCollectorDialog.tsx
│   │   │   ├── DeleteUserDialog.tsx
│   │   │   ├── EditUserDialog.tsx
│   │   │   ├── ExportPreviewDialog.tsx
│   │   │   ├── LeafletMap.tsx          (map + route lines + GPS tracking)
│   │   │   ├── NavLink.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── ViewUserDialog.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── ui/                    (33 components, 22 unused)
│   │   └── pages/
│   │       ├── Index.tsx
│   │       ├── Login.tsx
│   │       ├── Register.tsx
│   │       ├── ForgotPassword.tsx
│   │       ├── ChangePassword.tsx
│   │       ├── Dashboard.tsx
│   │       ├── CollectorDashboard.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── Contact.tsx
│   │       └── NotFound.tsx
│   └── public/
└── DEPENDENCIES.md
```

---

## Deployment Checklist

- [ ] Set `DJANGO_DEBUG=False` in `.env`
- [ ] Set `DJANGO_SECRET_KEY` to random 50+ character string
- [ ] Configure `DJANGO_ALLOWED_HOSTS` with production domain
- [ ] Set `EMAIL_BACKEND=django_anymail.backends.resend.EmailBackend`
- [ ] Verify Resend domain for production email delivery
- [ ] Add Cloudinary credentials to `.env`
- [ ] Add Africa's Talking credentials to `.env` (if using SMS)
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure database backup strategy
- [ ] Set up Redis for real-time features (if using WebSockets)
- [ ] Deploy backend with Gunicorn + Nginx (or Daphne for ASGI)
- [ ] Build frontend: `npm run build` and serve static files
- [ ] Set `VITE_API_URL` to production API URL during frontend build
- [ ] Remove unused frontend dependencies to reduce bundle size

---

## Troubleshooting

**Database Connection Error:**
- Check PostgreSQL is running on port 5433
- Verify credentials in `.env`
- Ensure database exists: `createdb -U postgres -p 5433 cleantruckdb`

**Email Not Sending:**
- Default `EMAIL_BACKEND` prints to console (check terminal output)
- For Resend: set `DEFAULT_FROM_EMAIL=onboarding@resend.dev` for testing
- For production: verify domain at resend.com/domains
- Check Resend dashboard for delivery status and error logs

**SMS Not Sending:**
- Verify `AT_USERNAME` and `AT_API_KEY` in `.env`
- Check phone number format (include country code, e.g., +254...)
- Use sandbox mode for testing: `AT_USERNAME=sandbox`
- Africa's Talking UI not yet wired - backend functions ready

**Frontend Not Connecting to Backend:**
- Verify backend is running on port 8000
- Check CORS settings allow frontend origin (`localhost:5173`)
- Verify `VITE_API_URL` in frontend `.env` or defaults
- Check browser Network tab for request details

**JWT Authentication Issues:**
- Access tokens expire after 60 minutes (configurable via `JWT_ACCESS_TOKEN_LIFETIME_MINUTES`)
- Refresh tokens last 7 days (configurable via `JWT_REFRESH_TOKEN_LIFETIME_DAYS`)
- Frontend auto-refreshes on 401 responses
- Uses sessionStorage so each browser tab has isolated sessions

**Leaflet Map Not Rendering:**
- Check browser console for errors
- Ensure `leaflet/dist/leaflet.css` is imported
- Map z-index fixed to prevent overlaying modals

**Collector Not Seeing Assigned Pickups:**
- React Query invalidation covers all query keys
- If stale data persists, hard refresh the page
