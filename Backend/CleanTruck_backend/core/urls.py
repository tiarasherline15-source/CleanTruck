from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = routers.DefaultRouter()
router.register(r"pickups", views.PickupRequestViewSet, basename="pickup")
router.register(r"routes", views.RouteViewSet, basename="route")
router.register(r"route-stops", views.RouteStopsViewSet, basename="routestop")
router.register(r"collection-history", views.CollectionHistoryViewSet, basename="collection-history")
router.register(r"notifications", views.NotificationViewSet, basename="notification")
router.register(r"zones", views.ZoneViewSet, basename="zone")
router.register(r"user-settings", views.UserSettingsViewSet, basename="user-settings")
router.register(r"otps", views.OTPViewSet, basename="otp")
router.register(r"contact-messages", views.ContactMessageViewSet, basename="contact-message")
router.register(r"users", views.UserViewSet, basename="user")

urlpatterns = [
    # Auth
    path("auth/register/", views.RegisterView.as_view(), name="register"),
    path("users/me/", views.CurrentUserView.as_view(), name="current-user"),
    path("users/me/change-password/", views.ChangePasswordView.as_view(), name="change-password"),

    # Forgot / Reset password (public - no auth required)
    path("auth/forgot-password/", views.ForgotPasswordView.as_view(), name="forgot-password"),
    path("auth/verify-otp/", views.VerifyOTPView.as_view(), name="verify-otp"),
    path("auth/reset-password/", views.ResetPasswordView.as_view(), name="reset-password"),

    # JWT tokens (SimpleJWT built-in views)
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Router-generated routes
    path("", include(router.urls)),
]
