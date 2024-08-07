from django.contrib import admin
from .models import Landmark

# Register your models here.
class LandmarkAdmin(admin.ModelAdmin):
    list_display = ["landmark_id", "x_coordinates", "y_coordinates", "exercise"]

# Register your models here.
admin.site.register(Landmark)