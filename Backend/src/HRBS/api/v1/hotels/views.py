from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from hotels.models import Hotel, Room
from .serializers import HotelSerializer, RoomSerializer


# ==============================
# LIST HOTELS + FILTER + SEARCH
# ==============================
@api_view(['GET'])
@permission_classes([AllowAny])
def hotel_list(request):

    hotels = Hotel.objects.filter(is_active=True)

    # 🔍 Filter by location
    location = request.GET.get('location')
    if location:
        hotels = hotels.filter(location__icontains=location)

    # 🔎 Search by name or location
    search = request.GET.get('search')
    if search:
        hotels = hotels.filter(
            Q(name__icontains=search) |
            Q(location__icontains=search)
        )

    serializer = HotelSerializer(hotels, many=True, context={"request": request})

    return Response(
        {
            "message": "Hotels retrieved successfully",
            "data": serializer.data
        },
        status=status.HTTP_200_OK
    )


# ==============================
# HOTEL DETAIL
# ==============================
@api_view(['GET'])
@permission_classes([AllowAny])
def hotel_detail(request, id):

    try:
        hotel = Hotel.objects.get(id=id, is_active=True)
        serializer = HotelSerializer(hotel, context={"request": request})

        return Response(
            {
                "message": "Hotel retrieved successfully",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    except Hotel.DoesNotExist:
        return Response(
            {
                "error": "Hotel not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )


# ==============================
# LIST ROOMS (OPTIONAL FILTER BY HOTEL)
# ==============================
@api_view(['GET'])
@permission_classes([AllowAny])
def room_list(request):

    rooms = Room.objects.filter(is_available=True)

    # Filter rooms by hotel id
    hotel_id = request.GET.get('hotel')
    if hotel_id:
        rooms = rooms.filter(hotel_id=hotel_id)

    serializer = RoomSerializer(rooms, many=True, context={"request": request})

    return Response(
        {
            "message": "Rooms retrieved successfully",
            "data": serializer.data
        },
        status=status.HTTP_200_OK
    )


# ==============================
# ROOM DETAIL
# ==============================
@api_view(['GET'])
@permission_classes([AllowAny])
def room_detail(request, id):

    try:
        room = Room.objects.get(id=id)
        serializer = RoomSerializer(room, context={"request": request})

        return Response(
            {
                "message": "Room retrieved successfully",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    except Room.DoesNotExist:
        return Response(
            {
                "error": "Room not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )