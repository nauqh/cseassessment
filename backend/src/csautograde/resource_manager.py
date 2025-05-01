import pandas as pd
import sqlite3
import psycopg
import requests
import boto3
import yaml
import json
from loguru import logger

from dotenv import load_dotenv

load_dotenv()


class ResourceManager:
    def __init__(self, config):
        self.config = config
        self.resources = {}
        self._initialize_resources()

    def _initialize_resources(self):
        """Initialize all resources defined in config"""
        resource_handlers = {
            'database': self._init_database,
            'dataframe': self._init_dataframe,
            'test_cases': self._init_test_cases
        }

        resources = self.config.get('resources', {})
        for resource_type, config in resources.items():
            if resource_type in resource_handlers:
                self.resources[resource_type] = resource_handlers[resource_type](
                    config)

    def _init_database(self, config):
        """Initialize database connection based on type"""
        db_type = config.get('type', 'sqlite')

        if db_type == 'sqlite':
            return self._init_sqlite_db(config)
        elif db_type == 'postgresql':
            return self._init_postgres_db(config)
        else:
            raise ValueError(f"Unsupported database type: {db_type}")

    def _init_sqlite_db(self, config):
        """Initialize SQLite database"""
        if 'source' in config:
            response = requests.get(config['source'])
            with open(config['filename'], "wb") as file:
                file.write(response.content)
        return sqlite3.connect(config['filename'])

    def _init_postgres_db(self, config):
        """Initialize PostgreSQL database"""
        conn_params = config.get('connection', {})
        return psycopg.connect(**conn_params)

    def _init_dataframe(self, config):
        """Initialize and preprocess dataframe"""
        df = pd.read_csv(config['source'])

        for step in config.get('preprocess', []):
            if step['type'] == 'drop_columns':
                df.drop(columns=step['columns'], inplace=True)
            elif step['type'] == 'title_case':
                for col in step['columns']:
                    df[col] = df[col].str.title()

        return df

    def _init_test_cases(self, config):
        """Initialize test cases"""
        return self._get_s3_data(config['source'])

    @classmethod
    def _get_s3_data(cls, key: str) -> dict:
        logger.info(f"Fetching data from S3: {key}")
        """Fetches data from the specified S3 key"""
        s3 = boto3.client("s3", region_name="ap-southeast-1")
        try:
            obj = s3.get_object(Bucket="cseassessment", Key=key)
            data = obj["Body"].read().decode("utf-8")
            if key.endswith(".yml") or key.endswith(".yaml"):
                return yaml.safe_load(data)
            elif key.endswith(".json"):
                return json.loads(data)
            else:
                print(f"Unsupported file format for key: {key}")
                return None
        except Exception as e:
            print("An unexpected error occurred:", e)
            return None

    def get_resource(self, resource_type):
        """Get a specific resource"""
        return self.resources.get(resource_type)
