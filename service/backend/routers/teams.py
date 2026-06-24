from typing import List

from fastapi import APIRouter, Depends, status

from models.team_model import TeamAddMember, TeamCreate, TeamJoin, TeamResponse, TeamUpdate
from models.user_model import UserResponse
from services.auth_service import get_current_user
from services.task_service import get_team_progress
from services.team_service import (
    add_member,
    create_team,
    delete_team,
    get_my_teams,
    get_team,
    join_team_by_code,
    remove_member,
    update_team,
)

router = APIRouter()


@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def create_team_route(
    team_data: TeamCreate, current_user: UserResponse = Depends(get_current_user)
):
    return create_team(team_data, current_user)

@router.post("/join", response_model=TeamResponse, status_code=status.HTTP_200_OK)
def join_team_route(
    join_data: TeamJoin, current_user: UserResponse = Depends(get_current_user)
):
    return join_team_by_code(join_data.team_code, current_user)

@router.get("/", response_model=List[TeamResponse], status_code=status.HTTP_200_OK)
def get_teams_route(current_user: UserResponse = Depends(get_current_user)):
    return get_my_teams(current_user)


@router.get("/{team_id}", response_model=TeamResponse, status_code=status.HTTP_200_OK)
def get_team_route(
    team_id: str, current_user: UserResponse = Depends(get_current_user)
):
    return get_team(team_id, current_user)


@router.get("/{team_id}/progress", status_code=status.HTTP_200_OK)
def get_team_progress_route(
    team_id: str, current_user: UserResponse = Depends(get_current_user)
):
    return get_team_progress(team_id, current_user)


@router.put("/{team_id}", response_model=TeamResponse, status_code=status.HTTP_200_OK)
def update_team_route(
    team_id: str,
    team_data: TeamUpdate,
    current_user: UserResponse = Depends(get_current_user),
):
    return update_team(team_id, team_data, current_user)


@router.delete("/{team_id}", status_code=status.HTTP_200_OK)
def delete_team_route(
    team_id: str, current_user: UserResponse = Depends(get_current_user)
):
    return delete_team(team_id, current_user)


@router.post(
    "/{team_id}/members", response_model=TeamResponse, status_code=status.HTTP_200_OK
)
def add_member_route(
    team_id: str,
    member_data: TeamAddMember,
    current_user: UserResponse = Depends(get_current_user),
):
    return add_member(team_id, member_data, current_user)


@router.delete(
    "/{team_id}/members/{user_id}",
    response_model=TeamResponse,
    status_code=status.HTTP_200_OK,
)
def remove_member_route(
    team_id: str,
    user_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    return remove_member(team_id, user_id, current_user)
