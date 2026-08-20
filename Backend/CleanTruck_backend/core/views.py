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
)
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    UserSettingsSerializer,
    PickupRequestSerializer,
    CollectionHistorySerializer,
    RouteSerializer,
    RouteStopsSerializer,
    ZoneSerializer,
    NotificationSerializer,
    OTPSerializer,
)

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


# ViewSets 


class PickupRequestViewSet(viewsets.ModelViewSet):
    """CRUD for pickup requests. Residents see own, collectors see assigned."""
    serializer_class = PickupRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return PickupRequest.objects.all()
        if user.role == "collector":
            return PickupRequest.objects.filter(collector=user)
        return PickupRequest.objects.filter(resident=user)

    def perform_create(self, serializer):
        serializer.save(resident=self.request.user)

    @action(detail=False, methods=["get"], url_path="my")
    def my(self, request):
        """GET /api/pickups/my/ — resident's own pickup requests."""
        qs = PickupRequest.objects.filter(resident=request.user).order_by("-created_at")
        page = self.paginate_queryset(qs)
        if page is not None:
            return self.get_paginated_response(PickupRequestSerializer(page, many=True).data)
        return Response(PickupRequestSerializer(qs, many=True).data)

    @action(detail=False, methods=["get"], url_path="assigned")
    def assigned(self, request):
        """GET /api/pickups/assigned/ — collector's assigned pickup requests."""
        qs = PickupRequest.objects.filter(collector=request.user).order_by("-created_at")
        page = self.paginate_queryset(qs)
        if page is not None:
            return self.get_paginated_response(PickupRequestSerializer(page, many=True).data)
        return Response(PickupRequestSerializer(qs, many=True).data)


class RouteViewSet(viewsets.ModelViewSet):
    """CRUD for routes. Collectors manage own routes."""
    serializer_class = RouteSerializer
    permission_classes = [permissions.IsAuthenticated]

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
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return RouteStops.objects.all()
        return RouteStops.objects.filter(route__collector=user)


class CollectionHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only collection history."""
    serializer_class = CollectionHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return CollectionHistory.objects.all()
        return CollectionHistory.objects.filter(collector=user)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

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
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Zone.objects.all()


class UserSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = UserSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSettings.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OTPViewSet(viewsets.ModelViewSet):
    serializer_class = OTPSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return OTP.objects.all()
        return OTP.objects.filter(user=user)


#  User List (Admin) 

class UserViewSet(viewsets.ModelViewSet):
    """GET /api/users/ — list/search users (admin), or view own profile."""
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
