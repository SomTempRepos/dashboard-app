import random
import string
import uuid
from datetime import datetime

from fastapi import HTTPException, status
from tinydb import Query

from models.team_model import (
    TeamAddMember,
    TeamCreate,
    TeamMember,
    TeamResponse,
    TeamUpdate,
)
from models.user_model import UserResponse
from utils.db import db_lock, teams_db, users_db


def _team_to_response(team: dict) -> TeamResponse:
    # Caller must already hold db_lock before calling this.
    User = Query()
    members = []
    for user_id in team["member_ids"]:
        user = users_db.get(User.id == user_id)
        if user is not None:
            members.append(
                TeamMember(id=user["id"], name=user["name"], email=user["email"])
            )

    return TeamResponse(
        id=team["id"],
        name=team["name"],
        team_code=team["team_code"],
        members=members,
        created_by=team["created_by"],
        created_at=team["created_at"],
    )


def _generate_unique_team_code() -> str:
    # Caller must already hold db_lock before calling this.
    Team = Query()
    alphabet = string.ascii_uppercase + string.digits
    while True:
        code = "".join(random.choices(alphabet, k=6))
        if teams_db.get(Team.team_code == code) is None:
            return code


def create_team(team_data: TeamCreate, current_user: UserResponse) -> TeamResponse:
    User = Query()
    with db_lock:
        team_id = str(uuid.uuid4())
        team = {
            "id": team_id,
            "name": team_data.name,
            "team_code": _generate_unique_team_code(),
            "member_ids": [current_user.id],
            "created_by": current_user.id,
            "created_at": datetime.utcnow().isoformat(),
        }

        teams_db.insert(team)

        user = users_db.get(User.id == current_user.id)
        updated_team_ids = user["team_ids"] + [team_id]
        users_db.update({"team_ids": updated_team_ids}, User.id == current_user.id)

        response = _team_to_response(team)

    return response


def get_my_teams(current_user: UserResponse) -> list:
    Team = Query()
    with db_lock:
        teams = teams_db.search(Team.member_ids.any([current_user.id]))
        responses = [_team_to_response(team) for team in teams]
    return responses


def get_team(team_id: str, current_user: UserResponse) -> TeamResponse:
    Team = Query()
    with db_lock:
        team = teams_db.get(Team.id == team_id)
        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found",
            )

        if current_user.id not in team["member_ids"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not a member of this team",
            )

        response = _team_to_response(team)

    return response


def get_team_by_code(team_code: str, current_user: UserResponse) -> TeamResponse:
    Team = Query()
    with db_lock:
        team = teams_db.get(Team.team_code == team_code)
        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found",
            )

        if current_user.id not in team["member_ids"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not a member of this team",
            )

        response = _team_to_response(team)

    return response


def update_team(
    team_id: str, team_data: TeamUpdate, current_user: UserResponse
) -> TeamResponse:
    Team = Query()
    with db_lock:
        team = teams_db.get(Team.id == team_id)
        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found",
            )

        if team["created_by"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the creator can update this team",
            )

        update_data = team_data.dict(exclude_unset=True)
        teams_db.update(update_data, Team.id == team_id)

        updated_team = teams_db.get(Team.id == team_id)
        response = _team_to_response(updated_team)

    return response


def delete_team(team_id: str, current_user: UserResponse) -> dict:
    Team = Query()
    User = Query()
    with db_lock:
        team = teams_db.get(Team.id == team_id)
        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found",
            )

        if team["created_by"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the creator can delete this team",
            )

        teams_db.remove(Team.id == team_id)

        for user_id in team["member_ids"]:
            user = users_db.get(User.id == user_id)
            if user is not None and team_id in user["team_ids"]:
                updated_team_ids = [
                    tid for tid in user["team_ids"] if tid != team_id
                ]
                users_db.update({"team_ids": updated_team_ids}, User.id == user_id)

    return {"message": "team deleted successfully"}


def add_member(
    team_id: str, member_data: TeamAddMember, current_user: UserResponse
) -> TeamResponse:
    Team = Query()
    User = Query()
    with db_lock:
        team = teams_db.get(Team.id == team_id)
        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found",
            )

        if team["created_by"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the creator can add members",
            )

        user = users_db.get(User.email == member_data.email)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with that email does not exist",
            )

        if user["id"] not in team["member_ids"]:
            updated_member_ids = team["member_ids"] + [user["id"]]
            teams_db.update({"member_ids": updated_member_ids}, Team.id == team_id)

        if team_id not in user["team_ids"]:
            updated_team_ids = user["team_ids"] + [team_id]
            users_db.update({"team_ids": updated_team_ids}, User.id == user["id"])

        updated_team = teams_db.get(Team.id == team_id)
        response = _team_to_response(updated_team)

    return response


def join_team_by_code(team_code: str, current_user: UserResponse) -> TeamResponse:
    Team = Query()
    User = Query()
    with db_lock:
        team = teams_db.get(Team.team_code == team_code)
        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found",
            )

        if current_user.id in team["member_ids"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You are already a member of this team",
            )

        updated_member_ids = team["member_ids"] + [current_user.id]
        teams_db.update({"member_ids": updated_member_ids}, Team.id == team["id"])

        user = users_db.get(User.id == current_user.id)
        updated_team_ids = user["team_ids"] + [team["id"]]
        users_db.update({"team_ids": updated_team_ids}, User.id == current_user.id)

        updated_team = teams_db.get(Team.id == team["id"])
        response = _team_to_response(updated_team)

    return response


def remove_member(
    team_id: str, user_id: str, current_user: UserResponse
) -> TeamResponse:
    Team = Query()
    User = Query()
    with db_lock:
        team = teams_db.get(Team.id == team_id)
        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found",
            )

        if team["created_by"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the creator can remove members",
            )

        if user_id == team["created_by"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot remove the creator",
            )

        updated_member_ids = [mid for mid in team["member_ids"] if mid != user_id]
        teams_db.update({"member_ids": updated_member_ids}, Team.id == team_id)

        user = users_db.get(User.id == user_id)
        if user is not None and team_id in user["team_ids"]:
            updated_team_ids = [tid for tid in user["team_ids"] if tid != team_id]
            users_db.update({"team_ids": updated_team_ids}, User.id == user_id)

        updated_team = teams_db.get(Team.id == team_id)
        response = _team_to_response(updated_team)

    return response
