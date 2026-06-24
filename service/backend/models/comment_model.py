from pydantic import BaseModel


class CommentCreate(BaseModel):
    content: str


class CommentResponse(BaseModel):
    id: str
    task_id: str
    user_id: str
    content: str
    created_at: str
