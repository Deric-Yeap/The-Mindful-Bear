from django.contrib import admin
from .models import Exercise

class ExerciseAdmin(admin.ModelAdmin):
    list_display = ["exercise_id", "audio_url", "description"]

# Register your models here.
admin.site.register(Exercise)