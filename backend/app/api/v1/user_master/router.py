from typing import List
from fastapi import APIRouter, Depends, status
from ....utils import get_db
from ....auth.handler import get_current_user
from .handler import fetch_users, add_user, update_user, soft_delete
from .schemas import UserResponse, UserCreateSchema, UserUpdateSchema

router = APIRouter()
router.dependencies = [Depends(get_current_user)]

@router.get('/', response_model=List[UserResponse])
def list_of_users(
    db = Depends(get_db)
):
    return fetch_users(db)

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def create_user(
    user_input: UserCreateSchema, 
    db = Depends(get_db)
):
    return add_user(db, user_input)

@router.patch('/{id}', status_code=status.HTTP_200_OK, response_model=UserResponse)
def update_user_details(
    id: int, 
    user_input: UserUpdateSchema, db = Depends(get_db)
):
    return update_user(db, id, user_input)

@router.delete('/{id}', status_code=status.HTTP_200_OK)
def soft_delete_user(
    id: int, 
    db = Depends(get_db)
):
    return soft_delete(db, id)
