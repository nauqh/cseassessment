# Creating Exams Using JSON Format

This document provides guidelines and examples for creating exam files in JSON format for the CSE Exam System.

## Table of Contents
- [Basic Structure](#basic-structure)
- [Question Types](#question-types)
  - [Multiple Choice (Single Answer)](#multiple-choice-single-answer)
  - [Multiple Choice (Multiple Answers)](#multiple-choice-multiple-answers)
  - [Function Questions](#function-questions)
  - [SQL Questions](#sql-questions)
  - [File Upload Questions](#file-upload-questions)
- [Formatting and Styling](#formatting-and-styling)
- [Best Practices](#best-practices)

## Basic Structure

Each exam is defined by a JSON file with the following structure:

```json
{
    "name": "Exam Name",
    "language": "exam_language",
    "content": [
        // Array of question objects
    ]
}
```

Where:
- `name`: The title of the exam
- `language`: The primary programming language of the exam (e.g., "python", "sql", "java")
- `content`: An array of question objects

## Question Types

The `resultType` field in each question object determines the type of question:

### Multiple Choice (Single Answer)

```json
{
    "choices": ["A", "B", "C", "D"],
    "resultType": "MULTICHOICE_SINGLE",
    "question": "Question text with **Markdown** support.\n\nA. First option\n\nB. Second option\n\nC. Third option\n\nD. Fourth option"
}
```

### Multiple Choice (Multiple Answers)

```json
{
    "choices": ["A", "B", "C", "D", "E"],
    "resultType": "MULTICHOICE_MANY",
    "question": "Question text asking for multiple answers.\n\nChoose **at most** 2 correct choices.\n\nA. First option\n\nB. Second option\n\nC. Third option\n\nD. Fourth option\n\nE. Fifth option"
}
```

Note: Include information about how many options to select in the question text (e.g., "Choose **at most** 2 correct choices").

### Function Questions

```json
{
    "resultType": "FUNCTION",
    "question": "Complete a function to [description of what the function should do].\n\n*Requirements:*\n- **Input:** [input parameters and types]\n- **Output:** [expected return value and type]\n\n*Example*:\n```\n>>> [example function call]\n[expected output]\n```"
}
```

### SQL Questions

```json
{
    "resultType": "SQL",
    "question": "**SQL query description.**\n\n<br/>\n\n_Expected output_:\n\n",
    "tableData": [
        {
            "ColumnName1": "Value1",
            "ColumnName2": "Value2"
        },
        {
            "ColumnName1": "Value3",
            "ColumnName2": "Value4"
        }
    ]
}
```

The `tableData` array contains the expected output rows that the student's SQL query should produce.

### File Upload Questions

For questions that require students to upload files instead of writing code directly:

```json
{
    "resultType": "FILE_UPLOAD",
    "question": "Upload your implementation of [assignment description].\n\n*Requirements:*\n- File format: [accepted formats]\n- [Other requirements or specifications]",
    "acceptedFormats": [".java", ".py", ".js", ".c", ".cpp", ".sql", ".html", ".css", ".tsx", ".jsx", ".ts"]
}
```

## Formatting and Styling

Questions support Markdown formatting for rich text. You can use:

- **Bold text**: `**bold**`
- *Italic text*: `*italic*`
- Code blocks: enclosed in triple backticks (```)
- Line breaks: Use `\n` for single line breaks or `\n\n` for paragraph breaks
- Images: `![alt text](image_url)`
- HTML tags: limited HTML is supported, such as `<br/>` for line breaks

Example with code formatting:

```json
{
    "resultType": "MULTICHOICE_SINGLE",
    "question": "Given the following code:\n```python\ndef example():\n    return 42\n```\n\nWhat is the return value?",
    "choices": ["A", "B", "C", "D"],
}
```

## Best Practices

1. **Clear Instructions**: Always provide clear instructions, especially for function and SQL questions.

2. **Testing Examples**: Include example inputs and expected outputs to help students understand the requirements.

3. **Consistent Formatting**: Maintain consistent formatting throughout the exam.

4. **Descriptive Names**: Use descriptive names for your exam files (e.g., "M21.json" for Module 21).

5. **Valid JSON**: Ensure your JSON is valid before deploying the exam. Use a JSON validator if necessary.

6. **Question Variety**: Mix different question types to test various skills and knowledge areas.

7. **Reasonable Length**: Keep the exam to a reasonable length, considering the time constraints.

8. **Progressive Difficulty**: Order questions from easiest to most difficult when possible.

9. **Code Examples**: When including code examples, make sure they are syntactically correct and properly formatted.

10. **Answer Choices**: For multiple-choice questions, make sure the answer choices are distinct and unambiguous.
