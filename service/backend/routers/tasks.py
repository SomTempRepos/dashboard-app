from typing import List

from fastapi import APIRouter, Depends, status

from models.comment_model import CommentCreate, CommentResponse
from models.task_model import TaskCreate, TaskResponse, TaskStatusUpdate, TaskUpdate
from models.user_model import UserResponse
from services.auth_service import get_current_user
from services.comment_service import create_comment, delete_comment, get_task_comments
from services.task_service import (
    create_task,
    delete_task,
    get_my_tasks,
    get_team_tasks,
    update_task,
    update_task_status,
)

router = APIRouter()


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task_route(
    task_data: TaskCreate, current_user: UserResponse = Depends(get_current_user)
):
    return create_task(task_data, current_user)


@router.get("/", response_model=List[TaskResponse], status_code=status.HTTP_200_OK)
def get_tasks_route(current_user: UserResponse = Depends(get_current_user)):
    return get_my_tasks(current_user)


@router.get("/team/{team_id}", response_model=List[TaskResponse], status_code=status.HTTP_200_OK)
def get_team_tasks_route(
    team_id: str, current_user: UserResponse = Depends(get_current_user)
):
    return get_team_tasks(team_id, current_user)


@router.put("/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK)
def update_task_route(
    task_id: str,
    task_data: TaskUpdate,
    current_user: UserResponse = Depends(get_current_user),
):
    return update_task(task_id, task_data, current_user)


@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
def delete_task_route(
    task_id: str, current_user: UserResponse = Depends(get_current_user)
):
    return delete_task(task_id, current_user)


@router.patch(
    "/{task_id}/status", response_model=TaskResponse, status_code=status.HTTP_200_OK
)
def update_task_status_route(
    task_id: str,
    status_data: TaskStatusUpdate,
    current_user: UserResponse = Depends(get_current_user),
):
    return update_task_status(task_id, status_data, current_user)


@router.post(
    "/{task_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_comment_route(
    task_id: str,
    comment_data: CommentCreate,
    current_user: UserResponse = Depends(get_current_user),
):
    return create_comment(task_id, comment_data, current_user)


@router.get(
    "/{task_id}/comments",
    response_model=List[CommentResponse],
    status_code=status.HTTP_200_OK,
)
def get_comments_route(
    task_id: str, current_user: UserResponse = Depends(get_current_user)
):
    return get_task_comments(task_id, current_user)


@router.delete("/{task_id}/comments/{comment_id}", status_code=status.HTTP_200_OK)
def delete_comment_route(
    task_id: str,
    comment_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    return delete_comment(task_id, comment_id, current_user)
