import sqlite3


DB_NAME = "rag_app.db"


def create_connection():
    conn = sqlite3.connect(DB_NAME , check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()
