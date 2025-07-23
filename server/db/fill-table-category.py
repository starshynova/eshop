import uuid
from connectDB import get_connection

categories = [
    {
        "id": uuid.uuid4(),
        "name": "pants"
    },
    {
        "id": uuid.uuid4(),
        "name": "set"
    },
    {
        "id": uuid.uuid4(),
        "name": "dress"
    },
]

conn = get_connection()
cursor = conn.cursor()

for category in categories:
    cursor.execute("""
        INSERT INTO category (id, name)
        VALUES (%s, %s)
    """, (str(category["id"]), category["name"]))

conn.commit()
cursor.close()
conn.close()

print("✅ The categories table is filled with initial data.")