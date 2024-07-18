from typing import List
from fastapi import APIRouter, Depends
from ...utils import get_db
from .handler import fetch_users
from .schemas import UserResponse

router = APIRouter(
    prefix='/users',
    tags=['user_master']
)

@router.get('/', response_model=List[UserResponse])
def list_of_users(db = Depends(get_db)):
    return fetch_users(db)