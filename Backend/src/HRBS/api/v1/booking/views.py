from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

import uuid
from booking.models import Payment
from .serializers import PaymentSerializer

from booking.models import Booking
from .serializers import *


# ==============================
# CREATE BOOKING
# ==============================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):
    data = request.data.copy()
    room_id = data.get("room")

    # check room exists
    try:
        room = Room.objects.get(id=room_id)
    except Room.DoesNotExist:
        return Response({"error": "Room not found"}, status=404)

    # parse dates
    try:
        check_in = datetime.strptime(data.get("check_in"), "%Y-%m-%d").date()
        check_out = datetime.strptime(data.get("check_out"), "%Y-%m-%d").date()
    except Exception:
        return Response({"error": "Invalid date format"}, status=400)

    if check_out <= check_in:
        return Response({"error": "Check-out must be after check-in"}, status=400)

    # calculate total_price
    nights = (check_out - check_in).days
    total_price = room.price_per_night * nights

    # create booking via serializer
    serializer = BookingSerializer(data=data)
    if serializer.is_valid():
        booking = serializer.save(
            user=request.user,
            total_price=total_price,
            status="confirmed"
        )
        return Response({
            "message": "Booking created successfully",
            "data": BookingSerializer(booking).data
        }, status=201)

    # if serializer fails
    return Response(serializer.errors, status=400)

# ==============================
# MY BOOKINGS (Customer)
# ==============================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_booking(request):

    bookings = Booking.objects.filter(user=request.user).order_by('-created_at')

    serializer = BookingSerializer(
        bookings,
        many=True,
        context={"request": request}
    )

    return Response(
        {
            "message": "Bookings retrieved successfully",
            "data": serializer.data
        },
        status=status.HTTP_200_OK
    )

# ==============================
# CANCEL BOOKING
# ==============================
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def cancel_booking(request, id):

    try:
        booking = Booking.objects.get(id=id)

        # Only booking owner can cancel
        if booking.user != request.user:
            return Response(
                {"error": "You are not allowed to cancel this booking."},
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status == "cancelled":
            return Response(
                {"error": "Booking already cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "cancelled"
        booking.save()

        return Response(
            {"message": "Booking cancelled successfully."},
            status=status.HTTP_200_OK
        )

    except Booking.DoesNotExist:
        return Response(
            {"error": "Booking not found."},
            status=status.HTTP_404_NOT_FOUND
        )
    
# ==============================
# MANAGER BOOKINGS
# ==============================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def manager_booking(request):

    # Only allow managers
    if request.user.role != "manager":
        return Response(
            {"error": "Only managers can view this."},
            status=status.HTTP_403_FORBIDDEN
        )

    bookings = Booking.objects.filter(
        room__hotel__manager=request.user
    ).order_by('-created_at')

    serializer = BookingSerializer(
        bookings,
        many=True,
        context={"request": request}
    )

    return Response(
        {
            "message": "Manager bookings retrieved successfully",
            "data": serializer.data
        },
        status=status.HTTP_200_OK
    )

# ==============================
# MOCK PAYMENT API
# ==============================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_payment(request, id):

    try:
        booking = Booking.objects.get(id=id)

        # Only booking owner can pay
        if booking.user != request.user:
            return Response(
                {"error": "You are not allowed to pay for this booking."},
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status == "cancelled":
            return Response(
                {"error": "Cannot pay for cancelled booking."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent double payment
        if hasattr(booking, 'payment'):
            return Response(
                {"error": "Payment already completed for this booking."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mock logic — simulate success
        transaction_id = str(uuid.uuid4())

        payment = Payment.objects.create(
            booking=booking,
            amount=booking.total_price,
            transaction_id=transaction_id,
            payment_status='success'
        )

        # Update booking status
        booking.status = 'confirmed'
        booking.save()

        serializer = PaymentSerializer(payment)

        return Response(
            {
                "message": "Payment successful. Booking confirmed.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    except Booking.DoesNotExist:
        return Response(
            {"error": "Booking not found."},
            status=status.HTTP_404_NOT_FOUND
        )