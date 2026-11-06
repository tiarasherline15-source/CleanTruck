"""
Django signals for CleanTruck app - auto-send emails and notifications
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from .models import PickupRequest, CollectionHistory, User, UserSettings, Notification
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
        Notification.objects.create(
            user=instance.resident,
            type=Notification.Type.INFO,
            message=f"Pickup request #{instance.pk} for {instance.waste_type} at {instance.address} has been scheduled.",
        )
        for admin_user in User.objects.filter(role=User.Role.ADMIN):
            Notification.objects.create(
                user=admin_user,
                type=Notification.Type.INFO,
                message=f"New pickup request #{instance.pk} ({instance.waste_type}) scheduled at {instance.address}.",
            )
    else:
        # Existing pickup - check if status changed
        if instance.status == 'in_progress' and instance.collector:
            # Pickup confirmed and assigned to collector
            collector_name = instance.collector.get_full_name() or instance.collector.username
            send_pickup_confirmed_email(instance.resident, instance, collector_name)
            Notification.objects.get_or_create(
                user=instance.resident,
                type=Notification.Type.INFO,
                message=f"Pickup #{instance.pk} at {instance.address} has been assigned to {collector_name}.",
            )
            Notification.objects.get_or_create(
                user=instance.collector,
                type=Notification.Type.INFO,
                message=f"You have been assigned pickup #{instance.pk} ({instance.waste_type}) at {instance.address}.",
            )
        elif instance.status == 'completed':
            # Pickup completed
            send_pickup_completed_email(instance.resident, instance)
            # Create collection history record
            CollectionHistory.objects.get_or_create(
                pickup_request=instance,
                defaults={
                    'collector': instance.collector,
                    'route': instance.route,
                    'completed_at': timezone.now(),
                    'weight_kg': instance.actual_weight_kg or instance.estimated_weight_kg,
                    'notes': instance.notes,
                },
            )
            Notification.objects.get_or_create(
                user=instance.resident,
                type=Notification.Type.SUCCESS,
                message=f"Pickup #{instance.pk} at {instance.address} has been completed!",
            )
            for admin_user in User.objects.filter(role=User.Role.ADMIN):
                Notification.objects.get_or_create(
                    user=admin_user,
                    type=Notification.Type.SUCCESS,
                    message=f"Pickup #{instance.pk} at {instance.address} has been marked completed.",
                )


@receiver(post_save, sender=User)
def send_welcome_email_signal(sender, instance, created, **kwargs):
    """Auto-send welcome email to new users"""
    if created:
        try:
            send_welcome_email(instance)
        except Exception as e:
            print(f"Error sending welcome email to {instance.email}: {e}")
        Notification.objects.create(
            user=instance,
            type=Notification.Type.INFO,
            message="Welcome to CleanTruck! Complete your profile to get started.",
        )


@receiver(post_save, sender=User)
def create_user_settings(sender, instance, created, **kwargs):
    """Auto-create UserSettings for new users"""
    if created:
        UserSettings.objects.get_or_create(user=instance)
