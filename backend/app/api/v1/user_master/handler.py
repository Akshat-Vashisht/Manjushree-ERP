from sqlalchemy import update
from sqlalchemy.orm import Session
from ....models import UserMaster
from ....utils import fetch_data
from .schemas import UserCreateSchema, UserUpdateSchema
import datetime
from ....auth.handler import get_password_hash

def add_user(db: Session, user_input: UserCreateSchema):
    data = user_input.model_dump()

    # Hash the password
    data.update({ "password": get_password_hash(user_input.password)})

    user = UserMaster(**data)
    db.add(user)
    db.commit()

    db.refresh(user)

    return user
    
def fetch_users(db: Session):
    users = db.query(UserMaster).all()
    return users

def update_user(db: Session, id: int, user_input: UserUpdateSchema):
    user = fetch_data(db, UserMaster, 'user_master_id', id)

    user.user_code = user_input.user_code
    user.user_name = user_input.user_name
    user.role = user_input.role
    
    if user_input.password:
        user.password = get_password_hash(user_input.password)
    
    db.add(user)
    db.commit()
    
    db.refresh(user)

    return user

def soft_delete(db: Session, id: int):
    user = db.get(UserMaster, id)

    user.is_active = False

    db.add(user)
    db.commit()

    return {"deleted": True}
    


