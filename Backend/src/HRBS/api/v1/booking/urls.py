from django.urls import path
from api.v1.booking import views

urlpatterns = [
    path('create-booking/',views.create_booking, name='create_booking'),
    path('my-booking/',views.my_booking, name='my_booking'),
    path('cancel-booking/<int:id>/',views.cancel_booking, name='cancel_booking'),
    path('manager-booking/',views.manager_booking, name='manager_booking'),
    path('payment/',views.make_payment, name='make_payment'),
    
]