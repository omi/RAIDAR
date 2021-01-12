"""
Reaper is a simple tool to clean up the database on a nightly basis.

"""

import boto3
from botocore.client import Config
import pymongo
import ssl
import logging


db_url = ''
client = pymongo.MongoClient(db_url, ssl_cert_reqs=ssl.CERT_NONE, maxPoolSize=None)
db = client.get_default_database()
aws_region_name = 'us-east-1'
aws_s3_song_wav = ''
aws_client = ''
aws_secret = ''
songs_in_db = []
key = []

logging.basicConfig(filename='reaper.log', filemode='a', format='%(asctime)s - %(levelname)s - %(message)s', level=logging.INFO)
logging.info('begin reaper process')

songs = db.Songs.find({}, {'file_locationopen': 1, '_id': False})

for song in songs:
    songs_in_db.append(song['file_locationopen'].replace('https://' + aws_s3_song_wav + '.s3.amazonaws.com/',''))

logging.info('songs in the db ' + str(len(songs_in_db)))

s3 = boto3.client('s3',
    aws_access_key_id=aws_client,
    aws_secret_access_key=aws_secret,
    region_name=aws_region_name,
    config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4'))

kwargs = {'Bucket': aws_s3_song_wav}

resp = s3.list_objects_v2(**kwargs)

for x in resp:
    try:
        contents = resp['Contents']
    except KeyError:
        logging.error('could not get contents from s3')

for obj in contents:
    key.append(obj['Key'])

logging.info('songs in s3 ' + str(len(key)))


to_remove = set(songs_in_db) - set(key)
logging.info('songs songs to remove ' + str(len(to_remove)))


for x in to_remove:
    song_id = x.rsplit('-', 1)[0]
    logging.info('updating song to not display ' + song_id)
    # db.Songs.remove({'song_id': song_id}, {'just_one': True})
    db.Songs.update_one({"song_id": song_id, }, {"$set": {'verified': 0}})

logging.info('end reaper process')
