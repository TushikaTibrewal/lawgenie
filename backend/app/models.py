import enum
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy import JSON
from sqlalchemy.orm import relationship

from .db import Base


class UserRole(str, enum.Enum):
    lawyer = "lawyer"
    client = "client"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.client)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    lawyer_profile = relationship("LawyerProfile", back_populates="user", uselist=False)


class LawyerProfile(Base):
    __tablename__ = "lawyer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    bar_id = Column(String(100), nullable=True)
    years_experience = Column(Integer, nullable=True)
    specialties = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True, index=True)
    longitude = Column(Float, nullable=True, index=True)
    availability_status = Column(Boolean, default=True, nullable=False)

    user = relationship("User", back_populates="lawyer_profile")
    cases = relationship("CaseFile", back_populates="lawyer")


class CaseFile(Base):
    __tablename__ = "case_files"

    id = Column(Integer, primary_key=True, index=True)
    lawyer_id = Column(Integer, ForeignKey("lawyer_profiles.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    raw_text = Column(Text, nullable=False)
    jurisdiction = Column(String(100), nullable=True)
    case_type = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    lawyer = relationship("LawyerProfile", back_populates="cases")
    analyses = relationship("CaseAnalysis", back_populates="case_file")


class CaseAnalysis(Base):
    __tablename__ = "case_analyses"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("case_files.id"), nullable=False)
    model_name = Column(String(100), nullable=False)
    win_probability = Column(Float, nullable=False)  # 0–1 range
    risk_factors = Column(JSON, nullable=True)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    case_file = relationship("CaseFile", back_populates="analyses")


class UserQuestion(Base):
    __tablename__ = "user_questions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    question_text = Column(Text, nullable=False)
    answer_text = Column(Text, nullable=True)
    model_name = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

