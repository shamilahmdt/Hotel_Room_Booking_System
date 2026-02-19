from django.contrib import admin
from hotels.models import *

from django.contrib import admin
from .models import Hotel, Room, RoomImage


class RoomImageInline(admin.TabularInline):
    model = RoomImage
    extra = 1


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    inlines = [RoomImageInline]


admin.site.register(Hotel)
