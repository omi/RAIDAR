# coding=utf-8

"""
This is an example script.

It seems that it has to have THIS docstring with a summary line, a blank line
and sume more text like here. Wow.
"""

from flask import Blueprint, request, jsonify
from flask import current_app as app
import uuid
import time
import datetime
import boto3

import json
from botocore.client import Config
from application.song.song_model import sqs_processing_post
from application.song.song_model import add_search_data
from application.song.song_model import reindex_search
from application.song.song_model import verify_songs
from bson import json_util
import re

# Set up a Blueprint
songs_bp = Blueprint('song', __name__)


@songs_bp.route('/songs', methods=['GET'])
def songs():
	results = []
	songs = app.db.Songs.find({'verified': {"$in": [1, 2]}}, {'_id': False})

	for song in songs:
		file_preview = song['song_id'] + '-' + song['song_title'] + '.mp3'

		s3 = boto3.client('s3',
					aws_access_key_id=app.aws_client,
	                aws_secret_access_key=app.aws_secret,
	                region_name=app.aws_region_name,
	                config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4')
	                )
		s3_preview_bucket = app.aws_s3_song_preview

		preview_url = s3.generate_presigned_url('get_object',
			Params={
				'Bucket': s3_preview_bucket,
				'Key': file_preview,
				},
				ExpiresIn=604800)
		song['file_preview_loc'] = preview_url
		results.append(song)
	return jsonify(results), 200


@songs_bp.route('/song/<song_id>', methods=['GET', 'PUT'])
def song(song_id):

	if request.method == "GET":
		results = []

		song = app.db.Songs.find_one({'song_id': song_id}, {'_id': False})

		file_preview = song['song_id'] + '-' + song['song_title'] + '.mp3'
		

		s3 = boto3.client('s3',
					aws_access_key_id=app.aws_client,
	                aws_secret_access_key=app.aws_secret,
	                region_name=app.aws_region_name,
	                config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4')
	                )
		s3_preview_bucket = app.aws_s3_song_preview

		preview_url = s3.generate_presigned_url('get_object',
			Params={
				'Bucket': s3_preview_bucket,
				'Key': file_preview,
				},
				ExpiresIn=604800)

		song['file_preview_loc'] = preview_url
		
		results.append(song)

		return jsonify(results), 200
	if request.method == "PUT":

		ts = time.time()
		data = request.get_json(force=True)

		timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
		album_id = data.get('album_id')
		song_title = data.get('song_title')
		length = data.get('song_length')
		genre = data.get('genre')
		mood = data.get('mood')
		tags = data.get('tags')
		bpm = data.get('bpm')
		has_vocals = data.get('has_vocals')
		vocal_langs = data.get('vocal_langs')
		musical_key = data.get('musical_key')
		# price = data.get('price')
		license_terms = data.get('license_terms')
		file_locationopen = ''
		recording_date = data.get('recording_date')
		recording_country = data.get('recording_country')
		recording_location = data.get('recording_location')
		recording_frmt = data.get('recording_frmt')
		art_loc = data.get('art_loc')
		file_preview_loc = data.get('file_preview_loc')
		# currency = data.get('currency')
		song_writer = data.get('song_writer')
		recording_engineer = data.get('recording_engineer')
		mixing_engineer = data.get('mixing_engineer')
		mastering_engineer = data.get('mastering_engineer')
		song_producer = data.get('song_producer')
		performer_known_as = data.get('performer_known_as')

		song_object = {
	    	'song_id': song_id,
			'ts': timestamp,
			'album_id': album_id,
			'song_title': song_title,
			'length': length,
			'genre': genre,
			'mood': mood,
			'tags': tags,
			'bpm': bpm,
			'has_vocals': has_vocals,
			'vocal_langs': vocal_langs,
			'musical_key': musical_key,
			'price': '50.00',
			'license_terms': license_terms,
			'recording_date': recording_date,
			'recording_country': recording_country,
			'recording_location': recording_location,
			'recording_frmt': recording_frmt,
			'art_loc': art_loc,			
			'currency': 'USD',
			'song_writer': song_writer,
			'recording_engineer': recording_engineer,
			'mixing_engineer': mixing_engineer,
			'mastering_engineer': mastering_engineer,
			'song_producer': song_producer,
			'performer_known_as': performer_known_as
		}

	result = app.db.Songs.update_one(
			{"song_id": song_id, },
			{"$set": song_object}
		)

	response = {
			"message": "Song updated successfully"
		}

	return jsonify(response), 200


@songs_bp.route('/song/<desc>/<desc_value>', methods=['GET'])
def search_songs(desc, desc_value):
	results = []
	if desc == 'bpm':
		int(desc_value)
	else:
		str(desc_value)

	songs = app.db.Songs.find({desc: desc_value})


	for song in songs:
		results.append(song)

	return jsonify(results), 200


@songs_bp.route('/song', methods=['POST'])
def create_song():

	s3 = boto3.client('s3',
			aws_access_key_id=app.aws_client,
	        aws_secret_access_key=app.aws_secret,
	        region_name=app.aws_region_name,
	        config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4',connect_timeout=5, retries={'max_attempts': 0})
	        )
	s3_bucket = app.aws_s3_song_wav
	data = request.get_json(force=True)
	ts = time.time()

	song_id = str(uuid.uuid1())
	user_id = data.get('user_id')
	timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
	album_id = data.get('album_id')
	song_title = data.get('song_title')
	length = data.get('song_length')
	genre = data.get('genre')
	mood = data.get('mood')
	tags = data.get('tags')
	bpm = data.get('bpm')
	has_vocals = data.get('has_vocals')
	vocal_langs = data.get('vocal_langs')
	musical_key = data.get('musical_key')
	# price = data.get('price')
	license_terms = data.get('license_terms')
	file_locationopen = ''
	recording_date = data.get('recording_date')
	recording_country = data.get('recording_country')
	recording_location = data.get('recording_location')
	recording_frmt = data.get('recording_frmt')
	art_loc = data.get('art_loc')
	file_preview_loc = data.get('file_preview_loc')
	# currency = data.get('currency')
	song_writer = data.get('song_writer')
	recording_engineer = data.get('recording_engineer')
	mixing_engineer = data.get('mixing_engineer')
	mastering_engineer = data.get('mastering_engineer')
	song_producer = data.get('song_producer')
	performer_known_as = data.get('performer_known_as')

	file_locationopen = song_id + '-' + re.sub('[^a-zA-Z.\d\s]', '',song_title) + '.wav'

	file_preview = song_id + '-' + re.sub('[^a-zA-Z.\d\s]', '',song_title) + '.mp3'

	s3_preview_bucket = app.aws_s3_song_preview
	s3_wav_url = "https://" + app.aws_s3_song_wav + ".s3.amazonaws.com/"
	preview_url = s3.generate_presigned_url('get_object',
		Params={
			'Bucket': s3_preview_bucket,
			'Key': file_preview,
			},
			ExpiresIn=604800)

	song_object = {
    	'song_id': song_id,
		'user_id': user_id,
		'ts': timestamp,
		'album_id': album_id,
		'song_title': song_title,
		'length': length,
		'genre': genre,
		'mood': mood,
		'tags': tags,
		'bpm': bpm,
		'has_vocals': has_vocals,
		'vocal_langs': vocal_langs,
		'musical_key': musical_key,
		'price': '50.00',
		'license_terms': license_terms,
		'file_locationopen': s3_wav_url + file_locationopen, #.replace(' ', '+'),
		'recording_date': recording_date,
		'recording_country': recording_country,
		'recording_location': recording_location,
		'recording_frmt': recording_frmt,
		'art_loc': art_loc,
		'file_preview_loc': preview_url,
		'currency': 'USD',
		'song_writer': song_writer,
		'recording_engineer': recording_engineer,
		'mixing_engineer': mixing_engineer,
		'mastering_engineer': mastering_engineer,
		'song_producer': song_producer,
		'performer_known_as': performer_known_as,
		'license_version': app.aws_s3_license_version,
		'verified': 2
    }
	result = app.db.Songs.insert(song_object)

	upload_key = uuid.uuid4().hex

	presigned_url = s3.generate_presigned_url('put_object', Params={'Bucket': s3_bucket, 'Key':file_locationopen}, ExpiresIn=3600, HttpMethod='PUT')

	results = {
		"upload_url": presigned_url,
		"song_id": song_id
	}
	
	sanitized_song = json.loads(json_util.dumps(song_object))

	# sqs_processing_post(user_id, song_id, sanitized_song)
	# add_search_data(song_id, song_object)
	return jsonify(results), 200


@songs_bp.route('/song/upload', methods=['POST', 'PUT'])
def upload_song():
	file = ''
	file = request.files["song"]
	s3_bucket = app.aws_s3_song_wav

	output = upload_file_to_s3(file, s3_bucket)
	return str(output), 200


@songs_bp.route('/song/transaction', methods=['POST'])
def update_song_transaction():
	data = request.get_json(force=True)
	ts = time.time()
	timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

	song_id = data.get('song_id')
	tx_id = data.get('transaction')
	song_hash = data.get('song_hash')
	metadata_hash = data.get('metadata_hash')

	result = app.db.SongTransactions.insert({
		'song_id': song_id,
		'tx_id': tx_id,
		'song_hash': song_hash,
		'metadata_hash': metadata_hash,
		'ts': timestamp
	})

	return jsonify(song_id), 200


@songs_bp.route('/song/download_song/<song_id>', methods=['GET'])
def download_song(song_id):

	s3 = boto3.client('s3',
				aws_access_key_id=app.aws_client,
                aws_secret_access_key=app.aws_secret,
                region_name=app.aws_region_name,
                config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4',connect_timeout=5, retries={'max_attempts': 0})
                )
	s3_bucket = app.aws_s3_song_wav

	song = app.db.Songs.find_one({'song_id': song_id},{'_id': False})
	song_title = song['song_title'] + '.wav'

	url = s3.generate_presigned_url('get_object',
		Params={
			'Bucket': s3_bucket,
			'Key': song['file_locationopen'].replace('','').replace('+', ' '),
			'ResponseContentDisposition': 'attachment;filename="' + song_title + '"'
			},
			ExpiresIn=3600)

	results = {
		'download_url': url
	}
	return jsonify(results), 200


@songs_bp.route('/my_uploads/<user_id>', methods=['GET'])
def get_my_uploads(user_id):
	results = []
	songs = app.db.Songs.find({"user_id": user_id}, {'_id': False})

	for song in songs:
		results.append(song)
	return jsonify(results), 200


@songs_bp.route('/song_features/<song_id>', methods=['GET'])
def get_song_features(song_id):
	s3 = boto3.client('s3',
		aws_access_key_id=app.aws_client,
	    aws_secret_access_key=app.aws_secret,
	    region_name=app.aws_region_name,
	    config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4', connect_timeout=5, retries={'max_attempts': 0})
	    )
	s3_bucket = ''

	song = app.db.Songs.find_one({'song_id': song_id}, {'_id': False})
	song_title = song['song_title']

	song_features_name = song_id + '-' + song_title.replace('+', ' ') + '.json'
	song_url = song_features_name

	url = s3.generate_presigned_url('get_object',
		Params={
			'Bucket': s3_bucket,
			'Key': song_url,
			'ResponseContentDisposition': 'attachment;filename="' + song_title + '.json"'
			},
			ExpiresIn=3600)

	return jsonify(url), 200


@songs_bp.route('/latest_songs', methods=['GET'])
def get_lastest_songs():
	results = []
	songs = app.db.Songs.find({'verified': {"$in": [1, 2]}}, {'_id': False}).sort("song_id").limit(20)

	for song in songs:
		file_preview = song['song_id'] + '-' + song['song_title'] + '.mp3'

		s3 = boto3.client('s3',
					aws_access_key_id=app.aws_client,
	                aws_secret_access_key=app.aws_secret,
	                region_name=app.aws_region_name,
	                config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4')
	                )
		s3_preview_bucket = app.aws_s3_song_preview

		preview_url = s3.generate_presigned_url('get_object',
			Params={
				'Bucket': s3_preview_bucket,
				'Key': file_preview,
				},
				ExpiresIn=604800)
		song['file_preview_loc'] = preview_url
		results.append(song)
	return jsonify(results), 200


@songs_bp.route('/delete_song/<song_id>', methods=['DELETE'])
def delete_song(song_id):
	song = app.db.Songs.find_one({'song_id': song_id}, {'_id': False})
	file_locationopen = song['file_locationopen'].replace('', '').replace('+', ' ')

	app.db.Songs.remove({'song_id': song_id})

	s3 = boto3.client('s3',
				aws_access_key_id=app.aws_client,
	    		aws_secret_access_key=app.aws_secret,
	    		region_name=app.aws_region_name,
	    		config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4', connect_timeout=5, retries={'max_attempts': 0}))

	delete_wav = s3.delete_object(Bucket=app.aws_s3_song_wav, Key=file_locationopen)
	
	preview_url = file_locationopen.replace('.wav', '.mp3')
	delete_mp3 = s3.delete_object(Bucket=app.aws_s3_song_preview, Key=preview_url)

	file_features = file_locationopen.replace('.wav', '.json')
	delete_features = s3.delete_object(Bucket=app.aws_s3_metadata, Key=file_features)

	

	results = {
		"success": True
	}

	return jsonify(results), 200

@songs_bp.route('/download_license/<song_id>', methods=['GET'])
def download_license(song_id):
	# find the song
	# find the version of the license to downlaod
	# provide a download link

	s3 = boto3.client('s3',
				aws_access_key_id=app.aws_client,
                aws_secret_access_key=app.aws_secret,
                region_name=app.aws_region_name,
                config=Config(s3={'addressing_style': 'path'}, signature_version='s3v4', connect_timeout=5, retries={'max_attempts': 0})
                )

	song = app.db.Songs.find_one({'song_id': song_id}, {'_id': False})
	license_version = song['license_version']

	if license_version == '':
		license_version = app.aws_s3_license_version
		result = app.db.Songs.update_one(
			{"song_id": song_id, },
			{"$set": {'license_version': app.aws_s3_license_version}}
		)

	url = s3.generate_presigned_url('get_object',
		Params={
			'Bucket': app.aws_s3_documents,
			'Key': app.aws_s3_license_file.replace('', ''),
			'ResponseContentDisposition': 'attachment;filename="' + app.aws_s3_license_file + '"',
			'VersionId': license_version
			},
			ExpiresIn=3600)

	results = {
		'download_url': url
	}
	return jsonify(results), 200


@songs_bp.route('/reaper', methods=['POST'])
def reap_invalid_songs():
	verify_songs()

	results = {
		"success": True
	}

	return jsonify(results), 200

@songs_bp.route('/reindex', methods=['POST'])
def reindex_elasticsearch():
	reindex_search()

	results = {
		"success": True
	}

	return jsonify(results), 200
