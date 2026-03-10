import os
import django
from django.apps import apps

# Set up Django
import dotenv
dotenv.load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def check_counts():
    print(f"{'App':<20} | {'Model':<30} | {'Count':<10}")
    print("-" * 65)
    
    for app_config in apps.get_app_configs():
        # Only check our custom apps
        if app_config.name.startswith('apps.'):
            for model in app_config.get_models():
                try:
                    count = model.objects.count()
                    print(f"{app_config.label:<20} | {model.__name__:<30} | {count:<10}")
                except Exception as e:
                    print(f"{app_config.label:<20} | {model.__name__:<30} | ERROR: {str(e)}")

if __name__ == "__main__":
    check_counts()
