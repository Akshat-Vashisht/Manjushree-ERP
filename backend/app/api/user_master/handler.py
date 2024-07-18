from sqlalchemy.orm import Session
from ...models import UserMaster

def fetch_users(db: Session):
    users = db.query(UserMaster).all()
    return users