from flask import request, jsonify
from app import app
from db import get_db
from sqlalchemy import select, and_, exists
from models.job import job
import logging
from datetime import datetime
import pytz
from contextlib import contextmanager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@contextmanager
def get_db_session():
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

@app.route("/getAllJobs", methods=['GET'])
def getAllJobs():
    try:
        with get_db_session() as db:
            getAll_statement = job.select()

            result = db.execute(getAll_statement)
            jobs = [dict(row._mapping) for row in result]

            db.commit()
            logger.info(f"Retrieved {len(jobs)} jobs")
            return jsonify(jobs)
    except Exception as e:
        logger.error(f"Error getting jobs: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/addJob", methods=['POST'])
def addJob():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data found"}), 400
    
    title = data.get("title")
    company = data.get("company")
    job_type = data.get("job_type")
    location = data.get("location")
    experience_level = data.get("experience_level")
    tags = data.get("tags")

    pakistan_tz = pytz.timezone('Asia/Karachi')
    posting_date = datetime.now(pakistan_tz)
    
    if not all([title, company, job_type, experience_level, location]):
        return jsonify({"error": "Missing required fields"}), 400
    
    match_values = {
        "title_match": title,
        "company_match": company,
        "job_type_match": job_type,
        "experience_level_match": experience_level,
        "location_match": location,
    }
    
    try:
        with get_db_session() as db:
            match_statement = select(
                exists().where(
                    and_(
                        job.c.title == match_values["title_match"],
                        job.c.company == match_values["company_match"],
                        job.c.job_type == match_values["job_type_match"],
                        job.c.experience_level == match_values["experience_level_match"],
                        job.c.location == match_values["location_match"],
                    )
                )
            )
            
            result_2 = db.execute(match_statement).scalar()
            
            if result_2:
                return jsonify({"error": "The job exists already"}), 400
            else:
                insert_statement = job.insert().values(
                    title=title,
                    company=company,
                    job_type=job_type,
                    experience_level=experience_level,
                    location=location,
                    posting_date=posting_date,
                    tags=tags
                )

                result_3 = db.execute(insert_statement)

                db.commit()
                logger.info("Job added successfully")
                return jsonify({"message": "Job added successfully"}), 201
    except Exception as e:
        logger.error(f"Error adding job: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/updateJob", methods=['PUT'])
def updateJob():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data found"}), 400
    
    id = data.get("id")
    title = data.get("title")
    company = data.get("company")
    job_type = data.get("job_type")
    experience_level = data.get("experience_level")
    location = data.get("location")
    tags = data.get("tags")

    if not all([title, company, job_type, experience_level, location]):
        return jsonify({"error": "Missing required fields"}), 400

    pakistan_tz = pytz.timezone('Asia/Karachi')
    posting_date = datetime.now(pakistan_tz)

    try:
        with get_db_session() as db:
            update_statemtent = job.update().where(job.c.id == id).values(
                title=title,
                company=company,
                job_type=job_type,
                experience_level=experience_level,
                location=location,
                tags=tags,
                posting_date=posting_date
            )

            result_4 = db.execute(update_statemtent)

            db.commit()
            logger.info("Job updated successfully")
            return jsonify({"message": "Job updated successfully"}), 201
    except Exception as e:
        logger.error(f"Error updating job: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/deleteJob", methods=['DELETE'])
def deleteJob():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data found"}), 400
    
    id = data.get("id")

    if not id:
        return jsonify({"error": "Missing required field"}), 400
    
    try:
        with get_db_session() as db:
            delete_statement = job.delete().where(job.c.id == id)

            result_5 = db.execute(delete_statement)
            
            db.commit()
            logger.info("Job deleted successfully")
            return jsonify({"message": "Job deleted successfully"}), 201
    except Exception as e:
        logger.error(f"Error deleting job: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500