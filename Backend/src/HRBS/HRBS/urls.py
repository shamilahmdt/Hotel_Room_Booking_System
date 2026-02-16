from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/v1/customer/",include("api.v1.customer.urls")),
    path("api/v1/hotels/",include("api.v1.hotels.urls")),
    path('api/v1/booking/', include('api.v1.booking.urls')),


]

if settings.DEBUG:
    urlpatterns += (
        static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT) +
        static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)
    )