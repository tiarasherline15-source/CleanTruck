"""
Email utility functions for sending transactional emails via Resend
"""
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings


def send_pickup_scheduled_email(user, pickup_request):
    """Send email when pickup is scheduled"""
    subject = "✓ Your Waste Pickup Has Been Scheduled"
    
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6fafa; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0F6E56;">Hello {user.first_name},</h2>
                <p style="color: #444441; font-size: 16px;">
                    Your waste pickup has been successfully scheduled! Here are the details:
                </p>
                
                <div style="background-color: #f0faf8; border-left: 4px solid #1D9E75; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p><strong>Scheduled Date & Time:</strong> {pickup_request.scheduled_datetime.strftime('%B %d, %Y at %I:%M %p')}</p>
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
    
    send_mail(
        subject=subject,
        message=f"Your pickup has been scheduled for {pickup_request.scheduled_datetime}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_pickup_confirmed_email(user, pickup_request, collector_name=None):
    """Send email when pickup is confirmed/assigned to a collector"""
    subject = "✓ Your Waste Pickup Has Been Confirmed"
    
    collector_info = f"<p style='color: #6B9E8A;'>Your collection will be handled by <strong>{collector_name}</strong>.</p>" if collector_name else ""
    
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6fafa; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0F6E56;">Hello {user.first_name},</h2>
                <p style="color: #444441; font-size: 16px;">
                    Great news! Your waste pickup has been confirmed and assigned.
                </p>
                
                <div style="background-color: #f0faf8; border-left: 4px solid #1D9E75; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p><strong>Status:</strong> <span style="color: #1D9E75;">Confirmed</span></p>
                    <p><strong>Pickup Address:</strong> {pickup_request.address}</p>
                    <p><strong>Scheduled Date & Time:</strong> {pickup_request.scheduled_datetime.strftime('%B %d, %Y at %I:%M %p')}</p>
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
    
    send_mail(
        subject=subject,
        message=f"Your pickup on {pickup_request.scheduled_datetime} has been confirmed.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_pickup_completed_email(user, pickup_request):
    """Send email when pickup is completed"""
    subject = "✓ Your Waste Pickup Is Complete"
    
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6fafa; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0F6E56;">Hello {user.first_name},</h2>
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
    
    send_mail(
        subject=subject,
        message=f"Your pickup on {pickup_request.scheduled_datetime} has been completed.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_password_reset_email(user, reset_link):
    """Send password reset email"""
    subject = "Reset Your CleanTruck Password"
    
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6fafa; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0F6E56;">Password Reset Request</h2>
                <p style="color: #444441; font-size: 16px;">
                    Hi {user.first_name},
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
    
    send_mail(
        subject=subject,
        message="Click the link in the email to reset your password.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_welcome_email(user):
    """Send welcome email to new users"""
    subject = "Welcome to CleanTruck!"
    
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6fafa; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0F6E56;">Welcome to CleanTruck, {user.first_name}!</h2>
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
    
    send_mail(
        subject=subject,
        message="Welcome to CleanTruck!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )
