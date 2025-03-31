from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal
from enum import Enum
from uuid import UUID


class Submission(BaseModel):
    email: str
    answers: list
    exam_id: str
    exam_name: str


class SubmissionStatus(str, Enum):
    COMPLETED = "completed"
    INCOMPLETED = "incompleted"
    FAILED = "failed"
    MARKING = "marking"


class SubmissionResponse(BaseModel):
    id: UUID
    email: str
    answers: list
    exam_id: str
    exam_name: str
    submitted_at: Optional[datetime]
    summary: str
    feedback: Optional[str] = None
    score: float
    status: Optional[SubmissionStatus]


class Exam(BaseModel):
    id: str
    name: str
    data: list[dict]


class Language(str, Enum):
    PYTHON = "python"
    SQL = "sql"
    PANDAS = "pandas"


class CodeExecution(BaseModel):
    code: str
    language: Language
    database: Optional[Literal["chinook", "northwind"]] = None


class HelpRequest(BaseModel):
    category: str
    subject: str
    description: str
    userId: str
    images: list[str] = []
