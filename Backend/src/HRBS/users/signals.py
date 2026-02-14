from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import User

@receiver(post_save, sender=User)
def send_otp_email(sender, instance, created, **kwargs):
    if created and not instance.is_verified:
        instance.generate_otp()

        subject = 'Your OTP Verification Code'
        message = f'Your OTP is: {instance.otp}'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [instance.email]

        send_mail(subject, message, from_email, recipient_list)
