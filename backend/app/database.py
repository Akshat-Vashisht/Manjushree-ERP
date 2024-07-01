from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:root@localhost:5432/RediVS"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

