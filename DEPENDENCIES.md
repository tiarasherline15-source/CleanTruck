# CleanTruck Dependencies & Setup Guide

> **Milestone:** Full-stack foundation complete — authentication, CRUD APIs, role-based dashboards, and transactional email/sms services wired up.

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
| Package | Version | Purpose |
|---|---|---|
| Django | 5.2.17 | Web framework |
| djangorestframework | 3.18.0 | REST API toolkit |
| djangorestframework_simplejwt | 5.5.1 | JWT authentication |
| PyJWT | 2.13.0 | JSON Web Token library |
| django-cors-headers | 4.9.0 | CORS support for frontend |
| psycopg2-binary | 2.9.12 | PostgreSQL driver |
| Pillow | 12.1.0 | Image processing |
| python-dotenv | 1.2.2 | Load `.env` files into Django settings |
| sqlparse | 0.5.5 | SQL parsing |

### External Services
| Package | Version | Purpose |
|---|---|---|
| django-anymail | 15.1 | Email framework (multi-provider) |
| resend | 2.36.0 | Resend transactional email API |
| africastalking | 2.0.3 | SMS / OTP via Africa's Talking |
| geopy | 2.5.0 | Geocoding via Nominatim (OpenStreetMap) |
| geographiclib | 2.1 | Geodesic calculations (geopy dep) |
| django-cloudinary-storage | 0.3.0 | Django file storage backend |
| cloudinary | 1.46.0 | Cloudinary Python SDK for uploaded media |

### Real-Time Features (Optional, Installed)
| Package | Version | Purpose |
|---|---|---|
| channels | 4.0.0 | WebSocket support |
| channels-redis | 4.1.0 | Redis channel layer |
| daphne | 4.0.0 | ASGI server for channels |
| redis | 7.1.0 | Redis client |
| asgiref | 3.11.0 | ASGI reference implementation |

> **Note:** Real-time features require Redis running as a separate service.

### HTTP / Networking
| Package | Version | Purpose |
|---|---|---|
| requests | 2.34.2 | HTTP client library |
| certifi | 2026.7.22 | SSL certificate bundle |
| charset-normalizer | 3.5.1 | Character encoding detection |
| idna | 3.11 | Internationalized domain names |
| urllib3 | 2.7.0 | HTTP client library |

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
| Package | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework |
| react-dom | 18.3.1 | React DOM renderer |
| react-router-dom | 6.30.1 | Client-side routing |
| TailwindCSS | 3.4.17 | Utility-first CSS styling |
| React Hook Form | 7.61.1 | Form state management & validation |
| @hookform/resolvers | 3.10.0 | Zod resolver for React Hook Form |
| Zod | 3.25.76 | Schema validation |
| @tanstack/react-query | 5.83.0 | Server state management & caching |
| date-fns | 3.6.0 | Date utility library |
| class-variance-authority | 0.7.1 | Component variant styling (CVA) |
| clsx | 2.1.1 | Conditional classnames |
| tailwind-merge | 2.6.0 | Merge Tailwind classes without conflicts |
| tailwindcss-animate | 1.0.7 | Animation utilities for Tailwind |
| next-themes | 0.3.0 | Theme management |

### UI Components (Radix UI + Shadcn/ui)
| Package | Purpose |
|---|---|
| @radix-ui/react-accordion | Collapsible content panels |
| @radix-ui/react-alert-dialog | Confirmation dialogs |
| @radix-ui/react-aspect-ratio | Responsive aspect ratios |
| @radix-ui/react-avatar | User avatars |
| @radix-ui/react-checkbox | Checkboxes |
| @radix-ui/react-collapsible | Collapsible sections |
| @radix-ui/react-context-menu | Right-click context menus |
| @radix-ui/react-dialog | Modal dialogs |
| @radix-ui/react-dropdown-menu | Dropdown menus |
| @radix-ui/react-hover-card | Hover preview cards |
| @radix-ui/react-label | Form labels |
| @radix-ui/react-menubar | Application menus |
| @radix-ui/react-navigation-menu | Navigation menus |
| @radix-ui/react-popover | Popover content |
| @radix-ui/react-progress | Progress bars |
| @radix-ui/react-radio-group | Radio button groups |
| @radix-ui/react-scroll-area | Custom scroll areas |
| @radix-ui/react-select | Select dropdowns |
| @radix-ui/react-separator | Visual separators |
| @radix-ui/react-slider | Range sliders |
| @radix-ui/react-slot | Component composition |
| @radix-ui/react-switch | Toggle switches |
| @radix-ui/react-tabs | Tabbed interfaces |
| @radix-ui/react-toast | Toast notifications |
| @radix-ui/react-toggle | Toggle buttons |
| @radix-ui/react-toggle-group | Grouped toggles |
| @radix-ui/react-tooltip | Tooltips |
| lucide-react | 0.462.0 — Icon library |
| sonner | 1.7.4 — Toast notification library |
| cmdk | 1.1.1 — Command palette |
| vaul | 0.9.9 — Drawer component |
| embla-carousel-react | 8.6.0 — Carousel component |
| input-otp | 1.4.2 — OTP input fields |
| react-day-picker | 8.10.1 — Date picker |
| react-resizable-panels | 2.1.9 — Resizable panel layouts |

### Maps & Charting
| Package | Version | Purpose |
|---|---|---|
| leaflet | 1.9.4 | Interactive map library |
| @types/leaflet | 1.9.22 | TypeScript types for Leaflet |
| recharts | 2.15.4 | Charts and data visualization |

### Dev Dependencies
| Package | Version | Purpose |
|---|---|---|
| TypeScript | 5.8.3 | Type checking |
| Vite | 5.4.19 | Build tool & dev server |
| @vitejs/plugin-react-swc | 3.11.0 | React SWC plugin for Vite |
| ESLint | 9.32.0 | Code linting |
| @eslint/js | 9.32.0 | ESLint core config |
| typescript-eslint | 8.38.0 | TypeScript ESLint parser |
| eslint-plugin-react-hooks | 5.2.0 | React hooks linting rules |
| eslint-plugin-react-refresh | 0.4.20 | Fast refresh linting rules |
| PostCSS | 8.5.6 | CSS processing |
| autoprefixer | 10.4.21 | CSS vendor prefixing |
| @tailwindcss/typography | 0.5.16 | Prose typography plugin |
| globals | 15.15.0 | Global variables for ESLint |
| @types/node | 22.16.5 | Node.js type definitions |
| @types/react | 18.3.23 | React type definitions |
| @types/react-dom | 18.3.7 | React DOM type definitions |

---

## Environment Variables

All secrets are loaded from `Backend/CleanTruck_backend/.env` via `python-dotenv`.

**Template:** `Backend/CleanTruck_backend/.env.example`
**Actual:** `Backend/CleanTruck_backend/.env` (gitignored, never commit)

### Required Variables

| Variable | Description | Default |
|---|---|---|
| `DJANGO_SECRET_KEY` | Django secret key | `django-insecure-change-me-in-production` |
| `DJANGO_DEBUG` | Enable debug mode | `True` |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated hosts | `localhost,127.0.0.1` |
| `DB_NAME` | PostgreSQL database name | `cleantruckdb` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | *(empty)* |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5433` |
| `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` | JWT access token lifetime | `60` |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | JWT refresh token lifetime | `7` |
| `EMAIL_BACKEND` | Django email backend | `django.core.mail.backends.console.EmailBackend` |
| `DEFAULT_FROM_EMAIL` | Sender email address | `noreply@cleantruck.com` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USE_TLS` | Enable TLS | `True` |
| `EMAIL_HOST_USER` | SMTP username | *(empty)* |
| `EMAIL_HOST_PASSWORD` | SMTP password | *(empty)* |
| `RESEND_API_KEY` | Resend API key | *(empty)* |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | *(empty)* |
| `CLOUDINARY_API_KEY` | Cloudinary API key | *(empty)* |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | *(empty)* |
| `AT_USERNAME` | Africa's Talking username | *(empty)* |
| `AT_API_KEY` | Africa's Talking API key | *(empty)* |
| `AT_SENDER_ID` | Africa's Talking sender ID | `cleantruck` |
| `REDIS_URL` | Redis connection URL | `redis://127.0.0.1:6379/0` |

### Frontend Environment Variable

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000/api` |

---

## External Services Configuration

### 1. Resend (Email)
**File:** `Backend/CleanTruck_backend/CleanTruck_backend/settings.py`

Reads `RESEND_API_KEY` from `.env`. For production, configure `django-anymail` as the email backend:

```python
# In .env
EMAIL_BACKEND=django_anymail.backends.resend.EmailBackend
RESEND_API_KEY=re_your_api_key_here
DEFAULT_FROM_EMAIL=noreply@cleantruck.com
```

**Setup:**
1. Go to https://resend.com
2. Create free account
3. Get API key
4. Verify sender domain
5. Add values to `.env`

### 2. Africa's Talking (SMS/OTP)
**File:** `Backend/CleanTruck_backend/CleanTruck_backend/settings.py`

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
5. Add values to `.env`

### 3. OpenStreetMap (Maps)
- Already configured in frontend via Leaflet.js
- No API key required
- Free for unlimited use

### 4. Cloudinary (Uploaded Media)
Cloudinary stores profile pictures and other uploaded files.

**Environment variables:** Add to `Backend/CleanTruck_backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Django configuration:** `settings.py` reads these and configures:
```python
INSTALLED_APPS = [
    # ...
    "cloudinary_storage",
    "cloudinary",
]

CLOUDINARY_STORAGE = {
    "CLOUD_NAME": os.environ.get("CLOUDINARY_CLOUD_NAME", ""),
    "API_KEY": os.environ.get("CLOUDINARY_API_KEY", ""),
    "API_SECRET": os.environ.get("CLOUDINARY_API_SECRET", ""),
}

DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"
```

**Setup:**
1. Create an account at https://cloudinary.com
2. Copy cloud name, API key, and API secret from dashboard
3. Add them to `.env`
4. Restart Django server after changing `.env`
5. Uploaded `ImageField` files will be stored in Cloudinary

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
| **User** | Custom user extending `AbstractUser` with role (resident/collector/admin), status, phone, address, zone, profile picture, and location |
| **Route** | Collection routes assigned to collectors with stops count, distance, duration, status, and waypoints |
| **PickupRequest** | Waste pickup requests from residents with waste type, priority, scheduling, status, and weight tracking |
| **CollectionHistory** | Completed collection records linking pickup requests, collectors, routes, and weight data |
| **Notification** | User notifications with types (warning/info/success/error) and read status |
| **Zone** | Nairobi zones (Westlands, Kilimani, Karen, etc.) with coordinates and active status |
| **UserSettings** | Per-user notification preferences (email/SMS) and default pickup configuration |
| **RouteStops** | Individual stops along a route with sequence number, address, zone, timing, and linked pickup requests |
| **OTP** | One-time passwords for password reset, registration, and SMS verification |

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
| POST | `/api/users/create-collector/` | Create collector with one-time temporary password | Admin role |

**Query params:** `?search=<query>&role=<resident|collector|admin>`

### Contact Messages
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/contact-messages/` | Submit a contact message | Public |
| GET | `/api/contact-messages/` | List contact messages | Website admin role |
| PATCH | `/api/contact-messages/{id}/` | Update message status/details | Website admin role |
| DELETE | `/api/contact-messages/{id}/` | Delete a contact message | Website admin role |

### Pickup Requests
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/pickups/` | List pickups (role-filtered: admin=all, collector=assigned, resident=own) | Required |
| POST | `/api/pickups/` | Create pickup request (auto-sets resident) | Required |
| GET | `/api/pickups/{id}/` | Get pickup detail | Required |
| PATCH | `/api/pickups/{id}/` | Update pickup | Required |
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

## Backend Utilities

### Signals (`core/signals.py`)
Auto-triggers on model save:
- **PickupRequest created** → sends "pickup scheduled" email to resident
- **PickupRequest status → in_progress** → sends "pickup confirmed" email with collector name
- **PickupRequest status → completed** → sends "pickup completed" email
- **User created** → sends welcome email + auto-creates UserSettings

### Geocoding (`core/geocoding.py`)
- `geocode_address(address)` — converts address string to `{lat, lng}` via Nominatim
- `reverse_geocode(location)` — converts `{lat, lng}` to human-readable address

### Email Utilities (`core/utils_email.py`)
HTML email templates for:
- Pickup scheduled
- Pickup confirmed (with collector name)
- Pickup completed
- Password reset
- Welcome email

---

## Frontend Architecture

### Pages
| Page | Route | Description |
|---|---|---|
| Index | `/` | Landing page with hero, features, how-it-works, stats, CTA |
| Login | `/login` | User login form |
| Register | `/register` | User registration form |
| ForgotPassword | `/forgot-password` | Password reset request |
| Dashboard | `/dashboard` | Resident dashboard (protected) |
| CollectorDashboard | `/collector` | Collector dashboard (role-protected) |
| AdminDashboard | `/admin` | Admin dashboard (role-protected) |
| Contact | `/contact` | Contact page |
| NotFound | `*` | 404 page |

### Key Components
| Component | Description |
|---|---|
| `ProtectedRoute` | Route guard with role-based access |
| `AuthContext` | Auth state management with JWT token refresh |
| `LeafletMap` | Interactive OpenStreetMap via Leaflet.js |
| `NotificationDrawer` | Slide-out notification panel |
| `DashboardDialog` | Reusable dashboard dialog |
| `DashboardSkeleton` | Loading skeleton for dashboards |
| `MobileSidebar` | Mobile navigation sidebar |
| `ExportButton` | Data export functionality |
| `ImageUpload` | Profile image upload component |
| `WelcomeCard` | Welcome greeting card |

### API Client (`lib/api.ts`)
- Custom `fetch` wrapper with automatic JWT token injection
- Transparent 401 → token refresh → retry flow
- `ApiError` class with status code and response data
- Convenience methods: `api.get()`, `api.post()`, `api.put()`, `api.patch()`, `api.delete()`
- FormData support (auto-removes Content-Type header)

### React Query Hooks (`hooks/useApi.ts`)
| Hook | Purpose |
|---|---|
| `usePickupRequests` | List all pickups (role-filtered) |
| `useMyPickupRequests` | Resident's own pickups |
| `useCreatePickupRequest` | Create new pickup request |
| `useUpdatePickupRequest` | Update pickup status/details |
| `useCollectorPickups` | Collector's assigned pickups |
| `useRoutes` | List routes |
| `useUpdateRoute` | Update route details |
| `useUsers` | List/search users (admin) |
| `useNotifications` | List notifications (polls every 30s) |
| `useMarkNotificationRead` | Mark single notification read |
| `useMarkAllNotificationsRead` | Mark all notifications read |
| `useCollectionHistory` | List collection history |
| `useAnalytics` | Admin analytics data |
| `useReports` | Admin reports data |

### TypeScript Types (`lib/types.ts`)
- `User`, `PickupRequest`, `Route`, `CollectionHistory`, `Notification`
- `PaginatedResponse<T>` — DRF paginated response wrapper
- `AuthTokens`, `LoginPayload`, `RegisterPayload`

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
│       ├── requirements.txt          ✅ All dependencies
│       ├── .env.example              ✅ Environment template
│       ├── .env                      ⚠️ Gitignored, never commit
│       ├── manage.py
│       ├── CleanTruck_backend/
│       │   ├── settings.py           ✅ Full config (DB, JWT, CORS, email, cloudinary, channels)
│       │   ├── urls.py               ✅ Root URL config with API include
│       │   ├── asgi.py
│       │   └── wsgi.py
│       └── core/
│           ├── __init__.py
│           ├── admin.py              ✅ All 9 models registered
│           ├── apps.py               ✅ Auto-imports signals on ready()
│           ├── geocoding.py          ✅ Nominatim forward + reverse geocoding
│           ├── models.py             ✅ 9 models (User, Route, PickupRequest, etc.)
│           ├── serializers.py        ✅ 10 serializers for all models
│           ├── signals.py            ✅ Auto-email on pickup/user events
│           ├── tests.py
│           ├── urls.py               ✅ Router + auth endpoints
│           ├── utils_email.py        ✅ HTML email templates (5 templates)
│           ├── views.py              ✅ 12 viewsets/views with role-based permissions
│           └── migrations/
├── Frontend/
│   ├── .env.example                  ✅ VITE_API_URL template
│   ├── package.json                  ✅ All dependencies
│   ├── src/
│   │   ├── App.tsx                   ✅ Routes with auth guards
│   │   ├── main.tsx
│   │   ├── vite-env.d.ts
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx        ✅ JWT auth with token refresh
│   │   ├── hooks/
│   │   │   ├── useApi.ts             ✅ React Query hooks for all endpoints
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   ├── lib/
│   │   │   ├── api.ts                ✅ Fetch wrapper with auto-refresh
│   │   │   ├── types.ts              ✅ TypeScript interfaces
│   │   │   └── utils.ts
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LeafletMap.tsx         ✅ Interactive map component
│   │   │   ├── NavLink.tsx
│   │   │   ├── ProtectedRoute.tsx     ✅ Role-based route guard
│   │   │   └── ui/                    ✅ 40+ Shadcn/ui components
│   │   └── pages/
│   │       ├── Index.tsx              ✅ Landing page
│   │       ├── Login.tsx              ✅ Login form
│   │       ├── Register.tsx           ✅ Registration form
│   │       ├── ForgotPassword.tsx     ✅ Password reset
│   │       ├── Dashboard.tsx          ✅ Resident dashboard
│   │       ├── CollectorDashboard.tsx  ✅ Collector dashboard
│   │       ├── AdminDashboard.tsx      ✅ Admin dashboard
│   │       ├── Contact.tsx            ✅ Contact page
│   │       └── NotFound.tsx           ✅ 404 page
│   └── public/
└── DEPENDENCIES.md                    ✅ This file
```

---

## Deployment Checklist

- [ ] Set `DJANGO_DEBUG=False` in `.env`
- [ ] Set `DJANGO_SECRET_KEY` to random 50+ character string in `.env`
- [ ] Configure `DJANGO_ALLOWED_HOSTS` with production domain
- [ ] Set `EMAIL_BACKEND=django_anymail.backends.resend.EmailBackend`
- [ ] Add `RESEND_API_KEY` to `.env`
- [ ] Add Africa's Talking credentials to `.env`
- [ ] Add Cloudinary credentials to `.env`
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure database backup strategy
- [ ] Set up Redis for real-time features (if using WebSockets)
- [ ] Deploy backend with Gunicorn + Nginx (or Daphne for ASGI)
- [ ] Build frontend: `npm run build` and serve static files
- [ ] Set `VITE_API_URL` to production API URL during frontend build

---

## Troubleshooting

**Database Connection Error:**
- Check PostgreSQL is running on port 5433
- Verify credentials in `.env`
- Ensure database exists: `createdb -U postgres -p 5433 cleantruckdb`

**Email Not Sending:**
- Default `EMAIL_BACKEND` prints to console (check terminal output)
- For production: set `EMAIL_BACKEND=django_anymail.backends.resend.EmailBackend`
- Verify `RESEND_API_KEY` is correct in `.env`
- Check email domain is verified in Resend dashboard

**SMS Not Sending:**
- Verify `AT_USERNAME` and `AT_API_KEY` in `.env`
- Check phone number format (include country code, e.g., +254...)
- Use sandbox mode for testing: `AT_USERNAME=sandbox`

**Frontend Not Connecting to Backend:**
- Verify backend is running on port 8000
- Check CORS settings allow frontend origin (`localhost:5173`)
- Verify `VITE_API_URL` in frontend `.env` or defaults
- Check browser Network tab for request details

**JWT Authentication Issues:**
- Access tokens expire after 60 minutes (configurable via `JWT_ACCESS_TOKEN_LIFETIME_MINUTES`)
- Refresh tokens last 7 days (configurable via `JWT_REFRESH_TOKEN_LIFETIME_DAYS`)
- Frontend auto-refreshes on 401 responses
- If stuck: clear localStorage and log in again

**Leaflet Map Not Rendering:**
- Leaflet is installed in `package.json`
- Check browser console for CSS import errors
- Ensure `leaflet/dist/leaflet.css` is available

---

## Next Steps

1. ⏳ Install and configure database, run migrations, create superuser
2. ⏳ Test all API endpoints with Postman or Django REST Framework browsable API
3. ✅ Connect frontend dashboards to live API data
4. ⏳ Add SMS OTP verification flow (Africa's Talking integration)
5. ⏳ Implement WebSocket notifications (Django Channels + Redis)
6. ⏳ Add input validation and error handling on frontend forms
7. ⏳ Write unit and integration tests
8. ⏳ Deploy to production
