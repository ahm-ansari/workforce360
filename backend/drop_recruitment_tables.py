from django.db import connection

def drop_recruitment():
    with connection.cursor() as cursor:
        # Disable foreign key checks to drop tables with dependencies
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
        
        cursor.execute("SHOW TABLES LIKE 'recruitment_%';")
        tables = cursor.fetchall()
        for (table_name,) in tables:
            print(f"Dropping {table_name}")
            cursor.execute(f"DROP TABLE IF EXISTS {table_name};")
            
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
        print(f"Dropped {len(tables)} tables.")

if __name__ == "__main__":
    import os
    import django
    import dotenv
    dotenv.load_dotenv()
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    drop_recruitment()
