import secrets

from rest_framework import serializers  # type: ignore[reportMissingImports]
from django.contrib.auth import get_user_model, password_validation
from django.db import models
from django.utils import timezone
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
            "must_change_password",
            "date_joined",
        ]
        read_only_fields = ["id", "date_joined"]


class CreateCollectorSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    zone = serializers.CharField(max_length=100, required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        temporary_password = secrets.token_urlsafe(9)
        email = validated_data["email"]
        user = User(
            username=email,
            email=email,
            role=User.Role.COLLECTOR,
            status=User.Status.ACTIVE,
            must_change_password=True,
            **{key: value for key, value in validated_data.items() if key != "email"},
        )
        user.set_password(temporary_password)
        user.save()
        user._temporary_password = temporary_password
        return user


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        password_validation.validate_password(attrs["new_password"], user)

        if not user.must_change_password:
            # Voluntary change: must verify current password
            current_password = attrs.get("current_password")
            if not current_password:
                raise serializers.ValidationError({"current_password": "Current password is required."})
            if not user.check_password(current_password):
                raise serializers.ValidationError({"current_password": "Current password is incorrect."})
        else:
            # Forced change: skip current password - JWT already proves identity
            attrs.pop("current_password", None)

        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.must_change_password = False
        user.save(update_fields=["password", "must_change_password"])
        return user


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


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "message", "status", "created_at"]
        read_only_fields = ["id", "status", "created_at"]


# ──────────────────────────────────────────────────────────────────────
# Forgot / Reset Password
# ──────────────────────────────────────────────────────────────────────


class ForgotPasswordSerializer(serializers.Serializer):
    """Step 1: Request an OTP for password reset."""
    identifier = serializers.CharField(max_length=255)
    method = serializers.ChoiceField(choices=["email", "phone"])

    def validate(self, attrs):
        identifier = attrs["identifier"].strip()
        method = attrs["method"]
        user = None

        if method == "email":
            user = User.objects.filter(email__iexact=identifier).first()
        else:  # phone
            user = User.objects.filter(phone=identifier).first()

        if user is None:
            # Deliberately vague to avoid user-enumeration
            raise serializers.ValidationError({"identifier": "If an account matches, an OTP has been sent."})

        attrs["_user"] = user
        return attrs


class VerifyOTPSerializer(serializers.Serializer):
    """Step 2: Verify the OTP code."""
    identifier = serializers.CharField(max_length=255)
    code = serializers.CharField(min_length=6, max_length=6)
    method = serializers.ChoiceField(choices=["email", "phone"])

    def validate(self, attrs):
        identifier = attrs["identifier"].strip()
        code = attrs["code"].strip()
        method = attrs["method"]

        # Look up user
        user = None
        if method == "email":
            user = User.objects.filter(email__iexact=identifier).first()
        else:
            user = User.objects.filter(phone=identifier).first()

        if user is None:
            raise serializers.ValidationError({"identifier": "Invalid identifier."})

        # Look up the most recent unverified OTP for this user & purpose
        otp = (
            OTP.objects
            .filter(user=user, purpose=OTP.Purpose.PASSWORD_RESET, is_verified=False)
            .order_by("-created_at")
            .first()
        )

        if otp is None:
            raise serializers.ValidationError({"code": "No pending OTP found. Please request a new one."})

        if timezone.now() > otp.expires_at:
            raise serializers.ValidationError({"code": "OTP has expired. Please request a new one."})

        if otp.attempts >= 5:
            raise serializers.ValidationError({"code": "Too many failed attempts. Please request a new OTP."})

        if otp.code != code:
            OTP.objects.filter(pk=otp.pk).update(attempts=models.F("attempts") + 1)
            raise serializers.ValidationError({"code": "Invalid OTP code."})

        # Mark OTP as verified
        otp.is_verified = True
        otp.save(update_fields=["is_verified"])

        attrs["_user"] = user
        attrs["_otp"] = otp
        return attrs


class ResetPasswordSerializer(serializers.Serializer):
    """Step 3: Set a new password after OTP verification."""
    identifier = serializers.CharField(max_length=255)
    code = serializers.CharField(min_length=6, max_length=6)
    method = serializers.ChoiceField(choices=["email", "phone"])
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        identifier = attrs["identifier"].strip()
        code = attrs["code"].strip()
        method = attrs["method"]

        # Look up user
        user = None
        if method == "email":
            user = User.objects.filter(email__iexact=identifier).first()
        else:
            user = User.objects.filter(phone=identifier).first()

        if user is None:
            raise serializers.ValidationError({"identifier": "Invalid identifier."})

        # Find a verified OTP that matches this code
        otp = (
            OTP.objects
            .filter(
                user=user,
                purpose=OTP.Purpose.PASSWORD_RESET,
                code=code,
                is_verified=True,
            )
            .order_by("-created_at")
            .first()
        )

        if otp is None:
            raise serializers.ValidationError({"code": "OTP not verified. Please verify first."})

        if timezone.now() > otp.expires_at:
            raise serializers.ValidationError({"code": "OTP has expired. Please start over."})

        password_validation.validate_password(attrs["new_password"], user)

        attrs["_user"] = user
        attrs["_otp"] = otp
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["_user"]
        otp = self.validated_data["_otp"]

        user.set_password(self.validated_data["new_password"])
        user.must_change_password = False
        user.save(update_fields=["password", "must_change_password"])

        # Invalidate the OTP so it can't be reused
        OTP.objects.filter(pk=otp.pk).delete()

        return user


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
