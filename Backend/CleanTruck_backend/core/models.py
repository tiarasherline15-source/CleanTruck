from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        RESIDENT = 'resident', 'Resident'
        COLLECTOR = 'collector', 'Collector'
        ADMIN = 'admin', 'Admin'

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        INACTIVE = 'inactive', 'Inactive'
        ON_LEAVE = 'on_leave', 'On Leave'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.RESIDENT)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    zone = models.CharField(max_length=100, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    location = models.JSONField(blank=True, default=dict)
    is_phone_verified = models.BooleanField(default=False)
    must_change_password = models.BooleanField(default=False)

    def __str__(self):
        return self.get_full_name() or self.username


class Route(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        UPCOMING = 'upcoming', 'Upcoming'
        COMPLETED = 'completed', 'Completed'

    name = models.CharField(max_length=150)
    collector = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='routes',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': User.Role.COLLECTOR},
    )
    stops_count = models.PositiveIntegerField(default=0)
    distance_km = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    estimated_duration = models.DurationField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.UPCOMING)
    waypoints = models.JSONField(blank=True, default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class PickupRequest(models.Model):
    class WasteType(models.TextChoices):
        GENERAL = 'General Waste', 'General Waste'
        RECYCLABLES = 'Recyclables', 'Recyclables'
        ORGANIC = 'Organic Waste', 'Organic Waste'
        E_WASTE = 'E-Waste', 'E-Waste'

    class Priority(models.TextChoices):
        HIGH = 'high', 'High'
        NORMAL = 'normal', 'Normal'
        LOW = 'low', 'Low'

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    resident = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='pickup_requests',
        on_delete=models.CASCADE,
        limit_choices_to={'role': User.Role.RESIDENT},
    )
    collector = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='assigned_pickups',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': User.Role.COLLECTOR},
    )
    route = models.ForeignKey(
        Route,
        related_name='pickup_requests',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    address = models.CharField(max_length=255)
    zone = models.CharField(max_length=100, blank=True)
    waste_type = models.CharField(max_length=50, choices=WasteType.choices, default=WasteType.GENERAL)
    scheduled_datetime = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.NORMAL)
    location = models.JSONField(blank=True, default=dict)
    notes = models.TextField(blank=True)
    estimated_weight_kg = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    actual_weight_kg = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"PickupRequest #{self.pk} - {self.address}"


class CollectionHistory(models.Model):
    pickup_request = models.ForeignKey(
        PickupRequest,
        related_name='history_entries',
        on_delete=models.CASCADE,
    )
    collector = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='collection_history',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': User.Role.COLLECTOR},
    )
    route = models.ForeignKey(
        Route,
        related_name='collection_history',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    completed_at = models.DateTimeField()
    duration = models.DurationField(null=True, blank=True)
    weight_kg = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CollectionHistory #{self.pk} - {self.pickup_request}"


class Notification(models.Model):
    class Type(models.TextChoices):
        WARNING = 'warning', 'Warning'
        INFO = 'info', 'Info'
        SUCCESS = 'success', 'Success'
        ERROR = 'error', 'Error'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='notifications',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.INFO)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification #{self.pk} - {self.get_type_display()}"


class Zone(models.Model):
    ZONE_CHOICES = [
        ('westlands', 'Westlands'),
        ('kilimani', 'Kilimani'),
        ('kileleshwa', 'Kileleshwa'),
        ('lavington', 'Lavington'),
        ('karen', 'Karen'),
        ('langata', "Lang'ata"),
        ('upper_hill', 'Upper Hill'),
        ('cbd', 'CBD'),
        ('riruta', 'Riruta'),
    ]

    name = models.CharField(max_length=100, choices=ZONE_CHOICES)
    description = models.TextField(blank=True)
    coordinates = models.JSONField(blank=True, default=list)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.get_name_display()


class UserSettings(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        related_name='settings',
        on_delete=models.CASCADE,
    )
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    collection_reminders = models.BooleanField(default=True)
    route_updates = models.BooleanField(default=True)
    default_pickup_address = models.CharField(max_length=255, blank=True)
    default_route = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.user}"


class RouteStops(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    route = models.ForeignKey(
        Route,
        related_name='stops',
        on_delete=models.CASCADE,
    )
    stop_number = models.PositiveIntegerField()
    address = models.CharField(max_length=255)
    zone = models.ForeignKey(
        Zone,
        related_name='route_stops',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    arrival_time = models.DateTimeField(null=True, blank=True)
    departure_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    pickup_requests = models.ManyToManyField(
        PickupRequest,
        related_name='route_stops',
        blank=True,
    )
    location = models.JSONField(blank=True, default=dict)

    class Meta:
        ordering = ['stop_number']
        unique_together = [('route', 'stop_number')]

    def __str__(self):
        return f"Stop #{self.stop_number} on {self.route}"


class OTP(models.Model):
    class Purpose(models.TextChoices):
        PASSWORD_RESET = 'password_reset', 'Password Reset'
        PASSWORD_CHANGE = 'password_change', 'Password Change'
        REGISTRATION = 'registration', 'Registration'
        SMS_VERIFICATION = 'sms_verification', 'SMS Verification'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='otps',
        on_delete=models.CASCADE,
    )
    code = models.CharField(max_length=6)
    purpose = models.CharField(
        max_length=20,
        choices=Purpose.choices,
        default=Purpose.PASSWORD_RESET,
    )
    phone_number = models.CharField(max_length=20)
    is_verified = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"OTP for {self.user} ({self.purpose})"


class ContactMessage(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        REPLIED = 'replied', 'Replied'
        ARCHIVED = 'archived', 'Archived'

    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Contact message from {self.email}"
