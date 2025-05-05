import os
import boto3

from dotenv import load_dotenv

load_dotenv()


def upload_directory_to_s3(directory: str, bucket: str, s3_prefix: str = ""):
    """
    Uploads all files from a local directory to an AWS S3 bucket.

    Args:
    - directory: Local path to the directory
    - bucket: Name of the S3 bucket
    - s3_prefix: Optional prefix (folder path) in the S3 bucket
    """
    s3_client = boto3.client('s3')
    for root, _, files in os.walk(directory):
        for file in files:
            local_path = os.path.join(root, file)
            relative_path = os.path.relpath(local_path, directory)
            s3_key = os.path.join(s3_prefix, relative_path).replace("\\", "/")

            print(f"Uploading {local_path} to s3://{bucket}/{s3_key}")
            s3_client.upload_file(local_path, bucket, s3_key)


def read_s3_file(bucket: str, s3_key: str):
    """
    Reads a text file from an S3 bucket and returns its content as a string.

    Parameters:
    - bucket: The name of the S3 bucket
    - s3_key: The full path (key) of the file in the bucket

    Returns:
    - str - Contents of the file
    """
    s3 = boto3.client('s3')
    response = s3.get_object(Bucket=bucket, Key=s3_key)
    content = response['Body'].read().decode('utf-8')
    return content


if __name__ == "__main__":
    upload_directory_to_s3("./frontend/src/docs", "cseassessment", "exams")
    upload_directory_to_s3("./backend/archive/solutions/",
                           "cseassessment", "solutions")
    # bucket = 'cseassessment'
    # key = 'exams/M11.json'

    # file_content = read_s3_file(bucket, key)
    # print(json.loads(file_content))
