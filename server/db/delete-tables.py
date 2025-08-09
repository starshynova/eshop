from connectDB import get_connection

conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
DROP TABLE IF EXISTS cart_item CASCADE;


""")

conn.commit()
cursor.close()
conn.close()
print("✅ Table deleted successfully.")
