from django.urls import path
from api.v1.hotels import views

urlpatterns = [
    path('hotel-list/',views.hotel_list, name='hotel_list'),
    path('hotel-detail/<int:pk>/',views.hotel_detail, name='hotel_detail'),

    path('room-list/',views.room_list, name='room_list'),
    path('room-detail/<int:pk>/',views.room_detail, name='room_detail'),
    
]