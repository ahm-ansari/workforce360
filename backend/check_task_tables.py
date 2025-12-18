import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

with connection.cursor() as cursor:
    cursor.execute("SHOW TABLES LIKE '%tasks%'")
    tables = [row[0] for row in cursor.fetchall()]
    print("Existing task-related tables:", tables)
