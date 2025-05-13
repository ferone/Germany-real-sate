import os
import sys
import logging
from pathlib import Path
from dotenv import load_dotenv
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from pymongo import MongoClient
import subprocess

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def init_postgres():
    """Initialize PostgreSQL database and schema."""
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            host=os.getenv('POSTGRES_HOST', 'localhost'),
            port=os.getenv('POSTGRES_PORT', '5432'),
            user=os.getenv('POSTGRES_USER', 'postgres'),
            password=os.getenv('POSTGRES_PASSWORD', 'postgres')
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()

        # Create database if it doesn't exist
        db_name = os.getenv('POSTGRES_DB', 'germany_real_estate')
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{db_name}'")
        exists = cur.fetchone()
        if not exists:
            logger.info(f"Creating database {db_name}")
            cur.execute(f'CREATE DATABASE {db_name}')

        # Close connection to create new one with the correct database
        cur.close()
        conn.close()

        # Connect to the new database and create schema
        conn = psycopg2.connect(
            host=os.getenv('POSTGRES_HOST', 'localhost'),
            port=os.getenv('POSTGRES_PORT', '5432'),
            user=os.getenv('POSTGRES_USER', 'postgres'),
            password=os.getenv('POSTGRES_PASSWORD', 'postgres'),
            database=db_name
        )
        cur = conn.cursor()

        # Read and execute schema file
        schema_path = Path(__file__).parent / 'schemas' / 'postgres_schema.sql'
        with open(schema_path, 'r') as f:
            schema_sql = f.read()
            cur.execute(schema_sql)

        conn.commit()
        logger.info("PostgreSQL schema created successfully")

    except Exception as e:
        logger.error(f"Error initializing PostgreSQL: {str(e)}")
        raise
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

def init_mongodb():
    """Initialize MongoDB database and schema."""
    try:
        # Connect to MongoDB
        client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
        db = client[os.getenv('MONGODB_DB', 'germany-real-estate')]

        # Read and execute schema file
        schema_path = Path(__file__).parent / 'schemas' / 'mongodb_schema.js'
        with open(schema_path, 'r') as f:
            schema_js = f.read()

        # Execute MongoDB schema using mongosh
        result = subprocess.run(
            ['mongosh', '--eval', schema_js],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            logger.error(f"MongoDB schema creation failed: {result.stderr}")
            raise Exception("Failed to create MongoDB schema")
        
        logger.info("MongoDB schema created successfully")

    except Exception as e:
        logger.error(f"Error initializing MongoDB: {str(e)}")
        raise
    finally:
        if 'client' in locals():
            client.close()

def main():
    """Initialize both databases."""
    try:
        logger.info("Starting database initialization...")
        
        # Initialize PostgreSQL
        logger.info("Initializing PostgreSQL...")
        init_postgres()
        
        # Initialize MongoDB
        logger.info("Initializing MongoDB...")
        init_mongodb()
        
        logger.info("Database initialization completed successfully")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main() 