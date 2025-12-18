import pymysql

try:
    conn = pymysql.connect(host='localhost', user='root', password='#Db;MySQL-3306')
    cursor = conn.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS workforce360")
    print("Database 'workforce360' created or already exists.")
    conn.close()
except Exception as e:
    print(f"Error creating database: {e}")
