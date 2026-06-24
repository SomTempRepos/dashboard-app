from typing import List, Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResetPassword(BaseModel):
    email: EmailStr
    new_password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    user_code: str
    team_ids: List[str]
    created_at: str


class UserBatchLookupRequest(BaseModel):
    user_ids: List[str]


class UserBasicInfo(BaseModel):
    id: str
    name: str
    email: EmailStr