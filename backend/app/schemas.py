from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field

from .models import UserRole


class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str = Field(min_length=6)
    role: UserRole


class UserRead(UserBase):
    id: int
    role: UserRole
    created_at: datetime

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int
    role: UserRole


class LawyerProfileCreate(BaseModel):
    bar_id: Optional[str] = None
    years_experience: Optional[int] = None
    specialties: Optional[str] = None
    bio: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None


class LawyerProfileRead(LawyerProfileCreate):
    id: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    availability_status: bool
    user: UserRead

    class Config:
        orm_mode = True


class CaseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    raw_text: str
    jurisdiction: Optional[str] = None
    case_type: Optional[str] = None


class CaseRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    jurisdiction: Optional[str]
    case_type: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True


class CaseAnalysisRead(BaseModel):
    id: int
    model_name: str
    win_probability: float
    risk_factors: Optional[Any] = None
    summary: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True


class QARequest(BaseModel):
    question: str
    jurisdiction: Optional[str] = None
    topic: Optional[str] = None


class QAResponse(BaseModel):
    answer: str
    disclaimer: str


class SearchLawyersRequest(BaseModel):
    city: Optional[str] = None
    specialization: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class LawyerSearchResult(BaseModel):
    lawyer: LawyerProfileRead
    distance_km: Optional[float] = None

