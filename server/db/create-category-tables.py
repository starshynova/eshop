from connectDB import get_connection

conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS category (
    id UUID PRIMARY KEY,
    category_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS item_category (
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, category_id)
);

""")

conn.commit()
cursor.close()
conn.close()
print("✅ Tables for categories created successfully.")
