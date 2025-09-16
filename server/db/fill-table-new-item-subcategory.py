from connectDB import get_connection

conn = get_connection()
cursor = conn.cursor()

links = [
    {
        "item_title": "Boxed Blende",
        "category": "kitchen accessories",
        "subcategories": ["electronics"],
    },
    {
        "item_title": "Electric Stove",
        "category": "kitchen accessories",
        "subcategories": ["electronics"],
    },
{
        "item_title": "Hand Blender",
        "category": "kitchen accessories",
        "subcategories": ["electronics"],
    },
{
        "item_title": "Microwave Oven",
        "category": "kitchen accessories",
        "subcategories": ["electronics"],
    },
{
        "item_title": "Black Aluminium Cup",
        "category": "kitchen accessories",
        "subcategories": ["tableware"],
    },
{
        "item_title": "Fork",
        "category": "kitchen accessories",
        "subcategories": ["tableware"],
    },
{
        "item_title": "Glass",
        "category": "kitchen accessories",
        "subcategories": ["tableware"],
    },
{
        "item_title": "Knife",
        "category": "kitchen accessories",
        "subcategories": ["tableware"],
    },
{
        "item_title": "Plate",
        "category": "kitchen accessories",
        "subcategories": ["tableware"],
    },
{
        "item_title": "Spoon",
        "category": "kitchen accessories",
        "subcategories": ["tableware"],
    },
]

for link in links:
    item_title = link["item_title"]
    category = link["category"]
    subcategories = link["subcategories"]

    # insert category
    cursor.execute("""
        INSERT INTO item_category (item_id, category_id)
        SELECT i.id, c.id
        FROM items i
        JOIN category c ON c.category_name = %s
        WHERE i.title = %s
        ON CONFLICT DO NOTHING;
    """, (category, item_title))

    # insert subcategories
    for subcat in subcategories:
        cursor.execute("""
            INSERT INTO item_subcategory (item_id, subcategory_id)
            SELECT i.id, s.id
            FROM items i
            JOIN subcategory s ON s.subcategory_name = %s
            WHERE i.title = %s
            ON CONFLICT DO NOTHING;
        """, (subcat, item_title))


conn.commit()
cursor.close()
conn.close()

print("✅ The item_subcategory table is filled with initial data.")