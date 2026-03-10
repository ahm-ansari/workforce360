import os
import django
from django.db import connection

# Set up Django
import dotenv
dotenv.load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def reset_app(app_name):
    print(f"Resetting app: {app_name}")
    with connection.cursor() as cursor:
        # 1. Fake zero
        os.system(f"python manage.py migrate {app_name} zero --fake")
        
        # 2. Drop all tables for this app
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
        cursor.execute(f"SHOW TABLES LIKE '{app_name}_%';")
        tables = cursor.fetchall()
        for (table_name,) in tables:
            print(f"  Dropping {table_name}")
            cursor.execute(f"DROP TABLE IF EXISTS {table_name};")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
        
        # 3. Clear migration history just in case
        cursor.execute(f"DELETE FROM django_migrations WHERE app='{app_name}';")
        
        # 4. Migrate for real
        os.system(f"python manage.py migrate {app_name}")
    print(f"Finished resetting {app_name}\n")

if __name__ == "__main__":
    apps_to_reset = ['clients', 'cafm', 'marketing', 'sales', 'projects', 'outsourcing', 'visitors']
    for app in apps_to_reset:
        reset_app(app)
