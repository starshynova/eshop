from connectDB import get_connection

conn = get_connection()
cursor = conn.cursor()

# cursor.execute("""

pairs = [
    ('Burgundy pants', 'pants'),
    ('Blue shirt and pants', 'set'),
    ('Beige shirt and pants', 'set'),
    ('White shirt and skirt', 'set'),
    ('White dress', 'dress'),
]

for item_title, category_name in pairs:
    cursor.execute("""
        INSERT INTO item_category (item_id, category_id)
        SELECT i.id, c.id
        FROM items i
        JOIN category c ON c.category_name = %s
        WHERE i.title = %s
        ON CONFLICT DO NOTHING;
    """, (category_name, item_title))


conn.commit()
cursor.close()
conn.close()

print("✅ The item_category table is filled with initial data.")
