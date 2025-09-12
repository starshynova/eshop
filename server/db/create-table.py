from connectDB import get_connection

conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT NOT NULL,
    main_photo_url TEXT NOT NULL,
    additional_photo_1_url TEXT,
    additional_photo_2_url TEXT,
    additional_photo_3_url TEXT,
    stock NUMERIC NOT NULL
);
""")

conn.commit()
cursor.close()
conn.close()
print("✅ Table 'items' created successfully.")
