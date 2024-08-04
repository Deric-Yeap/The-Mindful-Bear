from datetime import datetime
import logging
import random
import string
import boto3
from botocore.exceptions import ClientError
import os

def upload_fileobj(fileobj, bucket, object_path=None):
    if object_path is None:
        object_path = fileobj.name

    s3_client = boto3.client('s3',
                            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
                            region_name=os.getenv('AWS_S3_REGION_NAME')
                            )
    try:
        s3_client.upload_fileobj(fileobj, bucket, object_path)
    except ClientError as e:
        logging.error(e)
        return False
    return True

def make_file_upload_path(user, filename):
    random_string = ''.join(random.choices(string.ascii_letters, k=8))
    new_filename = f'{random_string}_{filename}'
    today_date = datetime.now().strftime('%Y_%m_%d')
    path = f'journals/{user.user_id}/{today_date}/{new_filename}'
    return (new_filename, path)

def create_presigned_url(bucket_name, object_path, expiration=10):
    s3_client = boto3.client('s3',
                            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
                            region_name=os.getenv('AWS_S3_REGION_NAME')
                            )
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_path},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        raise e
    return response