from .exceptions import DataNotFoundError
from .database import SessionLocal


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def fetch_data(db, model, column, value):
    data = db.query(model).filter_by(**{column: value}).first()
    if not data:
        raise DataNotFoundError(column, value)
    return data