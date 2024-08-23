from django.apps import AppConfig

class UserConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api.user"

    def ready(self):
        import api.user.signals