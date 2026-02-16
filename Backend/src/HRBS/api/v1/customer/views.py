from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import authenticate, get_user_model
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

        user = serializer.save()
        user.is_customer = True
        user.is_active = True  # Activate immediately
        user.save()

        # Create Customer profile
        Customer.objects.create(user=user)

        return Response(
            {"message": "Registration successful."},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


# ==============================
# PROFILE UPDATE
# ==============================
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def profile_update(request):

    serializer = UserSerializer(
        request.user,
        data=request.data,
        partial=True,
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