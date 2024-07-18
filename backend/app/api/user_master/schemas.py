from pydantic import BaseModel

class UserResponse(BaseModel):
    user_master_id: int
    user_code: str
    user_name: str
    is_active: bool

    class Config:
        from_attributes=True