from django.db import connection

def list_tables():
    with connection.cursor() as cursor:
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        for (table_name,) in tables:
            print(table_name)

if __name__ == "__main__":
    import os
    import django
    import dotenv
    dotenv.load_dotenv()
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    list_tables()
