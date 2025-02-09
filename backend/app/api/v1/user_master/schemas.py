from pydantic import BaseModel
from typing import Optional

class UserResponse(BaseModel):
    user_master_id: int
    user_code: str
    user_name: str
    is_active: bool
    role: int

    class Config:
        from_attributes=True

class UserCreateSchema(BaseModel):
    user_code: str
    user_name: str
    password: str
    role: int

class UserUpdateSchema(BaseModel):
    user_code: str
    user_name: str
    password: Optional[str] = None
    role: int
