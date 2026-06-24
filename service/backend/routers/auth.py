import random
import string
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from tinydb import Query

from models.user_model import UserCreate, UserLogin, UserResetPassword, UserResponse
from services.auth_service import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from utils.db import db_lock, users_db

router = APIRouter()


def _generate_unique_user_code() -> str:
    User = Query()
    alphabet = string.ascii_uppercase + string.digits
    while True:
        code = "".join(random.choices(alphabet, k=6))
        if users_db.get(User.user_code == code) is None:
            return code


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate):
    User = Query()
    with db_lock:
        if users_db.get(User.email == user_data.email) is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        user = {
            "id": str(uuid.uuid4()),
            "name": user_data.name,
            "email": user_data.email,
            "password": hash_password(user_data.password),
            "user_code": _generate_unique_user_code(),
            "team_ids": [],
            "created_at": datetime.utcnow().isoformat(),
        }

        users_db.insert(user)

    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        user_code=user["user_code"],
        team_ids=user["team_ids"],
        created_at=user["created_at"],
    )


@router.post("/login", status_code=status.HTTP_200_OK)
def login(login_data: UserLogin):
    User = Query()
    with db_lock:
        user = users_db.get(User.email == login_data.email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(login_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token({"user_id": user["id"]})

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(current_user: UserResponse = Depends(get_current_user)):
    return {"message": "logged out successfully"}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(reset_data: UserResetPassword):
    User = Query()
    with db_lock:
        user = users_db.get(User.email == reset_data.email)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        users_db.update(
            {"password": hash_password(reset_data.new_password)},
            User.email == reset_data.email,
        )

    return {"message": "password reset successfully"}
