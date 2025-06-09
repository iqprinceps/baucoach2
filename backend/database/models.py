import uuid
from sqlalchemy import Column, String, ForeignKey, Text, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import bcrypt

from .db import Base


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


class Organisation(Base):
    __tablename__ = 'organisations'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)

    users = relationship('User', back_populates='organisation')
    projects = relationship('Project', back_populates='organisation')


class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    organisation_id = Column(UUID(as_uuid=True), ForeignKey('organisations.id'))

    organisation = relationship('Organisation', back_populates='users')


class Project(Base):
    __tablename__ = 'projects'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text)
    organisation_id = Column(UUID(as_uuid=True), ForeignKey('organisations.id'))

    organisation = relationship('Organisation', back_populates='projects')
    sections = relationship('ProjectSection', back_populates='project')
    documents = relationship('Document', back_populates='project')
    chats = relationship('Chat', back_populates='project')
    milestones = relationship('Milestone', back_populates='project')


class ProjectSection(Base):
    __tablename__ = 'project_sections'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id'))
    name = Column(String, nullable=False)

    project = relationship('Project', back_populates='sections')
    documents = relationship('Document', back_populates='section')


class Document(Base):
    __tablename__ = 'documents'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id'))
    section_id = Column(UUID(as_uuid=True), ForeignKey('project_sections.id'))
    file_path = Column(String, nullable=False)

    project = relationship('Project', back_populates='documents')
    section = relationship('ProjectSection', back_populates='documents')


class Chat(Base):
    __tablename__ = 'chats'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id'))
    message = Column(Text, nullable=False)

    project = relationship('Project', back_populates='chats')


class Milestone(Base):
    __tablename__ = 'milestones'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id'))
    name = Column(String, nullable=False)
    due_date = Column(Date)

    project = relationship('Project', back_populates='milestones')
