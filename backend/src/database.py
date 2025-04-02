from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from typing import Annotated
import os

from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.environ["DB_CONNECTION"]

# SETUP for NEON DB: https://neon.tech/docs/guides/sqlalchemy
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_recycle=1800,  # Recycle connections after 30 minutes
    pool_pre_ping=True  # Check connection is alive before query execution
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


DbSession = Annotated[Session, Depends(get_db)]
