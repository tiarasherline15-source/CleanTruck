from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import get_user_model
from django.db import models
from .models import (
    Route,
    PickupRequest,
    CollectionHistory,
    Notification,
    Zone,
    UserSettings,
    RouteStops,
    OTP,
    ContactMessage,
)
from .serializers import (
    UserSerializer,
    CreateCollectorSerializer,
    ChangePasswordSerializer,
    RegisterSerializer,
    UserSettingsSerializer,
    PickupRequestSerializer,
    CollectionHistorySerializer,
    RouteSerializer,
    RouteStopsSerializer,
    ZoneSerializer,
    NotificationSerializer,
    OTPSerializer,
    ContactMessageSerializer,
    ForgotPasswordSerializer,
    VerifyOTPSerializer,
    ResetPasswordSerializer,
)
from .utils_email import send_collector_credentials_email

User = get_user_model()


# Permissions 


class IsResident(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == "resident"


class IsCollector(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == "collector"


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == "admin"


class PasswordChangeCompletePermission(permissions.IsAuthenticated):
    """Allow a temporary-password user to access only account setup endpoints."""

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return not getattr(request.user, "must_change_password", False)


class PasswordChangeCompleteOrReadOnly(permissions.IsAuthenticatedOrReadOnly):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.method in permissions.SAFE_METHODS or not getattr(request.user, "must_change_password", False)


# Auth


class RegisterView(generics.CreateAPIView):
    """POST /api/users/register/"""
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/users/me/"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.GenericAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)


class ContactMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ContactMessageSerializer
    queryset = ContactMessage.objects.all()

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [IsAdmin()]


# ──────────────────────────────────────────────────────────────────────
# Forgot / Reset Password
# ──────────────────────────────────────────────────────────────────────


class ForgotPasswordView(generics.GenericAPIView):
    """POST /api/auth/forgot-password/ - Request an OTP for password reset."""
    serializer_class = ForgotPasswordSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["_user"]
        method = serializer.validated_data["method"]

        # Generate OTP
        from .utils_sms import generate_otp_code, get_otp_expiry
        code = generate_otp_code()
        expiry = get_otp_expiry(minutes=10)

        otp = OTP.objects.create(
            user=user,
            code=code,
            purpose=OTP.Purpose.PASSWORD_RESET,
            phone_number=user.phone or "",
            expires_at=expiry,
        )

        # Send OTP via the chosen method
        sent = False
        if method == "email":
            from .utils_email import send_otp_email
            sent = send_otp_email(user, code, purpose="password_reset")
        else:
            from .utils_sms import send_otp_sms
            if user.phone:
                sent = send_otp_sms(user.phone, code, purpose="password_reset")

        if not sent:
            return Response(
                {"detail": "Failed to send OTP. Please try again or use a different method."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({"detail": "OTP sent successfully."}, status=status.HTTP_200_OK)


class VerifyOTPView(generics.GenericAPIView):
    """POST /api/auth/verify-otp/ - Verify the OTP code."""
    serializer_class = VerifyOTPSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"detail": "OTP verified. You may now reset your password."}, status=status.HTTP_200_OK)


class ResetPasswordView(generics.GenericAPIView):
    """POST /api/auth/reset-password/ - Set a new password after OTP verification."""
    serializer_class = ResetPasswordSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password has been reset successfully. You can now log in."}, status=status.HTTP_200_OK)


# ViewSets 


class PickupRequestViewSet(viewsets.ModelViewSet):
    """CRUD for pickup requests. Residents see own, collectors see assigned."""
    serializer_class = PickupRequestSerializer
    permission_classes = [PasswordChangeCompletePermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return PickupRequest.objects.all()
        if user.role == "collector":
            return PickupRequest.objects.filter(collector=user)
        return PickupRequest.objects.filter(resident=user)

    def perform_create(self, serializer):
        location = serializer.validated_data.get("location") or {}
        address = serializer.validated_data.get("address", "")
        if (not location or "lat" not in location or "lng" not in location) and address:
            from .geocoding import geocode_address
            geocoded = geocode_address(address)
            if geocoded:
                location = geocoded
        serializer.save(
            resident=self.request.user,
            zone=serializer.validated_data.get("zone") or self.request.user.zone,
            location=location,
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        # Auto-assign a route when a collector is set
        if instance.collector and not instance.route:
            route = self._get_or_create_route(instance.collector)
            instance.route = route
            instance.save(update_fields=["route"])
        if instance.route:
            self._sync_route_metrics_and_stops(instance.route)

    def _sync_route_metrics_and_stops(self, route):
        """Sync RouteStops, stops_count, distance_km, estimated_duration, and waypoints from assigned pickups."""
        from datetime import timedelta
        from decimal import Decimal
        import math

        pickups = list(
            PickupRequest.objects.filter(route=route).order_by("scheduled_datetime", "id")
        )
        route.stops_count = len(pickups)

        waypoints = []
        for idx, pickup in enumerate(pickups, start=1):
            stop_status = (
                RouteStops.Status.COMPLETED
                if pickup.status == PickupRequest.Status.COMPLETED
                else RouteStops.Status.IN_PROGRESS
                if pickup.status == PickupRequest.Status.IN_PROGRESS
                else RouteStops.Status.CANCELLED
                if pickup.status == PickupRequest.Status.CANCELLED
                else RouteStops.Status.PENDING
            )
            stop, _ = RouteStops.objects.update_or_create(
                route=route,
                stop_number=idx,
                defaults={
                    "address": pickup.address,
                    "status": stop_status,
                    "location": pickup.location or {},
                },
            )
            stop.pickup_requests.set([pickup])
            if pickup.location and "lat" in pickup.location and "lng" in pickup.location:
                waypoints.append({"lat": pickup.location["lat"], "lng": pickup.location["lng"]})

        # Remove any stale stops beyond current pickup count
        RouteStops.objects.filter(route=route, stop_number__gt=len(pickups)).delete()

        # Compute Haversine distance across waypoints
        total_km = 0.0
        for i in range(1, len(waypoints)):
            lat1, lng1 = waypoints[i - 1]["lat"], waypoints[i - 1]["lng"]
            lat2, lng2 = waypoints[i]["lat"], waypoints[i]["lng"]
            r = 6371.0
            dlat = math.radians(lat2 - lat1)
            dlng = math.radians(lng2 - lng1)
            a = (
                math.sin(dlat / 2) ** 2
                + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
            )
            total_km += r * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        route.waypoints = waypoints
        route.distance_km = Decimal(f"{total_km:.2f}")
        # Estimate ~15 mins per stop + ~3 mins per km
        minutes = max(len(pickups) * 15 + int(round(total_km * 3)), 0)
        route.estimated_duration = timedelta(minutes=minutes) if pickups else None
        route.save(update_fields=["stops_count", "waypoints", "distance_km", "estimated_duration", "updated_at"])

    def _get_or_create_route(self, collector):
        """Find an active/upcoming route for the collector, or create one."""
        route = (
            Route.objects
            .filter(collector=collector, status__in=[Route.Status.ACTIVE, Route.Status.UPCOMING])
            .order_by("-created_at")
            .first()
        )
        if route:
            return route

        from django.utils import timezone
        collector_name = collector.get_full_name() or collector.username
        today = timezone.now().strftime("%b %d, %Y")
        route = Route.objects.create(
            name=f"{collector_name} - {today}",
            collector=collector,
            status=Route.Status.UPCOMING,
            stops_count=0,
        )
        return route

    @action(detail=False, methods=["get"], url_path="my")
    def my(self, request):
        """GET /api/pickups/my/ - resident's own pickup requests."""
        qs = PickupRequest.objects.filter(resident=request.user).order_by("-created_at")
        page = self.paginate_queryset(qs)
        if page is not None:
            return self.get_paginated_response(PickupRequestSerializer(page, many=True).data)
        return Response(PickupRequestSerializer(qs, many=True).data)

    @action(detail=False, methods=["get"], url_path="assigned")
    def assigned(self, request):
        """GET /api/pickups/assigned/ - collector's assigned pickup requests."""
        qs = PickupRequest.objects.filter(collector=request.user).order_by("-created_at")
        page = self.paginate_queryset(qs)
        if page is not None:
            return self.get_paginated_response(PickupRequestSerializer(page, many=True).data)
        return Response(PickupRequestSerializer(qs, many=True).data)


class RouteViewSet(viewsets.ModelViewSet):
    """CRUD for routes. Collectors manage own routes."""
    serializer_class = RouteSerializer
    permission_classes = [PasswordChangeCompletePermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return Route.objects.all()
        return Route.objects.filter(collector=user)

    @action(detail=True, methods=["get"], url_path="stops")
    def stops(self, request, pk=None):
        """GET /api/routes/{id}/stops/"""
        route = self.get_object()
        stops = route.stops.all().order_by("stop_number")
        serializer = RouteStopsSerializer(stops, many=True)
        return Response(serializer.data)


class RouteStopsViewSet(viewsets.ModelViewSet):
    serializer_class = RouteStopsSerializer
    permission_classes = [PasswordChangeCompletePermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return RouteStops.objects.all()
        return RouteStops.objects.filter(route__collector=user)


class CollectionHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only collection history."""
    serializer_class = CollectionHistorySerializer
    permission_classes = [PasswordChangeCompletePermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return CollectionHistory.objects.all()
        return CollectionHistory.objects.filter(collector=user)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [PasswordChangeCompletePermission]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=["patch"], url_path="read")
    def mark_read(self, request, pk=None):
        """PATCH /api/notifications/{id}/read/"""
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return Response(NotificationSerializer(notification).data)

    @action(detail=False, methods=["post"], url_path="mark-all-read")
    def mark_all_read(self, request):
        """POST /api/notifications/mark-all-read/"""
        updated = Notification.objects.filter(
            user=request.user, is_read=False
        ).update(is_read=True)
        return Response({"marked_read": updated})


class ZoneViewSet(viewsets.ModelViewSet):
    serializer_class = ZoneSerializer
    permission_classes = [PasswordChangeCompleteOrReadOnly]
    queryset = Zone.objects.all()


class UserSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = UserSettingsSerializer
    permission_classes = [PasswordChangeCompletePermission]

    def get_queryset(self):
        return UserSettings.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OTPViewSet(viewsets.ModelViewSet):
    serializer_class = OTPSerializer
    permission_classes = [PasswordChangeCompletePermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return OTP.objects.all()
        return OTP.objects.filter(user=user)


#  User List (Admin) 

class UserViewSet(viewsets.ModelViewSet):
    """GET /api/users/ - list/search users (admin), or view own profile."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = User.objects.all().order_by("-date_joined")

        # Non-admins can only see themselves
        if user.role != "admin":
            return User.objects.filter(pk=user.pk)

        # Optional filters
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                models.Q(username__icontains=search)
                | models.Q(email__icontains=search)
                | models.Q(first_name__icontains=search)
                | models.Q(last_name__icontains=search)
            )

        role = self.request.query_params.get("role")
        if role:
            qs = qs.filter(role=role)

        return qs

    @action(detail=False, methods=["post"], url_path="create-collector")
    def create_collector(self, request):
        if request.user.role != User.Role.ADMIN:
            return Response({"detail": "Only website admins can create collectors."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CreateCollectorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        collector = serializer.save()
        send_collector_credentials_email(collector, collector._temporary_password)
        response_data = UserSerializer(collector).data
        response_data["temporary_password"] = collector._temporary_password
        return Response(response_data, status=status.HTTP_201_CREATED)
