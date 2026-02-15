from rest_framework import serializers
from datetime import date
from booking.models import *
from hotels.models import *


class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = ("user", "total_price", "status")

    def validate(self, data):

        check_in = data.get("check_in")
        check_out = data.get("check_out")
        room = data.get("room")

        # 1️⃣ Check date logic
        if check_in >= check_out:
            raise serializers.ValidationError("Check-out must be after check-in.")

        if check_in < date.today():
            raise serializers.ValidationError("Check-in cannot be in the past.")

        # 2️⃣ Check overlapping bookings
        overlapping_bookings = Booking.objects.filter(
            room=room,
            status__in=["pending", "confirmed"],
            check_in__lt=check_out,
            check_out__gt=check_in
        )

        if overlapping_bookings.exists():
            raise serializers.ValidationError("Room is already booked for selected dates.")

        return data

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"