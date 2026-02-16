from django.urls import path
from api.v1.customer import views

urlpatterns = [
    path('register/',views.register, name='register'),
    path('login/',views.login, name='login'),
    path('logout/',views.logout, name='logout'),
    
    path("profile/", views.profile_view, name="profile"),
    path("profile_update/", views.profile_update, name="profile_update"),
    
]