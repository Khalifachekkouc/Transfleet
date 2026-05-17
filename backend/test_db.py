import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

pw = os.getenv("DB_PASSWORD")
print(f"Password from .env: [{pw}]")
print(f"Length: {len(pw)}")

# Test 1: direct host
try:
    conn = psycopg2.connect(
        host="db.wsvagfqvopbwvzppymsx.supabase.co",
        port=5432,
        dbname="postgres",
        user="postgres",
        password=pw,
        sslmode="require",
        connect_timeout=10
    )
    print("DIRECT HOST: SUCCESS")
    conn.close()
except Exception as e:
    print(f"DIRECT HOST FAIL: {e}")

# Test 2: session pooler eu-west-1 with project-scoped user
try:
    conn = psycopg2.connect(
        host="aws-0-eu-west-1.pooler.supabase.com",
        port=5432,
        dbname="postgres",
        user="postgres.wsvagfqvopbwvzppymsx",
        password=pw,
        sslmode="require",
        connect_timeout=10
    )
    print("POOLER eu-west-1 (port 5432): SUCCESS")
    conn.close()
except Exception as e:
    print(f"POOLER eu-west-1 port 5432 FAIL: {e}")

# Test 3: transaction pooler port 6543
try:
    conn = psycopg2.connect(
        host="aws-0-eu-west-1.pooler.supabase.com",
        port=6543,
        dbname="postgres",
        user="postgres.wsvagfqvopbwvzppymsx",
        password=pw,
        sslmode="require",
        connect_timeout=10
    )
    print("POOLER eu-west-1 (port 6543): SUCCESS")
    conn.close()
except Exception as e:
    print(f"POOLER eu-west-1 port 6543 FAIL: {e}")
