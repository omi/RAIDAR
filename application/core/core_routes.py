from flask import Blueprint, request, jsonify
from flask import current_app as app
from flask_pymongo import PyMongo
import pymongo, ssl, sys, json, os, uuid, time, datetime
from bson.json_util import dumps
import uuid
from application.core.model import send_email


# Set up a Blueprint
core_bp = Blueprint('core', __name__)


@core_bp.route('/login', methods=['OPTIONS', 'POST'])
def login():
	user_id = ''
	role_id = ''
	approved_email_domains = ["berklee.edu", "gmail.com", "intrinsic-ai.com", "alumni.berklee.edu", "sheknows.tech", "tonestone.net"]

	data = request.get_json(force=True)

	email_address = data.get('email')
	first_name = data.get('first_name')
	last_name = data.get('last_name')
	tos = data.get('tos')
    # validate that the email is allowed
	if email_address.split('@')[1] not in approved_email_domains:
		return jsonify("{ message: 'User Not Found' }"), 401
	
    # check if the user exists based on email
	find_user = app.db.Users.find_one({'email': email_address})

	if not find_user:
		user_id = str(uuid.uuid1())
		if not role_id or role_id == "":
			role_id = "5e9624ddf357feff7fd2b446"

		user = app.db.Users.insert({"user_id" : user_id, "user_role_id" : role_id, "email" : email_address, "foreign_client_id" : "", "first_name": first_name, "last_name": last_name, "tos": tos})
		results = {
			'user_id': user_id,
			'first_time_login': True,
			'tos_agreed': True,
			'has_stripe': False
		}
		return jsonify(results), 200
	else:
		results = {
			'user_id': find_user['user_id'],
			'first_time_login': False,
			'tos_agreed': True,
			'has_stripe': False
		}
		
		return jsonify(results), 200

	return user_id, 200


@core_bp.route('/status', methods=['GET'])
def status():
	return True


@core_bp.route('/register', methods=['POST'])
def register_user():
	data = request.get_json(force=True)
	user_type = data.get('user_type')
	email_address = data.get('email')
	first_name = data.get('first_name')
	last_name = data.get('last_name')
	tos = data.get('tos')

	user_id = str(uuid.uuid1())
	role_id = "5e9624ddf357feff7fd2b446"

	register_user = app.db.Users.insert({"user_id": user_id, "user_type": user_type, "user_role_id": role_id, "email": email_address, "foreign_client_id": "", "first_name": first_name, "last_name": last_name, "tos": tos})

	results = {
		'user_id': user_id,
		'first_time_login': True,
		'tos': tos,
	}

	return jsonify(results), 200


@core_bp.route('/interested_user', methods=['POST'])
def interested_user():
	data = request.get_json(force=True)
	email_address = data.get('email')
	affiliation = data.get('affiliation')
	role = data.get('role')
	omi_member = data.get('omi_member')
	intent = data.get('intent')

	if omi_member:
		is_omi_member = 'Yes'
	else:
		is_omi_member = 'No'

	subject = 'A new user is interested in accessing RAIDAR'
	message = '''\
Email: {email_address}<br>
School/Company: {affiliation}<br>
Role at School/Company: {role}<br>
OMI Member? {is_omi_member}<br>
Purpose for Using RAIDAR: {intent}\
'''.format(email_address=email_address, affiliation=affiliation, role=role, is_omi_member=is_omi_member, intent=intent)

	send_email(app.interested_user_email_list, subject, message)

	results = {
		'message': 'message has been sent',
	}

	return jsonify(results), 200


@core_bp.route('/email_purchase_notify', methods=['POST'])
def email_purchase_notify():
	data = request.get_json(force=True)
	email_address = data.get('email')
	first_name = data.get('first_name')
	song_title = data.get('song_title')
	artist_name = data.get('artist_name')

	subject = 'Someone purhcased your song on RAIDAR!'
	message = '''\
Hello {first_name},<br><br>

Someone purchased a license to your song <b>{song_title}</b> by <b>{artist_name}</b> through the <a href='https://www.raidar.org'>RAIDAR</a> app. You will receive your payment soon, so watch out for an email from PayPal.
<br><br>
Note: If you do not have a PayPal account associated with this email address, you will be prompted to create one.
<br><br>
Thanks for using the RAIDAR app!\
	'''.format(first_name=first_name, song_title=song_title, artist_name=artist_name)

	send_email(email_address, subject, message)
	results = {
		'message': 'message has been sent',
	}

	return jsonify(results), 200
