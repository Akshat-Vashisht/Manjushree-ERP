from pydantic import BaseModel


class UserCreate(BaseModel):
    user_code: str
    user_name: str
    password: str
    role: int

class UserResponse(BaseModel):
    user_code: str
    user_name: str
    role: int
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_name: str | None = None


class UserLogin(BaseModel):
    user_name: str
    password: str
