# CSE Exam System: Exam Types Documentation

This document details the different types of exam questions supported by the CSE Exam System, their configurations, and grading mechanisms.

## Table of Contents

- [Overview](#overview)
- [Exam Structure](#exam-structure)
- [Question Types](#question-types)
  - [Multiple Choice Questions](#multiple-choice-questions)
  - [SQL Problems](#sql-problems)
  - [Python Problems](#python-problems)
  - [Pandas Problems](#pandas-problems)
- [Grading Mechanisms](#grading-mechanisms)
- [Creating New Exams](#creating-new-exams)
- [Customizing Problem Types](#customizing-problem-types)

## Overview

The CSE Exam System supports various question types designed to assess different skills and knowledge domains within computer science education. Each exam combines multiple question types to provide a comprehensive assessment of a student's abilities.

## Exam Structure

Exams are stored as JSON files in the AWS S3 bucket under the `exams/` directory. Each exam follows this general structure:

```json
{
  "name": "M11: Introduction to SQL",
  "description": "Basic SQL queries and database concepts",
  "time_limit": 120,
  "questions": [
    {
      "type": "multiple_choice",
      "id": "q1",
      "question": "...",
      "options": ["...", "...", "..."],
      "answer": "..."
    },
    {
      "type": "sql",
      "id": "p1",
      "question": "...",
      "starter_code": "...",
      "test_cases": [...]
    }
    // Additional questions
  ]
}
```

## Question Types

### Multiple Choice Questions

Multiple choice questions test theoretical knowledge and conceptual understanding.

#### Configuration

```json
{
  "type": "multiple_choice",
  "id": "q1",
  "question": "Which SQL command is used to extract data from a database?",
  "options": ["SELECT", "UPDATE", "INSERT", "DELETE"],
  "answer": "SELECT",
  "points": 5
}
```

#### Features

- Single correct answer selection
- Automatic grading
- Support for code snippets within questions
- Support for images and diagrams
- Randomized option order (optional)

### SQL Problems

SQL problems assess a student's ability to write SQL queries to interact with databases.

#### Configuration

```json
{
  "type": "sql",
  "id": "sql1",
  "question": "Write a query to select all customers from the 'customers' table where the city is 'New York'.",
  "starter_code": "SELECT * FROM customers",
  "test_cases": [
    {
      "input": "customers",
      "expected_result": "Query returns customers from New York",
      "hidden": false
    }
  ],
  "points": 10,
  "database_schema": "customers_schema.sql"
}
```

#### Features

- Interactive SQL editor with syntax highlighting
- Execution against a test database
- Real-time validation and feedback
- Result comparison with expected outputs
- Schema visualization support

### Python Problems

Python problems test programming skills including algorithms, data structures, and problem-solving.

#### Configuration

```json
{
  "type": "python",
  "id": "py1",
  "question": "Write a function that returns the factorial of a given number.",
  "starter_code": "def factorial(n):\n    # Your code here\n    pass",
  "test_cases": [
    {
      "input": "factorial(5)",
      "expected_output": "120",
      "hidden": false
    },
    {
      "input": "factorial(0)",
      "expected_output": "1",
      "hidden": false
    },
    {
      "input": "factorial(10)",
      "expected_output": "3628800",
      "hidden": true
    }
  ],
  "points": 15
}
```

#### Features

- Python code editor with syntax highlighting
- Real-time code execution
- Test case validation
- Support for hidden test cases
- Memory and runtime constraints

### Pandas Problems

Pandas problems assess data manipulation and analysis skills using the Python Pandas library.

#### Configuration

```json
{
  "type": "pandas",
  "id": "pd1",
  "question": "Use the provided dataset to calculate the average salary by department.",
  "starter_code": "import pandas as pd\n\ndef analyze_data(df):\n    # Your code here\n    pass",
  "dataset": "employee_data.csv",
  "test_cases": [
    {
      "function_call": "analyze_data(df)",
      "validation_type": "dataframe_equals",
      "expected_result_file": "expected_result.csv",
      "hidden": false
    }
  ],
  "points": 20
}
```

#### Features

- Pre-loaded datasets for analysis
- Pandas-specific validation functions
- Dataframe comparison tools
- Visualization capabilities
- Performance metrics

## Grading Mechanisms

The CSE Exam System uses different grading approaches based on the question type:

### Multiple Choice Grading

- Automatic grading based on exact match with the correct answer
- Each question has a specified point value (default: 5 points)
- No partial credit

### SQL Grading

- Result set comparison between student query and reference solution
- Syntax validation and error checking
- Query execution time assessment
- Schema compatibility verification
- Partial credit based on result similarity

### Python Grading

- Test case validation against expected outputs
- Code quality assessment (optional)
- Runtime efficiency evaluation
- Memory usage evaluation
- Partial credit based on passing test cases

### Pandas Grading

- Dataframe comparison (values, shape, column names)
- Visualization assessment (if applicable)
- Performance evaluation for large datasets
- Methodology evaluation
- Partial credit for partially correct solutions

## Creating New Exams

To create a new exam:

1. Create a JSON file following the exam structure format
2. Include a mix of question types appropriate for the subject matter
3. Upload the JSON file to the AWS S3 bucket in the `exams/` directory
4. If needed, upload any additional assets (datasets, images) to the relevant S3 locations
5. Update the frontend code to include the new exam in the available exams list

## Customizing Problem Types

The system is designed to be extensible with new problem types. To add a custom problem type:

1. Define the problem structure in the exam JSON format
2. Create a new UI component to render the problem type in `src/components/problem/`
3. Implement the validation and grading logic in the FastAPI backend
4. Update the autograder module to handle the new problem type
5. Add appropriate test cases and documentation
