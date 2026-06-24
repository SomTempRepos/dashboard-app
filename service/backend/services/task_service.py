import uuid
from datetime import datetime

from fastapi import HTTPException, status
from tinydb import Query

from models.task_model import (
    TaskCreate,
    TaskResponse,
    TaskStatus,
    TaskStatusUpdate,
    TaskUpdate,
)
from models.user_model import UserResponse
from utils.db import db_lock, tasks_db, teams_db, users_db


def _compute_is_overdue(task: dict) -> bool:
    due_date = task.get("due_date")
    if due_date is None:
        return False
    if task["status"] == TaskStatus.completed.value:
        return False
    try:
        due = datetime.fromisoformat(due_date)
    except ValueError:
        return False
    return due < datetime.utcnow()


def _task_to_response(task: dict) -> TaskResponse:
    return TaskResponse(
        id=task["id"],
        title=task["title"],
        description=task["description"],
        status=task["status"],
        priority=task["priority"],
        domain=task.get("domain"),
        assigned_to=task["assigned_to"],
        team_id=task.get("team_id"),
        created_by=task["created_by"],
        due_date=task.get("due_date"),
        created_at=task["created_at"],
        updated_at=task.get("updated_at", task["created_at"]),
        is_overdue=_compute_is_overdue(task),
    )


def create_task(task_data: TaskCreate, current_user: UserResponse) -> TaskResponse:
    User = Query()
    Team = Query()

    with db_lock:
        resolved_assigned_to = []
        for email in task_data.assigned_to:
            user = users_db.get(User.email == email)
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Assigned user with email {email} does not exist",
                )
            resolved_assigned_to.append(user["id"])

        resolved_team_id = None
        if task_data.team_code is not None:
            team = teams_db.get(Team.team_code == task_data.team_code)
            if team is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Team with that code does not exist",
                )
            if current_user.id not in team["member_ids"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You are not a member of this team",
                )
            resolved_team_id = team["id"]

        now = datetime.utcnow().isoformat()

        task = {
            "id": str(uuid.uuid4()),
            "title": task_data.title,
            "description": task_data.description,
            "status": task_data.status,
            "priority": task_data.priority,
            "domain": task_data.domain,
            "assigned_to": resolved_assigned_to,
            "team_id": resolved_team_id,
            "created_by": current_user.id,
            "due_date": task_data.due_date,
            "created_at": now,
            "updated_at": now,
        }

        tasks_db.insert(task)

    return _task_to_response(task)


def get_my_tasks(current_user: UserResponse) -> list:
    Task = Query()
    with db_lock:
        tasks = tasks_db.search(
            (Task.created_by == current_user.id)
            | (Task.assigned_to.any([current_user.id]))
        )
    return [_task_to_response(task) for task in tasks]


def get_team_tasks(team_id: str, current_user: UserResponse) -> list:
    Team = Query()
    Task = Query()
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

        tasks = tasks_db.search(Task.team_id == team_id)

    return [_task_to_response(task) for task in tasks]


def update_task(
    task_id: str, task_data: TaskUpdate, current_user: UserResponse
) -> TaskResponse:
    Task = Query()
    User = Query()
    Team = Query()

    with db_lock:
        task = tasks_db.get(Task.id == task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found",
            )

        if task["created_by"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the creator can update this task",
            )

        update_data = task_data.dict(exclude_unset=True)

        if "assigned_to" in update_data:
            resolved_assigned_to = []
            for email in update_data["assigned_to"]:
                user = users_db.get(User.email == email)
                if user is None:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Assigned user with email {email} does not exist",
                    )
                resolved_assigned_to.append(user["id"])
            update_data["assigned_to"] = resolved_assigned_to

        if "team_code" in update_data:
            team_code = update_data.pop("team_code")
            if team_code is None:
                update_data["team_id"] = None
            else:
                team = teams_db.get(Team.team_code == team_code)
                if team is None:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Team with that code does not exist",
                    )
                if current_user.id not in team["member_ids"]:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="You are not a member of this team",
                    )
                update_data["team_id"] = team["id"]

        update_data["updated_at"] = datetime.utcnow().isoformat()

        tasks_db.update(update_data, Task.id == task_id)
        updated_task = tasks_db.get(Task.id == task_id)

    return _task_to_response(updated_task)


def delete_task(task_id: str, current_user: UserResponse) -> dict:
    Task = Query()
    with db_lock:
        task = tasks_db.get(Task.id == task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found",
            )

        if task["created_by"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the creator can delete this task",
            )

        tasks_db.remove(Task.id == task_id)

    return {"message": "task deleted successfully"}


def update_task_status(
    task_id: str, status_update: TaskStatusUpdate, current_user: UserResponse
) -> TaskResponse:
    Task = Query()
    with db_lock:
        task = tasks_db.get(Task.id == task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found",
            )

        if current_user.id not in task["assigned_to"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only an assigned user can update the status",
            )

        tasks_db.update(
            {
                "status": status_update.status,
                "updated_at": datetime.utcnow().isoformat(),
            },
            Task.id == task_id,
        )

        updated_task = tasks_db.get(Task.id == task_id)

    return _task_to_response(updated_task)


def get_team_progress(team_id: str, current_user: UserResponse) -> dict:
    Team = Query()
    Task = Query()

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

        tasks = tasks_db.search(Task.team_id == team_id)

    total = len(tasks)
    status_counts = {
        TaskStatus.new.value: 0,
        TaskStatus.in_progress.value: 0,
        TaskStatus.completed.value: 0,
    }
    overdue_count = 0

    for task in tasks:
        task_status = task["status"]
        if task_status in status_counts:
            status_counts[task_status] += 1
        if _compute_is_overdue(task):
            overdue_count += 1

    completed = status_counts[TaskStatus.completed.value]
    completion_percentage = round((completed / total) * 100, 2) if total > 0 else 0.0

    return {
        "team_id": team_id,
        "total_tasks": total,
        "status_counts": status_counts,
        "overdue_count": overdue_count,
        "completion_percentage": completion_percentage,
    }
