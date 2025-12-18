from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'List all tables in the database'

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            
            self.stdout.write("All tables in database:")
            for table in tables:
                self.stdout.write(f"  - {table[0]}")
            
            # Check for recruitment tables
            recruitment_tables = [t[0] for t in tables if 'recruitment' in t[0].lower()]
            self.stdout.write(f"\nRecruitment tables: {len(recruitment_tables)}")
            for table in recruitment_tables:
                self.stdout.write(f"  - {table}")
            
            # Check for visitor tables
            visitor_tables = [t[0] for t in tables if 'visitor' in t[0].lower()]
            self.stdout.write(f"\nVisitor tables: {len(visitor_tables)}")
            for table in visitor_tables:
                self.stdout.write(f"  - {table}")
