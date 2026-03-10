from django.db import connection

def clear_migration_history(app_name):
    with connection.cursor() as cursor:
        print(f"Clearing migration history for {app_name}")
        cursor.execute(f"DELETE FROM django_migrations WHERE app='{app_name}'")
        print(f"Cleared migration history for {app_name}")

if __name__ == "__main__":
    import os
    import django
    import dotenv
    dotenv.load_dotenv()
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    clear_migration_history('recruitment')
