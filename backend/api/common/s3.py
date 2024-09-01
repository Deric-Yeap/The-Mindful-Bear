import datetime
import logging
import random
import string
import boto3
from botocore.exceptions import ClientError
import os
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from botocore.signers import CloudFrontSigner
from django.conf import settings

def upload_fileobj(fileobj, bucket, object_path=None):
    if object_path is None:
        object_path = fileobj.name

    s3_client = boto3.client('s3',
                            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                            region_name=settings.AWS_S3_REGION_NAME,
               
                            )
    try:
        s3_client.upload_fileobj(fileobj, 
                                 bucket, 
                                 object_path,                             
                                 ExtraArgs={
                                    "ContentType": "image/png"
                                    }     
                                )
    except ClientError as e:
        logging.error(e)
        return False
    return True

def delete_s3_object(bucket, object_path):
    s3_client = boto3.client('s3',
                            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                            region_name=settings.AWS_S3_REGION_NAME
                            )
    try:
        s3_client.delete_object(Bucket=bucket, Key=object_path)
    except ClientError as e:
        raise Exception(f"Error deleting object from S3. {e}")

def make_file_upload_path(folder, user, filename):
    random_string = ''.join(random.choices(string.ascii_letters, k=8))
    new_filename = f'{random_string}_{filename}'
    today_date = datetime.datetime.now().strftime('%Y_%m_%d')
    path = f'{folder}/{user.user_id}/{today_date}/{new_filename}'
    return (new_filename, path)

def create_presigned_url(object_path, expiration_days=1):
    try:
        key_id = settings.CLOUDFRONT_KEY_ID
        url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{object_path}"
        cloudfront_signer = CloudFrontSigner(key_id, rsa_signer)
        current_time = datetime.datetime.now()
        expire_date = current_time + datetime.timedelta(days=expiration_days)
        signed_url = cloudfront_signer.generate_presigned_url(
            url, date_less_than=expire_date)
    except Exception as e:
        raise Exception(f"Error creating presigned URL. {e}")
    return signed_url


def rsa_signer(message):
    key_path = os.path.join(os.path.dirname(__file__), '../../../private_key.pem')
    with open(key_path, 'rb') as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None,
            backend=default_backend()
        )
    return private_key.sign(message, padding.PKCS1v15(), hashes.SHA1())