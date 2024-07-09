from datetime import timedelta
from fastapi import APIRouter, Depends, Response, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from .schemas import UserCreate, Token, UserLogin, UserResponse
from .handler import ACCESS_TOKEN_EXPIRE_MINUTES, authenticate_user, create_access_token, get_password_hash, get_current_user, get_user
from ..utils import get_db
from ..models import UserMaster

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)


@router.post('/register', response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user(db, user.user_name)
    if existing_user:
        return JSONResponse(status_code=status.HTTP_409_CONFLICT, content={"detail": "Username already registered"})
    hashed_password = get_password_hash(user.password)
    new_user = UserMaster(
        user_code=user.user_code,
        user_name=user.user_name,
        password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post('/login', response_model=Token)
async def login_for_access_token(user_login: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_login.user_name, user_login.password)
    if not user:
        JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={
                     "detail": "Incorrect username or password"})
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user_name}, expires_delta=access_token_expires
    )

    response.set_cookie(key="access_token",
                        value=access_token, httponly=True)

    return {"access_token": access_token, "token_type": "bearer"}


@router.get('/users/me', response_model=UserResponse)
async def read_users_me(current_user: UserMaster = Depends(get_current_user)):
    return current_user


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return JSONResponse(status_code=status.HTTP_200_OK, content={"detail": "Logged out"})