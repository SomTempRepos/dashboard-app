from enum import Enum
from typing import List, Optional

from pydantic import BaseModel


class TaskStatus(str, Enum):
    new = "new"
    in_progress = "in-progress"
    completed = "completed"


class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class TaskCreate(BaseModel):
    title: str
    description: str
    status: TaskStatus
    priority: TaskPriority
    assigned_to: List[str]
    domain: Optional[str] = None
    team_code: Optional[str] = None
    due_date: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    assigned_to: Optional[List[str]] = None
    domain: Optional[str] = None
    team_code: Optional[str] = None
    due_date: Optional[str] = None


class TaskStatusUpdate(BaseModel):
    status: TaskStatus


class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    status: TaskStatus
    priority: TaskPriority
    domain: Optional[str] = None
    assigned_to: List[str]
    team_id: Optional[str] = None
    created_by: str
    due_date: Optional[str] = None
    created_at: str
    updated_at: str
    is_overdue: bool
