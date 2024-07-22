from sqlalchemy.orm import Session
from .exceptions import DataNotFoundError
from .database import SessionLocal
from datetime import datetime
from pydantic import BaseModel

from math import ceil

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

# Paginate records for a given query
def paginate(query: any, schema: BaseModel, page: int = 1, page_size: int = 10):
    offset = page_size * (page - 1)

    return query

    record_count = query.count()

    results = query.offset(offset).limit(page_size).all()

    records = []

    # for x in results:
    #     records.append(schema.model_validate(x))

    page = {
        "current_page": page,
        "total_pages": int(ceil(record_count / page_size)),
        "page_size": page_size,
        "total_records": records,
        "data": query.offset(offset).limit(page_size).all()
    }

    return page
    
    