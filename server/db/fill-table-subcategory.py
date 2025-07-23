import uuid
from connectDB import get_connection

subcategories = [
    {
        "category_name": "set",
        "name": "shirt+pants",
    },
    {
        "category_name": "set",
        "name": "shirt+skirt",
    },
]

conn = get_connection()
cursor = conn.cursor()

for subcategory in subcategories:
    cursor.execute(
        "SELECT id FROM category WHERE name = %s",
        (subcategory["category_name"],)
    )
    row = cursor.fetchone()
    if not row:
        raise ValueError(f"Category «{subcategory['category_name']}» not found")
    category_id = row[0]

    # 2) вставляем новую подкатегорию с сгенерированным UUID
    cursor.execute("""
           INSERT INTO subcategory (id, category_id, name)
           VALUES (%s, %s, %s)
       """, (
        str(uuid.uuid4()),  # id подкатегории
        category_id,  # подхватили из БД
        subcategory["name"]  # её собственное имя
    ))

conn.commit()
cursor.close()
conn.close()

print("✅ The subcategories table is filled with initial data.")