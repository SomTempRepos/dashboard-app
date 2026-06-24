from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from tinydb import Query

from models.user_model import (
    UserBasicInfo,
    UserBatchLookupRequest,
    UserResponse,
    UserUpdate,
)
from services.auth_service import get_current_user
from utils.db import db_lock, users_db

router = APIRouter()


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user


@router.post("/batch", response_model=List[UserBasicInfo], status_code=status.HTTP_200_OK)
def lookup_users_batch(
    payload: UserBatchLookupRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    User = Query()
    results = []
    with db_lock:
        for user_id in payload.user_ids:
            user = users_db.get(User.id == user_id)
            if user is not None:
                results.append(
                    UserBasicInfo(id=user["id"], name=user["name"], email=user["email"])
                )
    return results


@router.get("/lookup", response_model=UserResponse, status_code=status.HTTP_200_OK)
def lookup_user_by_email(
    email: str, current_user: UserResponse = Depends(get_current_user)
):
    User = Query()
    with db_lock:
        user = users_db.get(User.email == email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        user_code=user["user_code"],
        team_ids=user["team_ids"],
        created_at=user["created_at"],
    )


@router.get("/by-code/{user_code}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def lookup_user_by_code(
    user_code: str, current_user: UserResponse = Depends(get_current_user)
):
    User = Query()
    with db_lock:
        user = users_db.get(User.user_code == user_code)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        user_code=user["user_code"],
        team_ids=user["team_ids"],
        created_at=user["created_at"],
    )


@router.put("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_me(
    user_data: UserUpdate, current_user: UserResponse = Depends(get_current_user)
):
    User = Query()

    update_data = user_data.dict(exclude_unset=True)

    with db_lock:
        if "email" in update_data and update_data["email"] != current_user.email:
            existing = users_db.get(User.email == update_data["email"])
            if existing is not None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already taken",
                )

        users_db.update(update_data, User.id == current_user.id)
        updated_user = users_db.get(User.id == current_user.id)

    return UserResponse(
        id=updated_user["id"],
        name=updated_user["name"],
        email=updated_user["email"],
        user_code=updated_user["user_code"],
        team_ids=updated_user["team_ids"],
        created_at=updated_user["created_at"],
    )


@router.delete("/me", status_code=status.HTTP_200_OK)
def delete_me(current_user: UserResponse = Depends(get_current_user)):
    User = Query()
    with db_lock:
        users_db.remove(User.id == current_user.id)
    return {"message": "user deleted successfully"}
