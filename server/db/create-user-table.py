from connectDB import get_connection

conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL
        CHECK (char_length(first_name) >= 2 AND char_length(first_name) <= 30),
    last_name TEXT NOT NULL
        CHECK (char_length(last_name) >= 2 AND char_length(last_name) <= 30),
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    post_code TEXT NOT NULL
        CHECK (char_length(post_code) = 6),
    city TEXT NOT NULL,
    created_date TIMESTAMP NOT NULL
);
""")

conn.commit()
cursor.close()
conn.close()
print("✅ Table 'users' created successfully.")
