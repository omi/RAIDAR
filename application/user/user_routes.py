from flask import Blueprint, request, jsonify
from flask import current_app as app
from botocore.client import Config
import uuid
import time
import datetime
import csv
import boto3
import json
import re

# Set up a Blueprint
users_bp = Blueprint('user', __name__)


@users_bp.route('/users', methods=['GET'])
def users():
    results = []

    users = app.db.Users.find({}, {'_id': False})
    for user in users:
        results.append(user)
    return jsonify(results), 200


@users_bp.route('/user/<user_id>', methods=['GET'])
def user(user_id):
    results = []
    user = app.db.Users.find_one({'user_id': user_id}, {'_id': False})
    results.append(user)
    return jsonify(results), 200


@users_bp.route('/user', methods=['POST'])
def user_create():
    data = request.get_json(force=True)

    email_address = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    role_id = data.get('role_id')

    if not role_id or role_id == "":
        role_id = "5e9624ddf357feff7fd2b446"
    user_id = str(uuid.uuid1())
    result = app.db.Users.insert({"user_id": user_id, "user_role_id": role_id, "email": email_address, "foreign_client_id": "", "first_name": first_name, "last_name": last_name})
    return user_id, 200


@users_bp.route('/my_songs/<user_id>', methods=['GET'])
def get_my_songs(user_id):
    results = []
    user_song = []

    user_purchases = app.db.UserPurchases.find({"user_id": user_id}, {'_id': False})

    s3 = boto3.client('s3',
                aws_access_key_id=app.aws_client,
                aws_secret_access_key=app.aws_secret,
                region_name=app.aws_region_name,
                config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4')
                )

    for song in user_purchases:
        user_songs = app.db.Songs.find({'song_id': song['song_id']}, {'_id': False})
        for user_song in user_songs:
            file_preview = user_song['song_id'] + '-' + user_song['song_title'] + '.mp3'
            s3_preview_bucket = app.aws_s3_song_preview

            preview_url = s3.generate_presigned_url('get_object',
                Params={
                    'Bucket': s3_preview_bucket,
                    'Key': file_preview,
                    },
                    ExpiresIn=604800)
            user_song['file_preview_loc'] = preview_url

            temp = user_song.copy()
            temp.update(song)
            results.append(temp)
    return jsonify(results), 200


@users_bp.route('/my_purchases', methods=['POST'])
def purchases():
    data = request.get_json(force=True)
    ts = time.time()
    timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

    songs = data.get('songs')
    user_id = data.get('user_id')
    active = "1"

    for song in songs:
        app.db.UserPurchases.insert({"song_id": song, "user_id": user_id, "active": active, "ts": timestamp})

    return jsonify('{"success": True }'), 200


@users_bp.route('/my_paypal_transactions/<user_id>', methods=['GET'])
def my_paypal_transactions(user_id):
    results = []
    paypal_transactions = app.db.UserPurchases.find({'user_id': user_id}, {'_id': False})

    for p in paypal_transactions:
        results.append(p)

    return jsonify(results), 200


@users_bp.route('/gdpr/<user_id>/<expunge>', methods=['GET'])
def get_gdpr_for_user(user_id, expunge):

    response = ''
    user_info = list(app.db.Users.find({'user_id': user_id}, {'_id': False}))
    print(json.dumps(user_info))
    user_purchases = app.db.UserPurchases.find({'user_id': user_id}, {'_id': False})
    user_songs = app.db.Songs.find({'user_id': user_id}, {'_id': False})
    file_name = "/tmp/" + user_id + ".csv"
    data_file = open(file_name, 'w')
    csv_writer = csv.writer(data_file)

    for user in user_info:
        csv_writer.writerow(user.values())

    for user_p in user_purchases:
        csv_writer.writerow(user_p.values())

    for user_s in user_songs:
        csv_writer.writerow(user_s.values())

    data_file.close()

    bucket = app.aws_s3_gdpr
    s3 = boto3.client('s3',
        aws_access_key_id=app.aws_client,
        aws_secret_access_key=app.aws_secret,
        region_name=app.aws_region_name,
        config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4')
    )

    s3.upload_file(file_name, bucket, file_name)

    if expunge == "0":
        response = {
            "success": True
        }
    elif expunge == "1":
        # need to delete
        response = {
            "message": "deleted"
        }

    return jsonify(response), 200


@users_bp.route('/my_song_transactions/<user_id>', methods=['GET'])
def get_my_song_transactions(user_id):

    results = []
    user_songs = app.db.Songs.find({'user_id': user_id}, {'_id': False})

    for songs in user_songs:
        song_trans = app.db.UserPurchases.find({'song_id': songs['song_id']}, {'_id': False})
        for trans in song_trans:
            temp = trans.copy()
            temp.update(songs)
            results.append(temp)

    return jsonify(results), 200