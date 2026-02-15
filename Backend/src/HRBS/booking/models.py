from django.db import models
from django.conf import settings
from hotels.models import Room


class Booking(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="bookings")
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="bookings")
    check_in = models.DateField()
    check_out = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending" )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.room}"
    
# ==============================
# PAYMENT MODEL
# ==============================
class Payment(models.Model):

    PAYMENT_STATUS = (
        ('success', 'Success'),
        ('failed', 'Failed'),
    )

    booking = models.OneToOneField( Booking, on_delete=models.CASCADE, related_name="payment" )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=255)
    payment_status = models.CharField( max_length=20, choices=PAYMENT_STATUS )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Booking {self.booking.id}"