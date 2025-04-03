from fastapi import FastAPI, status, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from .schemas import CodeExecution, Language, HelpRequest
from .csautograde.utils import Utils
from .websocket import manager
from .csautograde.resource_manager import ResourceManager
from . import models
from .database import engine
# Routers
from .routers import exams, submissions
import pandas as pd
import numpy as np

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CS Exam Python Client",
    summary="Client for Attempting and Submitting Exams",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(exams.router)
app.include_router(submissions.router)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        manager.disconnect(websocket)


@app.get("/")
def root():
    return {"message": "Root endpoint"}


@app.post("/execute")
async def execute_code(data: CodeExecution):
    """
    Execute code in specified language and return the result

    Args:
        data: CodeExecution object containing the code and language

    Returns:
        Dict containing execution output or error message
    """
    if data.language == Language.PYTHON:
        clean_globals = {}
        result = Utils.execute_code(data.code, clean_globals)
    elif data.language == Language.PANDAS:
        # Load the exam configuration to get dataframe settings
        try:
            solution = ResourceManager._get_s3_data("solutions/M31.yml")
            resource_manager = ResourceManager(solution.get('config', {}))

            # Execute the pandas expression
            result = Utils.execute_expression(data.code, {
                'df': resource_manager.get_resource('dataframe'),
                'pd': pd,
                'np': np
            })
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error loading dataframe: {str(e)}"
            )
    else:
        result = Utils.execute_query(data.code, data.database)

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )

    return {
        "output": result["output"],
        "language": data.language
    }


@app.post("/help", status_code=status.HTTP_200_OK)
async def request_help(request: HelpRequest):
    """
    Send a help request that will be broadcasted to Discord bot

    Args:
        request: HelpRequest object containing category, subject, description, userId and images
    """
    notification = {
        "type": "help_request",
        "content": request.model_dump()
    }

    await manager.broadcast(notification)
