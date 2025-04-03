from fastapi import HTTPException, APIRouter, status
from sqlalchemy.orm import Session
from ..csautograde import Autograder
from ..websocket import manager
from uuid import UUID

from ..schemas import SubmissionResponse, Submission
from ..database import DbSession
from .. import models
from .exams import exam_exists

from loguru import logger

router = APIRouter(prefix="/submissions", tags=["Submissions"])


def email_exist(email: str, db: Session):
    """Validate email exists in database."""
    email_exists = db.query(models.Submission).filter(
        models.Submission.email == email).first()
    if not email_exists:
        raise HTTPException(
            status_code=404, detail=f"Email {email} not found")


@router.post("", status_code=status.HTTP_201_CREATED)
async def add_submission(data: Submission, db: DbSession):
    """
    Add a new submission to the database.

    Args:
        data: Submission data from the client
        db: Database session

    Returns:
        A dictionary containing the summary and the submission_id

    Raises:
        HTTPException: If autograding fails
    """
    try:
        # Run autograder on the submission
        ag = Autograder(data)
        ag.grade_submission()
        summary, final_score = ag.create_report()

        # Create submission record
        submission = models.Submission(**data.model_dump())
        submission.summary = summary
        submission.feedback = summary  # Initialize feedback as copy of summary
        submission.score = final_score
        submission.status = "completed"

        # Save to database
        db.add(submission)
        db.commit()
        db.refresh(submission)

        # Notify Discord about the new submission
        notification = {
            "type": "cseassessment",
            "content": {
                "submission_id": str(submission.id),
                "exam_name": submission.exam_name,
                "email": submission.email,
            }
        }
        await manager.broadcast(notification)

        return {
            "summary": summary,
            "submission_id": str(submission.id)  # Convert UUID to string
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Error processing submission: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process submission: {str(e)}"
        )


@router.get("/{exam}/{email}", response_model=SubmissionResponse)
async def get_submission(exam: str, email: str, db: DbSession):
    """Get a submission by email and exam.

    Returns:
        The submission.
    """
    email_exist(email, db)
    exam_exists(exam)

    submission = db.query(models.Submission).filter(
        models.Submission.email == email,
        models.Submission.exam_id == exam
    ).order_by(models.Submission.submitted_at.desc()).first()

    if submission.score is not None:
        submission.status = "completed"

    return submission


@router.get("/{submission_id}", response_model=SubmissionResponse)
async def get_specific_submission(submission_id: UUID, db: DbSession):
    """Get a specific submission by exam ID, email, and submission ID.

    Args:
        submission_id: Submission ID
        db: Database session

    Returns:
        The specific submission.
    """

    submission = db.query(models.Submission).filter(
        models.Submission.id == submission_id
    ).first()

    if not submission:
        raise HTTPException(
            status_code=404,
            detail=f"Submission not found with submission_id: {submission_id}"
        )

    if submission.score is not None:
        submission.status = "completed"

    return submission


@router.get("", response_model=list[SubmissionResponse])
async def get_all_submissions(email: str, db: DbSession):
    """Get all submissions by email

    Args:
        email: Email address as query parameter
        db: Database session

    Returns:
        The submission.
    """
    email_exist(email, db)

    submissions = db.query(models.Submission).filter(
        models.Submission.email == email,
    ).order_by(models.Submission.submitted_at.desc()).all()

    return submissions


@router.put("/{submission_id}/feedback", status_code=status.HTTP_200_OK)
async def add_submission_feedback(submission_id: UUID, feedback: dict, db: DbSession):
    """Add feedback to a specific submission and update the score.

    This endpoint stores the provided feedback text and parses the 'FINAL SCORE' 
    value from the feedback to update the submission's score field.

    Args:
        submission_id: Submission ID
        feedback: Feedback content with a 'feedback' key containing the feedback text
        db: Database session

    Returns:
        A success message.

    Raises:
        HTTPException 404: If submission with given ID is not found
        HTTPException 422: If the score cannot be parsed from the feedback text
    """
    submission = db.query(models.Submission).filter(
        models.Submission.id == submission_id
    ).first()

    if not submission:
        raise HTTPException(
            status_code=404,
            detail=f"Submission not found with submission_id: {submission_id}"
        )
    # Update the submission with feedback
    submission.feedback = feedback["feedback"]

    # Parse and update the score from feedback
    feedback_text = feedback["feedback"]
    if "FINAL SCORE:" in feedback_text:
        score_line = [line for line in feedback_text.split(
            '\n') if "FINAL SCORE:" in line][0]
        try:
            # Extract the score value (e.g., "100" from "FINAL SCORE: 100/100")
            score_value = score_line.split("FINAL SCORE:")[
                1].strip().split('/')[0].strip()
            submission.score = int(score_value)
        except (IndexError, ValueError) as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Error parsing score from feedback: {e}"
            )

    # Save changes to database
    db.commit()
    db.refresh(submission)

    # If you want to notify over websocket about the feedback, uncomment and adjust
    # notification = {
    #     "type": "feedback",
    #     "content": {
    #         "submission_id": submission_id,
    #         "feedback": feedback
    #     }
    # }
    # await manager.broadcast(notification)

    return {"message": "Feedback added successfully"}
