from typing import List, Optional

from pydantic import BaseModel


class TeamCreate(BaseModel):
    name: str


class TeamUpdate(BaseModel):
    name: Optional[str] = None


class TeamAddMember(BaseModel):
    email: str


class TeamJoin(BaseModel):
    team_code: str


class TeamMember(BaseModel):
    id: str
    name: str
    email: str


class TeamResponse(BaseModel):
    id: str
    name: str
    team_code: str
    members: List[TeamMember]
    created_by: str
    created_at: str