# CleanTruck — Smart Waste Management Platform

CleanTruck is a full-stack waste management platform designed to streamline residential and commercial waste collection across Nairobi zones. It connects **Residents**, **Waste Collectors**, and **Platform Administrators** with role-based dashboards, interactive Leaflet/OpenStreetMap route navigation, automated notifications (in-app, email, and SMS), and operational analytics.

---

## Features by Role

### Resident
- **Schedule Pickups:** Request waste collection by waste type (`General Waste`, `Recyclables`, `Organic Waste`, `E-Waste`), date/time, priority, and geocoded address.
- **Track Status:** View real-time status updates (`Pending` → `In Progress` → `Completed` / `Cancelled`) and assigned collector details.
- **Notifications & Preferences:** Receive in-app, email, and SMS updates on pickup progress and customize default pickup settings.

### Waste Collector
- **Route Management & Navigation:** Start, pause, and complete assigned routes with numbered stops, Haversine distance/duration calculation, and one-tap handoff to Google Maps turn-by-turn directions.
- **Live GPS Tracking:** Browser Geolocation (`watchPosition`) displays the collector's live position on the route map, calculates distance to the next stop, and periodically syncs coordinates to the backend.
- **Collection History:** Review completed pickups and logged weights.

### Administrator
- **Operations Overview & Analytics:** Track total collections, weight collected, completion and recycling rates, weekly activity charts, and waste distribution.
- **Pickup Request Assignment:** Filter pickups by Nairobi zone (`Westlands`, `Kilimani`, `Kileleshwa`, `Lavington`, `Karen`, `Lang'ata`, `Upper Hill`, `CBD`, `Riruta`), status, or search query, and assign zone-matched collectors (automatically creating/updating collector routes and stops).
- **User & Collector Management:** Create collector accounts with auto-emailed temporary credentials (enforcing mandatory password change on first login), and view/edit/deactivate users.
- **CSV & PDF Exports:** Preview and export collection requests, user lists, monthly reports, and sector performance tables to CSV or PDF.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Shadcn/ui (Radix UI), TanStack React Query, React Router v6, Leaflet + OpenStreetMap, Recharts, jsPDF + autoTable |
| **Backend** | Python 3.13, Django 5.2, Django REST Framework (DRF), SimpleJWT, Channels / Daphne |
| **Database** | PostgreSQL (`psycopg2-binary`) |
| **External Services** | Nominatim / `geopy` (Geocoding), Resend + `django-anymail` (Email), Africa's Talking (SMS/OTP), Cloudinary (Media Storage) |

---

## Project Structure

```text
CleanTruck/
├── Backend/
│   └── CleanTruck_backend/
│       ├── CleanTruck_backend/     # Django project settings, URLs, ASGI/WSGI
│       ├── core/                   # Main application
│       │   ├── models.py           # User, Route, RouteStops, PickupRequest, CollectionHistory, Zone, OTP, etc.
│       │   ├── serializers.py      # DRF serializers & auth/OTP validation
│       │   ├── views.py            # ViewSets, role permissions, auto-route & stop syncing
│       │   ├── signals.py          # Auto-emails, in-app notifications, and history logging
│       │   ├── geocoding.py        # Nominatim forward & reverse geocoding
│       │   ├── utils_email.py      # HTML transactional email templates
│       │   ├── utils_sms.py        # Africa's Talking SMS OTP utilities
│       │   └── urls.py             # API router & authentication endpoints
│       ├── manage.py
│       ├── requirements.txt
│       └── .env.example
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/             # LeafletMap, AssignPickupDialog, CookieConsent, UI primitives
│   │   ├── contexts/               # AuthContext (JWT session management via sessionStorage)
│   │   ├── hooks/                  # React Query hooks (useApi.ts)
│   │   ├── lib/                    # Fetch wrapper with auto token refresh, CSV/PDF export, types
│   │   ├── pages/                  # Index, Login, Register, Dashboards, Contact, PrivacyPolicy, TermsOfService
│   │   └── App.tsx                 # Client-side routing
│   ├── package.json
│   └── .env.example
├── DEPENDENCIES.md                 # Detailed dependency & architecture audit report
└── README.md
```

---

## Getting Started

### Prerequisites
- **Python** 3.11 – 3.13
- **Node.js** 18+ and **npm**
- **PostgreSQL** 14+ running locally

### 1. Database Setup

Start PostgreSQL and create the `cleantruckdb` database:

```bash
brew services start postgresql@17
createuser -s postgres
createdb -U postgres cleantruckdb
```

### 2. Backend Setup

```bash
cd Backend/CleanTruck_backend

# Create and activate virtual environment
python3.13 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your database port/credentials and API keys

# Run database migrations
python manage.py migrate

# Create a superuser (optional)
python manage.py createsuperuser

# Start the Django development server (http://127.0.0.1:8000)
python manage.py runserver
```

> **Note:** When logging in through the React frontend (`/login`), the email field is used as the `username` for JWT authentication. Ensure your admin user's `username` matches their `email` and `role="admin"`.

### 3. Frontend Setup

In a separate terminal:

```bash
cd Frontend

# Install dependencies
npm install

# Configure environment variables (optional, defaults to http://localhost:8000/api)
cp .env.example .env

# Start the Vite development server (http://localhost:5173)
npm run dev
```

---

## Environment Variables

### Backend (`Backend/CleanTruck_backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `DJANGO_SECRET_KEY` | Django secret key | `django-insecure-...` |
| `DJANGO_DEBUG` | Debug mode (`True` / `False`) | `True` |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated allowed hosts | `localhost,127.0.0.1` |
| `DB_NAME` | PostgreSQL database name | `cleantruckdb` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | *(empty)* |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `EMAIL_BACKEND` | Email backend class | `django.core.mail.backends.console.EmailBackend` |
| `RESEND_API_KEY` | Resend API key for transactional emails | *(empty)* |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for profile uploads | *(empty)* |
| `CLOUDINARY_API_KEY` | Cloudinary API key | *(empty)* |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | *(empty)* |
| `AT_USERNAME` | Africa's Talking username | *(empty)* |
| `AT_API_KEY` | Africa's Talking API key | *(empty)* |
| `AT_SENDER_ID` | Africa's Talking sender ID | `cleantruck` |

### Frontend (`Frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000/api` |

---

## Key API Endpoints

All API endpoints are prefixed with `/api/`:

- **Auth & Profile:**
  - `POST /api/auth/register/` — Register a new resident account
  - `POST /api/token/` & `POST /api/token/refresh/` — Obtain and refresh JWT tokens
  - `GET/PATCH /api/users/me/` — Retrieve or update current user profile
  - `POST /api/users/me/change-password/` — Change password (clears `must_change_password`)
  - `POST /api/auth/forgot-password/`, `POST /api/auth/verify-otp/`, `POST /api/auth/reset-password/` — OTP password reset flow
- **Operations:**
  - `GET/POST/PATCH/DELETE /api/pickups/` — Manage pickup requests (`/api/pickups/my/`, `/api/pickups/assigned/`)
  - `GET/POST/PATCH/DELETE /api/routes/` & `/api/route-stops/` — Manage collector routes and stops
  - `GET /api/collection-history/` — Completed pickup logs
  - `GET/PATCH /api/notifications/` & `POST /api/notifications/mark-all-read/` — User notifications
  - `GET/POST /api/users/create-collector/` — Admin collector provisioning
  - `GET/POST/PATCH/DELETE /api/contact-messages/` — Contact form submissions

---

## Legal & Compliance Pages

- **Privacy & Cookie Policy:** `/privacy-policy`
- **Terms of Service:** `/terms`
- **Cookie Consent Banner:** First-visit consent banner allowing users to choose between **Essential Only** and **Accept All** storage preferences.
