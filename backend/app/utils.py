from sqlalchemy.orm import Session
from .exceptions import DataNotFoundError
from .database import SessionLocal
from datetime import datetime
from pydantic import BaseModel
import pathlib, os

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
    # TODO: Pending timezone implementation, for ease need to pytz library 
    now = datetime.now()

    if return_string:
        return now.strftime(time_format)
    
    return now

# WIP: Not working correctly, passing statement as a param giving recursive depth error
# Paginate records for a given query
def paginate(query: any, schema: BaseModel, page: int = 1, page_size: int = 10):
    return None
    offset = page_size * (page - 1)

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

# WIP
# Helper class the manage uploaded files on disk
class UploadHelper():
    upload_dir_path = None

    def __init__(self, upload_dir_name: str = 'uploads'):
        self.create_root_uploads_directory(name=upload_dir_name)
    # Creates the parent level 'uploads' directory in which all user uploads will be stored
    def create_root_uploads_directory(self, name: str = 'uploads'):
        base_path = pathlib.Path(__file__).parent.resolve()
        uploads_dir = os.path.join(base_path, name)

        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)

        self.upload_dir_path = uploads_dir

    # Creates any non-existing sub-directories in a given relative path
    def create_relative_dirs_if_not_exist(self, relative_path: str):
        relative_dirs = relative_path.split('/')
        relative_dirs.pop()

        current_level = self.upload_dir_path
        for each in relative_dirs:
            _pass = os.path.join(current_level, each)
            if not os.path.exists(_pass):
                os.makedirs(_pass)
            current_level = _pass
    # Stores the recd content onto the disk 
    def create_new_file(self, content: bytes, relative_path: str):
        # Create any necessary sub-directories
        self.create_relative_dirs_if_not_exist(relative_path)

        absolute_file_path = os.path.join(self.upload_dir_path, relative_path)
        
        with open(absolute_file_path, "wb") as f:
            f.write(content)
        
        return 1
    # Deletes a given file from the disk
    def delete_file():
        pass