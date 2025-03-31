# CSE Exam System: Backend API Documentation

This document provides detailed information about the FastAPI backend that powers the CSE Exam System.

## Table of Contents

- [Overview](#overview)
- [API Endpoints](#api-endpoints)
  - [Exam Endpoints](#exam-endpoints)
  - [Submission Endpoints](#submission-endpoints)
  - [Code Execution Endpoints](#code-execution-endpoints)
  - [WebSocket Endpoints](#websocket-endpoints)
- [Data Models](#data-models)
- [Authentication and Security](#authentication-and-security)
- [Error Handling](#error-handling)
- [Deployment](#deployment)

## Overview

The backend of the CSE Exam System is built using FastAPI, a modern, high-performance Python web framework. It provides RESTful API endpoints for retrieving exam data, submitting answers, executing code, and managing submissions. The system uses PostgreSQL for data persistence and AWS S3 for storing exam content and submissions.

## API Endpoints

### Exam Endpoints

#### GET `/exams/{id}`

Retrieves a specific exam by its ID.

**Parameters:**
- `id` (path): The exam ID (e.g., "M11", "M21")

**Response:**
```json
{
  "id": "M11",
  "name": "Basic SQL",
  "data": [
    {
      "type": "multiple_choice",
      "question": "...",
      "options": ["...", "...", "..."]
    },
    // Additional questions
  ]
}
```

### Submission Endpoints

#### POST `/submissions`

Creates a new submission for an exam.

**Request Body:**
```json
{
  "email": "student@example.com",
  "exam_id": "M11",
  "exam_name": "Basic SQL",
  "answers": [
    {
      "question": "...",
      "answer": "..."
    }
    // Additional answers
  ]
}
```

**Response:**
- Returns a summary report of the submission with grading results

#### GET `/submissions/{exam}/{email}`

Retrieves the most recent submission for a specific exam and email.

**Parameters:**
- `exam` (path): The exam ID
- `email` (path): The student's email address

**Response:**
```json
{
  "id": 123,
  "email": "student@example.com",
  "exam_id": "M11",
  "exam_name": "Basic SQL",
  "answers": [...],
  "submitted_at": "2025-03-05T14:30:00Z",
  "summary": "...",
  "score": 85,
  "status": "completed",
  "channel": null
}
```

#### GET `/submissions/{submission_id}`

Retrieves a submission by its unique identifier.

**Parameters:**
- `submission_id` (path): The submission ID

**Response:**
- Same format as the `/submissions/{exam}/{email}` endpoint

#### GET `/submissions?email={email}`

Retrieves all submissions for a specific email.

**Parameters:**
- `email` (query): The student's email address

**Response:**
```json
[
  {
    "id": 123,
    "email": "student@example.com",
    "exam_id": "M11",
    "exam_name": "Basic SQL",
    "answers": [...],
    "submitted_at": "2025-03-05T14:30:00Z",
    "summary": "...",
    "score": 85,
    "status": "completed",
    "channel": null
  },
  // Additional submissions
]
```

### Code Execution Endpoints

#### POST `/execute`

Executes code in a specified language and returns the result.

**Request Body:**
```json
{
  "code": "print('Hello, World!')",
  "language": "python"
}
```

**Response:**
```json
{
  "output": "Hello, World!",
  "language": "python"
}
```

### WebSocket Endpoints

#### WebSocket `/ws`

Provides a WebSocket connection for real-time notifications and updates.

- Used for broadcasting submission notifications to external systems (e.g., Discord bot)
- Enables real-time status updates for submissions being processed

## Data Models

### Submission

The `Submission` model represents a student's exam submission:

- `id`: Unique identifier (auto-incremented)
- `email`: Student's email address
- `exam_id`: Identifier for the exam (e.g., "M11")
- `exam_name`: Full name of the exam
- `answers`: JSON array containing answers for each question
- `submitted_at`: Timestamp of submission
- `status`: Current status (marking, completed, failed, incompleted)
- `summary`: Summary report of grading
- `score`: Numerical score (0-100)
- `channel`: Optional identifier for external notification channel

### Language Enum

Supported languages for code execution:

- `PYTHON`: Python code execution
- `SQL`: SQL query execution

## Authentication and Security

The backend implements the following security measures:

1. **CORS Middleware**: Configured to allow cross-origin requests from the frontend
2. **Input Validation**: All inputs are validated using Pydantic models
3. **Secure Code Execution**: Sandboxed execution of user-submitted code
4. **Error Handling**: Proper error responses with meaningful messages

## Error Handling

The API follows standard HTTP status codes for error responses:

- `400 Bad Request`: Invalid input or malformed request
- `404 Not Found`: Resource not found (exam, submission)
- `500 Internal Server Error`: Server-side issues

Error responses include a `detail` field with a descriptive message.

## Deployment

The FastAPI backend can be deployed using various methods:

1. **Docker**: Containerized deployment with PostgreSQL
2. **Heroku**: Using the provided Procfile
3. **AWS/Azure/GCP**: Cloud deployment with managed database services

Environment variables required for deployment:

- `DB_CONNECTION`: PostgreSQL connection string
- `AWS_ACCESS_KEY_ID`: AWS credentials for S3 access
- `AWS_SECRET_ACCESS_KEY`: AWS credentials for S3 access
- `AWS_REGION`: AWS region for S3 bucket
