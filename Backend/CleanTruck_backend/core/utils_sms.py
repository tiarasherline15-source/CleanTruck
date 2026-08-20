"""
SMS utility functions for sending OTPs via Africa's Talking
and OTP generation helpers.
"""
import secrets
import string
import logging
from datetime import timedelta
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


def generate_otp_code(length=6):
    """Generate a cryptographically secure numeric OTP code."""
    return ''.join(secrets.choice(string.digits) for _ in range(length))


def get_otp_expiry(minutes=10):
    """Return a datetime for OTP expiry (default: 10 minutes from now)."""
    return timezone.now() + timedelta(minutes=minutes)


def send_sms(phone_number, message):
    """
    Send an SMS via Africa's Talking.
    Returns True on success, False on failure.
    In sandbox mode, messages are simulated.
    """
    try:
        import africastalking

        africastalking.initialize(
            username=settings.AFRICASTALKING_USERNAME,
            api_key=settings.AFRICASTALKING_API_KEY,
        )
        sms = africastalking.SMS

        response = sms.send(
            message=message,
            recipients=[phone_number],
            sender_id=settings.AFRICASTALKING_SENDER_ID,
        )

        # Check response
        if response and hasattr(response, 'SMSMessageData'):
            recipients = response.SMSMessageData.get('Recipients', [])
            for recipient in recipients:
                if recipient.get('status') == 'Success':
                    logger.info(f"SMS sent successfully to {phone_number}")
                    return True
                else:
                    logger.warning(f"SMS delivery issue for {phone_number}: {recipient.get('status')}")
                    # In sandbox mode, we treat it as success
                    if settings.DEBUG:
                        return True
                    return False

        # If we got a response but couldn't parse it, assume success in sandbox
        if settings.DEBUG:
            logger.info(f"SMS sent (sandbox) to {phone_number}: {message}")
            return True

        return False

    except ImportError:
        logger.error("africastalking package not installed")
        return False
    except Exception as e:
        logger.error(f"Failed to send SMS to {phone_number}: {e}")
        # In development, log the message but don't fail
        if settings.DEBUG:
            logger.info(f"SMS would be sent to {phone_number}: {message}")
            return True
        return False


def send_otp_sms(phone_number, otp_code, purpose="verification"):
    """Send an OTP code via SMS with a branded message."""
    purpose_labels = {
        "password_reset": "password reset",
        "password_change": "password change",
        "registration": "registration",
        "sms_verification": "phone verification",
    }
    label = purpose_labels.get(purpose, "verification")

    message = (
        f"Your CleanTruck {label} code is: {otp_code}\n"
        f"This code expires in 10 minutes.\n"
        f"Do not share this code with anyone."
    )
    return send_sms(phone_number, message)


def send_otp_email(user, otp_code, purpose="verification"):
    """Send an OTP code via email using Django's email backend."""
    from django.core.mail import send_mail

    purpose_labels = {
        "password_reset": "Password Reset",
        "password_change": "Password Change",
        "registration": "Registration",
        "sms_verification": "Phone Verification",
    }
    label = purpose_labels.get(purpose, "Verification")

    subject = f"Your CleanTruck {label} Code"

    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6fafa; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0F6E56;">Your Verification Code</h2>
                <p style="color: #444441; font-size: 16px;">
                    Hello {user.first_name},
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

    try:
        send_mail(
            subject=subject,
            message=f"Your {label} code is: {otp_code}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"OTP email sent to {user.email} for {purpose}")
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP email to {user.email}: {e}")
        if settings.DEBUG:
            logger.info(f"OTP email would be sent to {user.email}: code={otp_code}")
            return True
        return False
