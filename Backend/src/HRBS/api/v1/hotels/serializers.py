from rest_framework import serializers
from hotels.models import *


# ==============================
# HOTEL SERIALIZER
# ==============================
class HotelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hotel
        fields = "__all__"


# ==============================
# ROOM IMAGE SERIALIZER
# ==============================
class RoomImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = RoomImage
        fields = ["id", "image"]


# ==============================
# ROOM SERIALIZER
# ==============================
class RoomSerializer(serializers.ModelSerializer):

    hotel_name = serializers.CharField(source="hotel.name", read_only=True)
    images = RoomImageSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = "__all__"