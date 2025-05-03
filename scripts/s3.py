import os
import boto3

from dotenv import load_dotenv

load_dotenv()


def upload_directory_to_s3(directory_path, bucket_name, s3_prefix=""):
    """
    Uploads all files from a local directory to an AWS S3 bucket.

    Parameters:
    - directory_path: str - Local path to the directory
    - bucket_name: str - Name of the S3 bucket
    - s3_prefix: str - Optional prefix (folder path) in the S3 bucket
    """
    s3_client = boto3.client('s3')
    print(directory_path)
    for root, _, files in os.walk(directory_path):
        for file in files:
            print(file)
            local_path = os.path.join(root, file)
            relative_path = os.path.relpath(local_path, directory_path)
            s3_key = os.path.join(s3_prefix, relative_path).replace("\\", "/")

            print(f"Uploading {local_path} to s3://{bucket_name}/{s3_key}")
            s3_client.upload_file(local_path, bucket_name, s3_key)


def read_s3_file(bucket_name, s3_key):
    """
    Reads a text file from an S3 bucket and returns its content as a string.

    Parameters:
    - bucket_name: str - The name of the S3 bucket
    - s3_key: str - The full path (key) of the file in the bucket

    Returns:
    - str - Contents of the file
    """
    s3 = boto3.client('s3')
    response = s3.get_object(Bucket=bucket_name, Key=s3_key)
    content = response['Body'].read().decode('utf-8')
    return content


if __name__ == "__main__":
    print("Sometifoenfe..")
    upload_directory_to_s3("../frontend/src/docs", "cseassessment", "exams")
    # bucket = 'cseassessment'
    # key = 'exams/M11.json'

    # file_content = read_s3_file(bucket, key)
    # print(json.loads(file_content))
