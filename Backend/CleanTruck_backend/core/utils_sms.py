"""
SMS utility functions for sending OTPs via Africa's Talking
and OTP generation helpers.
"""
import secrets
import string
import logging
from datetime import timedelta
import requests as _requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


def generate_otp_code(length=6):
    """Generate a cryptographically secure numeric OTP code."""
    return ''.join(secrets.choice(string.digits) for _ in range(length))


def get_otp_expiry(minutes=10):
    """Return a datetime for OTP expiry (default: 10 minutes from now)."""
    return timezone.now() + timedelta(minutes=minutes)


_ssl_patched = False


def _patch_ssl_for_at():
    """
    Patch Africa's Talking SDK to disable SSL verification.
    Needed on Windows / corporate networks where SSL interception causes
    'WRONG_VERSION_NUMBER' errors on api.sandbox.africastalking.com.
    """
    global _ssl_patched
    if _ssl_patched:
        return

    try:
        from africastalking.Service import Service

        _orig_make_get = Service._Service__make_get_request
        _orig_make_post = Service._Service__make_post_request

        def _patched_get(url, headers, data, params, callback=None, timeout=30):
            res = _requests.get(url=url, headers=headers, params=params,
                                data=data, timeout=timeout, verify=False)
            if callback is None or callback == {}:
                return res
            callback(res)

        def _patched_post(url, headers, data, params, callback=None, timeout=30):
            res = _requests.post(url=url, headers=headers, params=params,
                                 data=data, timeout=timeout, verify=False)
            if callback is None or callback == {}:
                return res
            callback(res)

        Service._Service__make_get_request = staticmethod(_patched_get)
        Service._Service__make_post_request = staticmethod(_patched_post)
        _ssl_patched = True
        logger.info("Patched Africa's Talking SDK for SSL compatibility")
    except Exception as e:
        logger.debug(f"AT SSL patch skipped: {e}")


def send_sms(phone_number, message):
    """
    Send an SMS via Africa's Talking.
    Returns True on success, False on failure.
    In sandbox mode, messages are simulated.
    """
    try:
        _patch_ssl_for_at()

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
    """Send an OTP code via email - delegates to utils_email."""
    from .utils_email import send_otp_email as _send_otp_email
    return _send_otp_email(user, otp_code, purpose)
