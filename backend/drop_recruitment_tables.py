import MySQLdb

# Connect to database
conn = MySQLdb.connect(
    host='localhost',
    user='root',
    password='',
    database='workforce360'
)

cursor = conn.cursor()

# Drop old recruitment tables
tables_to_drop = [
    'recruitment_interview',
    'recruitment_candidate',
    'recruitment_job',
    'recruitment_jobposting',
    'recruitment_candidateapplication',
    'recruitment_interviewschedule',
]

print("Dropping old recruitment tables...")
for table in tables_to_drop:
    try:
        cursor.execute(f"DROP TABLE IF EXISTS {table}")
        print(f"  Dropped {table}")
    except Exception as e:
        print(f"  Error dropping {table}: {e}")

conn.commit()
conn.close()
print("\nOld tables dropped successfully!")
print("Now run: python manage.py makemigrations recruitment")
print("Then run: python manage.py migrate recruitment")
