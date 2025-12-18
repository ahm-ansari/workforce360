import pymysql
pymysql.install_as_MySQLdb()
import MySQLdb

# Connect to database
conn = MySQLdb.connect(
    host='localhost',
    user='root',
    password='#Db;MySQL-3306',
    database='workforce360'
)

cursor = conn.cursor()

# Show all tables
cursor.execute("SHOW TABLES")
tables = cursor.fetchall()

print("Existing tables in workforce360 database:")
for table in tables:
    print(f"  - {table[0]}")

# Check specifically for recruitment tables
recruitment_tables = [t[0] for t in tables if 'recruitment' in t[0]]
print(f"\nRecruitment tables found: {len(recruitment_tables)}")
for table in recruitment_tables:
    print(f"  - {table}")

conn.close()
