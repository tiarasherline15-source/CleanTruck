from rest_framework import serializers  # type: ignore[reportMissingImports]
from django.contrib.auth import get_user_model
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

User = get_user_model()


# Auth 


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "phone",
            "address",
            "zone",
            "role",
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "status",
            "phone",
            "address",
            "zone",
            "profile_picture",
            "location",
            "date_joined",
        ]
        read_only_fields = ["id", "date_joined"]


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = [
            "id",
            "email_notifications",
            "sms_notifications",
            "collection_reminders",
            "route_updates",
            "default_pickup_address",
            "default_route",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


#  Pickups & Routes 


class PickupRequestSerializer(serializers.ModelSerializer):
    resident_detail = UserSerializer(source="resident", read_only=True)
    collector_detail = UserSerializer(source="collector", read_only=True)

    class Meta:
        model = PickupRequest
        fields = [
            "id",
            "resident",
            "resident_detail",
            "collector",
            "collector_detail",
            "route",
            "address",
            "zone",
            "waste_type",
            "scheduled_datetime",
            "status",
            "priority",
            "location",
            "notes",
            "estimated_weight_kg",
            "actual_weight_kg",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CollectionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionHistory
        fields = [
            "id",
            "pickup_request",
            "collector",
            "route",
            "completed_at",
            "duration",
            "weight_kg",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class RouteStopsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteStops
        fields = [
            "id",
            "route",
            "stop_number",
            "address",
            "zone",
            "arrival_time",
            "departure_time",
            "status",
            "pickup_requests",
            "location",
        ]
        read_only_fields = ["id"]


class RouteSerializer(serializers.ModelSerializer):
    stops = RouteStopsSerializer(many=True, read_only=True)

    class Meta:
        model = Route
        fields = [
            "id",
            "name",
            "collector",
            "stops_count",
            "distance_km",
            "estimated_duration",
            "status",
            "waypoints",
            "stops",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


# Zone


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ["id", "name", "description", "coordinates", "is_active"]
        read_only_fields = ["id"]


# Notifications


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "user", "type", "message", "is_read", "created_at"]
        read_only_fields = ["id", "created_at"]


# OTP 


class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = [
            "id",
            "user",
            "code",
            "purpose",
            "phone_number",
            "is_verified",
            "attempts",
            "created_at",
            "expires_at",
        ]
        read_only_fields = ["id", "created_at"]
