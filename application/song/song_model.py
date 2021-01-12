# coding=utf-8

"""
This is an example script.

It seems that it has to have THIS docstring with a summary line, a blank line
and sume more text like here. Wow.
"""

from elasticsearch import Elasticsearch, RequestsHttpConnection
from flask import current_app as app
from requests_aws4auth import AWS4Auth
import json
import boto3
from botocore.exceptions import ClientError
from retry import retry
from botocore.client import Config


# @task(remote_aws_lambda_function_name='sqs-message', remote_aws_region='us-east-1')
@retry(tries=6, delay=0, max_delay=None)
def sqs_processing_post(user_id, song_id, song_object):
    sqs = boto3.client(
        'sqs',
        aws_access_key_id=app.aws_client,
        aws_secret_access_key=app.aws_secret,
        endpoint_url='', 
        config=Config(connect_timeout=600, read_timeout=840, retries={'total_max_attempts': 1})
    )

    try:
        msg = sqs.send_message(
            QueueUrl='', 
            MessageAttributes={
                'user_id': {
                    'DataType': 'String',
                    'StringValue': user_id
                },
                'song_id': {
                    'DataType': 'String',
                    'StringValue': song_id
                }
            },
            MessageBody=json.dumps(song_object),
            MessageGroupId=song_id
        )
    except ClientError as e:
        print(e)
        return None

    return True


def add_search_data(song_id, song_object):
    song_object.pop('_id')

    host = app.aws_es_url
    region = app.aws_region_name
    awsauth = AWS4Auth(app.aws_client, app.aws_secret, region, 'es')

    es = Elasticsearch(
        hosts=[{'host': host, 'port': 443}],
        http_auth=awsauth,
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection
    )

    es.index(index="songs", doc_type="_doc", id=song_id, body=json.dumps(song_object))


def reindex_search():
    host = app.aws_es_url
    region = app.aws_region_name
    awsauth = AWS4Auth(app.aws_client, app.aws_secret, region, 'es')
    es = Elasticsearch(
        hosts=[{'host': host, 'port': 443}],
        http_auth=awsauth,
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection
    )

    # clear out the index
    es.indices.delete(index='songs', ignore=[400, 404])

    # get all of the songs
    songs = app.db.Songs.find({'verified': 1}, {'_id': False})
    for song in songs:
        file_preview = song['song_id'] + '-' + song['song_title'] + '.mp3'

        s3 = boto3.client('s3',
                    aws_access_key_id=app.aws_client,
                    aws_secret_access_key=app.aws_secret,
                    region_name=app.aws_region_name,
                    config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4')
                    )

        preview_url = s3.generate_presigned_url('get_object',
            Params={
                'Bucket': app.aws_s3_song_preview,
                'Key': file_preview,
                },
                ExpiresIn=604800)
        song['file_preview_loc'] = preview_url

        # add all the songs to the index
        es.index(index="songs", doc_type="_doc", id=song['song_id'], body=json.dumps(song))


"""Also known as the reaper"""
def verify_songs():
    songs_in_db = []
    key = []
    s_verify = []
    pending = []
    # find all of the songs
    songs = app.db.Songs.find({}, {'file_locationopen': 1, '_id': False})
    for song in songs:
        songs_in_db.append(song['file_locationopen'].replace('https://' + app.aws_s3_song_wav + '.s3.amazonaws.com/', ''))

    s3 = boto3.client('s3',
        aws_access_key_id=app.aws_client,
        aws_secret_access_key=app.aws_secret,
        region_name=app.aws_region_name,
        config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4'))

    kwargs = {'Bucket': app.aws_s3_song_wav}
    resp = s3.list_objects_v2(**kwargs)

    for x in resp:
        try:
            contents = resp['Contents']
        except KeyError:
            return False

    for obj in contents:
        key.append(obj['Key'])

    to_remove = set(songs_in_db) - set(key)
    for x in to_remove:
        song_id = x.rsplit('-', 1)[0]
        app.db.Songs.update_one({"song_id": song_id, }, {"$set": {'verified': 0}})

    song_to_process = app.db.Songs.find({}, {'_id': False})

    for s in song_to_process:
        verified = s.get('verified')
        song_id = s.get('song_id')
        user_id = s.get('user_id')

        if verified == 2:
            if song_id not in key:
                app.db.Songs.update_one({"song_id": song_id, }, {"$set": {'verified': 1}})
                sqs_processing_post(user_id, song_id, s)
                add_search_data(song_id, s)
