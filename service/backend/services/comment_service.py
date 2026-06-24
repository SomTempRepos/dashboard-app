import uuid
from datetime import datetime

from fastapi import HTTPException, status
from tinydb import Query

from models.comment_model import CommentCreate, CommentResponse
from models.user_model import UserResponse
from utils.db import comments_db, db_lock, tasks_db, teams_db


def _comment_to_response(comment: dict) -> CommentResponse:
    return CommentResponse(
        id=comment["id"],
        task_id=comment["task_id"],
        user_id=comment["user_id"],
        content=comment["content"],
        created_at=comment["created_at"],
    )


def _can_access_task(task: dict, current_user: UserResponse) -> bool:
    # Caller must already hold db_lock before calling this.
    if task["created_by"] == current_user.id:
        return True
    if current_user.id in task["assigned_to"]:
        return True
    team_id = task.get("team_id")
    if team_id is not None:
        Team = Query()
        team = teams_db.get(Team.id == team_id)
        if team is not None and current_user.id in team["member_ids"]:
            return True
    return False


def create_comment(
    task_id: str, comment_data: CommentCreate, current_user: UserResponse
) -> CommentResponse:
    Task = Query()
    with db_lock:
        task = tasks_db.get(Task.id == task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found",
            )

        if not _can_access_task(task, current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to comment on this task",
            )

        comment = {
            "id": str(uuid.uuid4()),
            "task_id": task_id,
            "user_id": current_user.id,
            "content": comment_data.content,
            "created_at": datetime.utcnow().isoformat(),
        }

        comments_db.insert(comment)

    return _comment_to_response(comment)


def get_task_comments(task_id: str, current_user: UserResponse) -> list:
    Task = Query()
    Comment = Query()
    with db_lock:
        task = tasks_db.get(Task.id == task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found",
            )

        if not _can_access_task(task, current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view comments on this task",
            )

        comments = comments_db.search(Comment.task_id == task_id)

    comments.sort(key=lambda c: c["created_at"])
    return [_comment_to_response(comment) for comment in comments]


def delete_comment(task_id: str, comment_id: str, current_user: UserResponse) -> dict:
    Comment = Query()
    with db_lock:
        comment = comments_db.get(Comment.id == comment_id)
        if comment is None or comment["task_id"] != task_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comment not found",
            )

        if comment["user_id"] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the comment author can delete this comment",
            )

        comments_db.remove(Comment.id == comment_id)

    return {"message": "comment deleted successfully"}
