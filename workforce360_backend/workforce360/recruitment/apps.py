from django.apps import AppConfig


class RecruitmentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'recruitment'

    def ready(self):
        # import signals so they get registered
        try:
            import recruitment.signals  # noqa: F401
        except Exception:
            # avoid failing app loading if signals have issues during migrations
            pass