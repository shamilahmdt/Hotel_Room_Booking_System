from django.db import models
from django.conf import settings


# ==============================
# HOTEL MODEL
# ==============================
class Hotel(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    amenities = models.TextField(help_text="Comma separated amenities")
    image = models.ImageField(upload_to="hotel_images/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="managed_hotels"
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


# ==============================
# ROOM MODEL
# ==============================
class Room(models.Model):

    ROOM_TYPE_CHOICES = (
        ("single", "Single"),
        ("double", "Double"),
        ("suite", "Suite"),
    )

    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
        related_name="rooms"
    )

    room_number = models.CharField(max_length=20)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPE_CHOICES)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.IntegerField()
    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.hotel.name} - Room {self.room_number}"


# ==============================
# ROOM IMAGE MODEL (NEW)
# ==============================
class RoomImage(models.Model):
    room = models.ForeignKey(
        Room,
        related_name="images",
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="room_images/")

    def __str__(self):
        return f"{self.room.room_number} Image"