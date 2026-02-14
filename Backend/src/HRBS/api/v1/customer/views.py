from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

import random
from django.contrib.auth import authenticate, get_user_model
from django.conf import settings
from django.core.mail import send_mail
from api.v1.customer.serializers import *
from customer.models import Customer

User = get_user_model()


# ==============================
# REGISTER
# ==============================
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):

    serializer = UserRegistrationSerializer(data=request.data)

    if serializer.is_valid():

        # Create user
        user = serializer.save()
        user.is_customer = True
        user.is_active = False   # prevent login before verification

        # Generate OTP
        otp = random.randint(100000, 999999)
        user.otp = str(otp)
        user.save()

        # Send OTP Email
        try:
            send_mail(
                subject="Your OTP Verification Code",
                message=f"Your OTP is: {otp}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False
            )
        except Exception as e:
            return Response(
                {
                    "message": "User created but OTP sending failed",
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Create Customer Profile
        Customer.objects.create(user=user)

        return Response(
            {
                "message": "Registration successful. OTP sent to email."
            },
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==============================
# VERIFY OTP
# ==============================
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):

    email = request.data.get('email')
    otp = request.data.get('otp')

    if not email or not otp:
        return Response(
            {"error": "Email and OTP are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)

        if user.otp != otp:
            return Response(
                {"error": "Invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.is_verified = True
        user.is_active = True
        user.otp = None
        user.save()

        return Response(
            {"message": "Email verified successfully"},
            status=status.HTTP_200_OK
        )

    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )


# ==============================
# LOGIN
# ==============================
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):

    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(email=email, password=password)

    if user is None:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.is_verified:
        return Response(
            {"error": "Account not verified"},
            status=status.HTTP_403_FORBIDDEN
        )

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        },
        status=status.HTTP_200_OK
    )


# ==============================
# LOGOUT
# ==============================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):

    try:
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"error": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(
            {"message": "Logout successful"},
            status=status.HTTP_205_RESET_CONTENT
        )

    except Exception:
        return Response(
            {"error": "Invalid or expired token"},
            status=status.HTTP_400_BAD_REQUEST
        )
    

# ==============================
# PROFILE VIEW
# ==============================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):

    try:
        serializer = UserSerializer(
            request.user,
            context={"request": request}
        )

        return Response(
            {
                "message": "Profile retrieved successfully",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {
                "error": f"Failed to retrieve profile: {str(e)}"
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
# ==============================
# PROFILE UPDATE
# ==============================
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def profile_update(request):

    try:
        user = request.user

        serializer = UserSerializer(
            user,
            data=request.data,
            partial=True,   # allows updating only specific fields
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Profile updated successfully",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )

        return Response(
            {
                "error": "Validation failed",
                "details": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception as e:
        return Response(
            {
                "error": f"Failed to update profile: {str(e)}"
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )