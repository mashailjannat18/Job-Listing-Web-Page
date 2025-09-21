# models/job.py
from sqlalchemy import Integer, String, DateTime, Table, Column, MetaData
from db import engine
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

meta = MetaData()

job = Table(
    "Job",
    meta,
    Column("id", Integer, primary_key=True),
    Column("title", String, nullable=False),
    Column("company", String, nullable=False),
    Column("job_type", String, nullable=False),
    Column("experience_level", String, nullable=False),
    Column("location", String, nullable=False),
    Column("posting_date", DateTime, nullable=False),
    Column("tags", String, nullable=False),
)

def initialize_job_table():
    try:
        meta.create_all(engine, checkfirst=True)
        logger.info("Job table created successfully or already exists")
    except Exception as e:
        logger.error(f"Failed to create Job table: {str(e)}")
        raise