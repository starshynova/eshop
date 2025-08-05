from connectDB import get_connection

conn = get_connection()
cursor = conn.cursor()

cursor.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')
cursor.execute("""
CREATE TABLE IF NOT EXISTS subcategory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES category(id) ON DELETE CASCADE,  
    subcategory_name TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS item_subcategory (
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    subcategory_id UUID NOT NULL REFERENCES subcategory(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, subcategory_id)
);
""")

conn.commit()
cursor.close()
conn.close()
print("✅ Tables for subcategories created successfully.")
