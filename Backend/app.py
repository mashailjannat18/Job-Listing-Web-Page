from flask import Flask
from models.job import initialize_job_table
import logging
from flask_cors import CORS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

with app.app_context():
    logger.info("Starting database initialization...")
    try:
        initialize_job_table()
        logger.info("Database initialization completed successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        raise

from routes.job_routes import *

@app.route("/")
def welcome():
    logger.info("Update 02")
    return "Home page"

@app.route("/home")
def homepage():
    return "This is home page"

@app.route("/debugTest")
def testFunc():
    return "This is debugger function test"

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)