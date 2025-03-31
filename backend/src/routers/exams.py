from fastapi import APIRouter, HTTPException
from ..schemas import Exam
import boto3
import json


router = APIRouter(prefix="/exams", tags=["Exams"])


def exam_exists(exam_id):
    s3 = boto3.client("s3")
    try:
        s3.head_object(Bucket="csexam", Key=f"exams/{exam_id}.json")
        return True
    except s3.exceptions.NoSuchKey:
        return False
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error checking exam {exam_id}: {str(e)}"
        )


@router.get("/{id}", response_model=Exam)
async def get_exam(id: str):
    """
    Retrieves a single exam from the database by its id.

    Returns:
        Exam: The exam if found.
    """
    s3 = boto3.client("s3")
    bucket_name = "csexam"
    file_name = f"exams/{id}.json"

    if not exam_exists(id):
        raise HTTPException(status_code=404, detail=f"Exam {id} not found")

    try:
        obj = s3.get_object(Bucket=bucket_name, Key=file_name)
        data = obj["Body"].read().decode("utf-8")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving exam {id}: {str(e)}"
        )

    EXAMS = {
        "M11": "Basic SQL",
        "M12": "Advanced SQL",
        "M21": "Python 101",
        "M31": "Pandas 101",
    }

    return {"id": id, "name": EXAMS.get(id, "N.A."), "data": json.loads(data)}
