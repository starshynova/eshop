from connectDB import get_connection

conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
DROP TABLE IF EXISTS subcategory CASCADE;

DROP TABLE IF EXISTS item_subcategory CASCADE;

""")

conn.commit()
cursor.close()
conn.close()
print("✅ Tables deleted successfully.")
