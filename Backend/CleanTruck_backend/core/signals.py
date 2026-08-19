"""
Django signals for CleanTruck app - auto-send emails and notifications
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import PickupRequest, User, UserSettings
from .utils_email import (
    send_pickup_scheduled_email, 
    send_pickup_confirmed_email,
    send_pickup_completed_email,
    send_welcome_email
)


@receiver(post_save, sender=PickupRequest)
def send_pickup_email(sender, instance, created, **kwargs):
    """Auto-send email when pickup request is created or status changes"""
    if created:
        # New pickup request - send scheduled email
        send_pickup_scheduled_email(instance.resident, instance)
    else:
        # Existing pickup - check if status changed
        if instance.status == 'in_progress' and instance.collector:
            # Pickup confirmed and assigned to collector
            collector_name = instance.collector.get_full_name() or instance.collector.username
            send_pickup_confirmed_email(instance.resident, instance, collector_name)
        elif instance.status == 'completed':
            # Pickup completed
            send_pickup_completed_email(instance.resident, instance)


@receiver(post_save, sender=User)
def send_welcome_email_signal(sender, instance, created, **kwargs):
    """Auto-send welcome email to new users"""
    if created:
        try:
            send_welcome_email(instance)
        except Exception as e:
            print(f"Error sending welcome email to {instance.email}: {e}")


@receiver(post_save, sender=User)
def create_user_settings(sender, instance, created, **kwargs):
    """Auto-create UserSettings for new users"""
    if created:
        UserSettings.objects.get_or_create(user=instance)
