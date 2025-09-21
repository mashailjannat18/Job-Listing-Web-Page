from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

class Config:
    USER = os.getenv("user", "postgres")
    PASSWORD = os.getenv("password", "your_password")
    HOST = os.getenv("host", "db.xhawftdwbjxwpionvwja.supabase.co")
    PORT = os.getenv("port", "5432")
    DBNAME = os.getenv("dbname", "postgres")

    # SQLAlchemy connection URI using psycopg2
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=disable"
    )