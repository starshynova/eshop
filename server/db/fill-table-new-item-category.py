from connectDB import get_connection

conn = get_connection()
cursor = conn.cursor()

pairs = [
    ('Decoration Swing', 'home decoration'),
    ('Family Tree Photo Frame', 'home decoration'),
    ('House Showpiece Plant', 'home decoration'),
    ('Plant Pot', 'home decoration'),
    ('Table Lamp', 'home decoration'),
    ('Bamboo Spatula', 'kitchen accessories'),
    ('Black Aluminium Cup', 'kitchen accessories'),
    ('Black Whisk', 'kitchen accessories'),
    ('Boxed Blender', 'kitchen accessories'),
    ('Carbon Steel Wok', 'kitchen accessories'),
    ('Chopping Board', 'kitchen accessories'),
    ('Citrus Squeezer Yellow', 'kitchen accessories'),
    ('Egg Slicer', 'kitchen accessories'),
    ('Electric Stove', 'kitchen accessories'),
    ('Fine Mesh Strainer', 'kitchen accessories'),
    ('Fork', 'kitchen accessories'),
    ('Glass', 'kitchen accessories'),
    ('Grater Black', 'kitchen accessories'),
    ('Hand Blender', 'kitchen accessories'),
    ('Ice Cube Tray', 'kitchen accessories'),
    ('Kitchen Sieve', 'kitchen accessories'),
    ('Knife', 'kitchen accessories'),
    ('Lunch Box', 'kitchen accessories'),
    ('Microwave Oven', 'kitchen accessories'),
    ('Mug Tree Stand', 'kitchen accessories'),
    ('Pan', 'kitchen accessories'),
    ('Plate', 'kitchen accessories'),
    ('Red Tongs', 'kitchen accessories'),
    ('Silver Pot With Glass Cap', 'kitchen accessories'),
    ('Slotted Turner', 'kitchen accessories'),
    ('Spice Rack', 'kitchen accessories'),
    ('Spoon', 'kitchen accessories'),
    ('Tray', 'kitchen accessories'),
    ('Wooden Rolling Pin', 'kitchen accessories'),
    ('Yellow Peeler', 'kitchen accessories'),
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
