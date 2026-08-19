# CleanTruck Dependencies & Setup Guide

## Backend Setup

### Python Requirements
**Location:** `Backend/CleanTruck_backend/requirements.txt`

**Install:**
```bash
cd Backend/CleanTruck_backend
pip install -r requirements.txt
```

### Core Dependencies
- **Django 5.2.17** - Web framework
- **djangorestframework 3.18.0** - REST API
- **django-cors-headers 4.9.0** - CORS support
- **djangorestframework_simplejwt 5.5.1** - JWT authentication
- **psycopg2-binary 2.9.12** - PostgreSQL driver
- **Pillow 12.1.0** - Image processing

### External Services
- **django-anymail 15.1** - Email framework
- **resend 2.36.0** - Resend email service
- **africastalking 2.0.3** - SMS/OTP service
- **geopy 2.5.0** - Geocoding (Nominatim)
- **django-cloudinary-storage 0.3.0** - Django file storage backend
- **cloudinary 1.46.0** - Cloudinary Python SDK for uploaded media

### Real-Time Features (Optional, Installed)
- **channels 4.0.0** - WebSocket support
- **channels-redis 4.1.0** - Redis integration
- **redis 7.1.0** - Redis client

**Note:** Real-time features require Redis running as separate service

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
- **React 18.3.1** - UI framework
- **React Router 6.30.1** - Routing
- **TailwindCSS 3.4.17** - Styling
- **React Hook Form 7.61.1** - Form management
- **Zod 3.25.76** - Schema validation

### UI Components
- **Radix UI** - Headless component library
- **Shadcn/ui** - Pre-built components
- **Lucide Icons** - Icon library
- **Sonner** - Toast notifications

### Maps & Charting
- **Leaflet 1.9.4** - Map library
- **react-leaflet 4.2.1** - React wrapper
- **Recharts 2.15.4** - Charts

### Data & State
- **TanStack React Query 5.83.0** - Server state management
- **date-fns 3.6.0** - Date utilities

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

## External Services Configuration

### 1. Resend (Email)
**File:** `Backend/CleanTruck_backend/CleanTruck_backend/settings.py`

```python
EMAIL_BACKEND = "anymail.backends.resend.EmailBackend"
ANYMAIL = {
    "RESEND_API_KEY": "your_resend_api_key_here",
}
DEFAULT_FROM_EMAIL = "noreply@cleantruck.com"
```

**Setup:**
1. Go to https://resend.com
2. Create free account
3. Get API key
4. Verify sender domain
5. Replace `your_resend_api_key_here` in settings

### 2. Africa's Talking (SMS/OTP)
**File:** `Backend/CleanTruck_backend/CleanTruck_backend/settings.py`

```python
AFRICAS_TALKING_USERNAME = "sandbox"  # Use "sandbox" for testing
AFRICAS_TALKING_API_KEY = "your_africas_talking_api_key_here"
```

**Setup:**
1. Go to https://africastalking.com
2. Create account (free sandbox for testing)
3. Get API key
4. Test with sandbox mode first
5. Replace credentials in settings

### 3. OpenStreetMap (Maps)
- ✅ Already configured in frontend
- No API key required
- Free for unlimited use
- Used via Leaflet.js

### 4. Cloudinary (Uploaded Media)
Cloudinary stores profile pictures and other uploaded files outside the local filesystem.

**Install manually if needed:**
```bash
cd Backend/CleanTruck_backend
pip install django-cloudinary-storage cloudinary
```

**Environment variables:** Add these values to `Backend/CleanTruck_backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Keep `.env` private. The placeholder values belong in `.env.example`, not in production.

**Django configuration:** `settings.py` reads these variables and configures:
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
2. Open the Cloudinary dashboard and copy the cloud name, API key, and API secret
3. Add them to `.env`
4. Restart the Django server after changing `.env`
5. Uploaded `ImageField` files will be stored in Cloudinary

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

## Models & Database Tables

**User Models:**
- User (extends AbstractUser)
- UserSettings
- OTP

**Pickup & Collection:**
- PickupRequest
- CollectionHistory
- Route
- RouteStops
- Zone

**Notifications:**
- Notification

---

## API Endpoints Structure

### Auth
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/password-reset/request/`
- `POST /api/auth/password-reset/verify/`

### Pickups
- `GET /api/pickups/` - List user's pickups
- `POST /api/pickups/` - Create new pickup
- `GET /api/pickups/{id}/` - Get pickup details
- `PATCH /api/pickups/{id}/` - Update pickup

### Routes (Collector)
- `GET /api/routes/` - List routes
- `POST /api/routes/` - Create route
- `GET /api/routes/{id}/stops/` - Get route stops

### Notifications
- `GET /api/notifications/` - List notifications
- `PATCH /api/notifications/{id}/read/` - Mark as read

---

## Development Workflow

1. **Backend Development:**
   - Edit models in `core/models.py`
   - Create migrations: `python manage.py makemigrations`
   - Apply migrations: `python manage.py migrate`
   - Create API views/serializers
   - Test with Django admin or API client

2. **Frontend Development:**
   - Edit components in `src/components/`
   - Create pages in `src/pages/`
   - Use hooks in `src/hooks/`
   - Run `npm run dev` for live reload

3. **Testing:**
   - Backend: Use Django shell or Postman
   - Frontend: Use browser DevTools

---

## Deployment Checklist

- [ ] Set `DEBUG = False` in settings.py
- [ ] Set `SECRET_KEY` to random string
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up production email service (Resend)
- [ ] Set up SMS service (Africa's Talking)
- [x] Configure media file storage (Cloudinary)
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure database backup
- [ ] Set up Redis for real-time features (if using)
- [ ] Deploy with Gunicorn + Nginx
- [ ] Configure frontend build optimization

---

## Troubleshooting

**Database Connection Error:**
- Check PostgreSQL is running on port 5433
- Verify credentials in settings.py
- Ensure database exists: `createdb -U postgres -p 5433 cleantruckdb`

**Email Not Sending:**
- Verify Resend API key is correct
- Check email domain is verified in Resend dashboard
- Review Django mail logs

**SMS Not Sending:**
- Verify Africa's Talking API key
- Check phone number format (include country code)
- Use sandbox mode for testing

**Frontend Not Connecting to Backend:**
- Verify backend is running on port 8000
- Check CORS settings allow frontend origin
- Check API URLs in `src/lib/api.ts`

---

## File Structure

```
CleanTruck/
├── Backend/
│   └── CleanTruck_backend/
│       ├── requirements.txt (✅ Dependencies)
│       ├── manage.py
│       ├── CleanTruck_backend/ (settings)
│       └── core/ (app)
├── Frontend/
│   ├── package.json (✅ Dependencies)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
│   └── public/
└── DEPENDENCIES.md (this file)
```

---

## Next Steps

1. ✅ Install all dependencies
2. ✅ Configure external services (Resend, Africa's Talking, Cloudinary)
3. ✅ Run database migrations
4. ✅ Create superuser for admin
5. ⏳ Build API endpoints
6. ⏳ Integrate frontend with API
7. ⏳ Test end-to-end workflow
8. ⏳ Deploy to production

