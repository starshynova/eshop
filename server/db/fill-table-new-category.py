import uuid
from connectDB import get_connection

categories = [
    {
        "id": uuid.uuid4(),
        "category_name": "kitchen accessories"
    },
    {
        "id": uuid.uuid4(),
        "category_name": "home decoration"
    },
]

conn = get_connection()
cursor = conn.cursor()

for category in categories:
    cursor.execute("""
        INSERT INTO category (id, category_name)
        VALUES (%s, %s)
    """, (str(category["id"]), category["category_name"]))

conn.commit()
cursor.close()
conn.close()

print("✅ The categories table is filled with new initial data.")