from .exceptions import DataNotFoundError
from .database import SessionLocal
from datetime import datetime

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

# Returns the current timestamp for a given timezone
def now(timezone: str = "Asia/Kolkata", return_string: bool = False, time_format: str = "%Y-%m-%d %H:%M:%S.%f") -> datetime:
    now = datetime.now()

    if return_string:
        return now.strftime(time_format)
    
    return now