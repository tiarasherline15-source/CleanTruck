"""
Email utility functions for sending transactional emails via Resend
"""
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


def _send_via_resend(to_email, subject, html_body, text_body=""):
    """Send email using the Resend Python SDK."""
    try:
        import resend

        resend.api_key = settings.RESEND_API_KEY
        result = resend.Emails.send({
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "html": html_body,
            "text": text_body or html_body,
        })
        logger.info(f"Resend API response: {result}")

        # Check if Resend returned an error in the response body
        if isinstance(result, dict) and result.get("error"):
            logger.error(f"Resend returned error: {result['error']}")
            return False

        return True
    except Exception as e:
        logger.error(f"Resend email failed for {to_email}: {type(e).__name__}: {e}")
        return False


def _send_via_django(to_email, subject, html_body, text_body=""):
    """Fallback: send email using Django's send_mail (console backend in dev)."""
    from django.core.mail import send_mail
    try:
        send_mail(
            subject=subject,
            message=text_body or subject,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            html_message=html_body,
            fail_silently=False,
        )
        logger.info(f"Django email sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Django email failed for {to_email}: {e}")
        if settings.DEBUG:
            logger.info(f"[DEV] Email would be sent to {to_email}: {subject}")
            return True
        return False


def send_email(to_email, subject, html_body, text_body=""):
    """
    Send an email. Tries Resend SDK first if RESEND_API_KEY is configured,
    falls back to Django's email backend.
    """
    if getattr(settings, "RESEND_API_KEY", ""):
        success = _send_via_resend(to_email, subject, html_body, text_body)
        if success:
            return True
        # Fall back to Django if Resend fails
        logger.warning("Resend failed, falling back to Django email backend")
    return _send_via_django(to_email, subject, html_body, text_body)


# ──────────────────────────────────────────────────────────────────────
# OTP Email
# ──────────────────────────────────────────────────────────────────────

def send_otp_email(user, otp_code, purpose="verification"):
    """Send an OTP code via email."""
    purpose_labels = {
        "password_reset": "Password Reset",
        "password_change": "Password Change",
        "registration": "Registration",
        "sms_verification": "Phone Verification",
    }
    label = purpose_labels.get(purpose, "Verification")
    subject = f"Your CleanTruck {label} Code"

    first_name = getattr(user, "first_name", "") or "there"

    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6fafa; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0F6E56;">Your Verification Code</h2>
                <p style="color: #444441; font-size: 16px;">
                    Hello {first_name},
                </p>
                <p style="color: #444441;">
                    Use the following code to complete your {label.lower()}:
                </p>

                <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f0faf8; border-radius: 8px;">
                    <span style="font-size: 32px; font-weight: bold; color: #0F6E56; letter-spacing: 8px;">{otp_code}</span>
                </div>

                <p style="color: #6B9E8A; font-size: 14px;">
                    This code expires in 10 minutes. If you didn't request this,
                    please ignore this email.
                </p>

                <p style="color: #444441; margin-top: 30px;">
                    Best regards,<br/>
                    <strong style="color: #0F6E56;">CleanTruck Team</strong>
                </p>
            </div>
        </body>
    </html>
    """
    text_body = f"Your CleanTruck {label} code is: {otp_code}\nThis code expires in 10 minutes."

    return send_email(user.email, subject, html_body, text_body)


# ──────────────────────────────────────────────────────────────────────
# Transactional Emails
# ──────────────────────────────────────────────────────────────────────

def send_pickup_scheduled_email(user, pickup_request):
    """Send email when pickup is scheduled"""
    subject = "✓ Your Waste Pickup Has Been Scheduled"
    first_name = getattr(user, "first_name", "") or "there"

    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6fafa; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0F6E56;">Hello {first_name},</h2>
                <p style="color: #444441; font-size: 16px;">
                    Your waste pickup has been successfully scheduled! Here are the details:
                </p>

                <div style="background-color: #f0faf8; border-left: 4px solid #1D9E75; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p><strong>Scheduled Date &amp; Time:</strong> {pickup_request.scheduled_datetime.strftime('%B %d, %Y at %I:%M %p')}</p>
                    <p><strong>Pickup Address:</strong> {pickup_request.address}</p>
                    <p><strong>Waste Type:</strong> {pickup_request.get_waste_type_display()}</p>
                    <p><strong>Priority:</strong> {pickup_request.get_priority_display()}</p>
                </div>

                <p style="color: #6B9E8A; font-size: 14px;">
                    Our collection team will arrive at your address on the scheduled date.
                    Please ensure the waste is easily accessible.
                </p>

                <p style="color: #444441; margin-top: 30px;">
                    Best regards,<br/>
                    <strong style="color: #0F6E56;">CleanTruck Team</strong>
                </p>
            </div>
        </body>
    </html>
    """

    return send_email(
        user.email, subject, html_body,
        f"Your pickup has been scheduled for {pickup_request.scheduled_datetime}",
    )


def send_pickup_confirmed_email(user, pickup_request, collector_name=None):
    """Send email when pickup is confirmed/assigned to a collector"""
    subject = "✓ Your Waste Pickup Has Been Confirmed"
    first_name = getattr(user, "first_name", "") or "there"
    collector_info = f"<p style='color: #6B9E8A;'>Your collection will be handled by <strong>{collector_name}</strong>.</p>" if collector_name else ""

    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6fafa; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0F6E56;">Hello {first_name},</h2>
                <p style="color: #444441; font-size: 16px;">
                    Great news! Your waste pickup has been confirmed and assigned.
                </p>

                <div style="background-color: #f0faf8; border-left: 4px solid #1D9E75; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p><strong>Status:</strong> <span style="color: #1D9E75;">Confirmed</span></p>
                    <p><strong>Pickup Address:</strong> {pickup_request.address}</p>
                    <p><strong>Scheduled Date &amp; Time:</strong> {pickup_request.scheduled_datetime.strftime('%B %d, %Y at %I:%M %p')}</p>
                    {collector_info}
                </div>

                <p style="color: #6B9E8A; font-size: 14px;">
                    Please ensure the waste is accessible and ready for pickup at the scheduled time.
                </p>

                <p style="color: #444441; margin-top: 30px;">
                    Best regards,<br/>
                    <strong style="color: #0F6E56;">CleanTruck Team</strong>
                </p>
            </div>
        </body>
    </html>
    """

    return send_email(
        user.email, subject, html_body,
        f"Your pickup on {pickup_request.scheduled_datetime} has been confirmed.",
    )


def send_pickup_completed_email(user, pickup_request):
    """Send email when pickup is completed"""
    subject = "✓ Your Waste Pickup Is Complete"
    first_name = getattr(user, "first_name", "") or "there"

    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6fafa; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0F6E56;">Hello {first_name},</h2>
                <p style="color: #444441; font-size: 16px;">
                    Your waste pickup has been completed successfully!
                </p>

                <div style="background-color: #f0faf8; border-left: 4px solid #059669; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p><strong>Status:</strong> <span style="color: #059669;">Completed</span></p>
                    <p><strong>Address:</strong> {pickup_request.address}</p>
                    <p><strong>Weight Collected:</strong> {pickup_request.actual_weight_kg} kg</p>
                </div>

                <p style="color: #6B9E8A; font-size: 14px;">
                    Thank you for choosing CleanTruck! Your waste has been properly disposed of.
                </p>

                <p style="color: #444441; margin-top: 30px;">
                    Best regards,<br/>
                    <strong style="color: #0F6E56;">CleanTruck Team</strong>
                </p>
            </div>
        </body>
    </html>
    """

    return send_email(
        user.email, subject, html_body,
        f"Your pickup on {pickup_request.scheduled_datetime} has been completed.",
    )


def send_password_reset_email(user, reset_link):
    """Send password reset email"""
    subject = "Reset Your CleanTruck Password"
    first_name = getattr(user, "first_name", "") or "there"

    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6fafa; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0F6E56;">Password Reset Request</h2>
                <p style="color: #444441; font-size: 16px;">
                    Hi {first_name},
                </p>
                <p style="color: #444441;">
                    We received a request to reset your password. Click the button below to create a new password.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}"
                       style="background-color: #1D9E75; color: white; padding: 12px 30px; text-decoration: none;
                              border-radius: 4px; font-weight: bold; display: inline-block;">
                        Reset Password
                    </a>
                </div>

                <p style="color: #6B9E8A; font-size: 14px;">
                    If you didn't request this reset, you can safely ignore this email.
                    This link will expire in 24 hours.
                </p>

                <p style="color: #444441; margin-top: 30px;">
                    Best regards,<br/>
                    <strong style="color: #0F6E56;">CleanTruck Team</strong>
                </p>
            </div>
        </body>
    </html>
    """

    return send_email(
        user.email, subject, html_body,
        "Click the link in the email to reset your password.",
    )


def send_welcome_email(user):
    """Send welcome email to new users"""
    subject = "Welcome to CleanTruck!"
    first_name = getattr(user, "first_name", "") or "there"

    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6fafa; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0F6E56;">Welcome to CleanTruck, {first_name}!</h2>
                <p style="color: #444441; font-size: 16px;">
                    Thank you for joining our community. We're excited to help you manage waste collection efficiently.
                </p>

                <div style="background-color: #f0faf8; border-left: 4px solid #1D9E75; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <h3 style="color: #0F6E56; margin-top: 0;">Getting Started:</h3>
                    <ul style="color: #444441;">
                        <li>Complete your profile with address and contact details</li>
                        <li>Schedule your first waste pickup</li>
                        <li>Track pickups in real-time with our map feature</li>
                        <li>Manage your collection preferences</li>
                    </ul>
                </div>

                <p style="color: #6B9E8A; font-size: 14px;">
                    If you have any questions, feel free to contact our support team.
                </p>

                <p style="color: #444441; margin-top: 30px;">
                    Best regards,<br/>
                    <strong style="color: #0F6E56;">CleanTruck Team</strong>
                </p>
            </div>
        </body>
    </html>
    """

    return send_email(user.email, subject, html_body, "Welcome to CleanTruck!")
