from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import logging
from config import Config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    engine = create_engine(
        Config.SQLALCHEMY_DATABASE_URI,
        echo=True
    )
    conn = engine.connect()
    conn.execute(text("SELECT 1"))
    logger.info("Database connection established successfully!")
except Exception as e:
    logger.error(f"Failed to establish database connection: {str(e)}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()