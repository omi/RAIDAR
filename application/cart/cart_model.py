# coding=utf-8

"""
This is an example script.

It seems that it has to have THIS docstring with a summary line, a blank line
and sume more text like here. Wow.
"""
import requests
import time
import datetime
import json
import paypalrestsdk
from flask import current_app as app
from paypalrestsdk import Payout, ResourceNotFound

order_status = { 'COMPLETED': '0', 'CREATED': '1', 'SAVED': '1', 'APPROVED': '1', 'PAYER_ACTION_REQUIRED': '1', 'VOIDED': '2' }


def paypal_authenticate():
	paypal_endpoint = app.paypal_endpoint + '/v1/oauth2/token'

	d = {"grant_type" : "client_credentials"}
	h = {"Accept": "application/json", "Accept-Language": "en_US"}

	r = requests.post(paypal_endpoint, auth=(app.paypal_username, app.paypal_password), headers=h, data=d).json()
	access_token = r['access_token']

	return access_token


def get_paypal_transaction_status(pp_transaction_id):
	response = get_order_details(pp_transaction_id)

	if response.status_code == 200:
		return order_status[json.loads(response.content.decode('utf-8'))['status']]
	else:
		return 'Error'


def paypal_payout(song_id, pp_transaction_id):
	# Look up transaction info
	response = get_order_details(pp_transaction_id)
	if response.status_code != 200:
		return 'Error'

	transaction = json.loads(response.content.decode('utf-8'))
	if transaction.status != "COMPLETED":
		return

	amount = transaction['purchase_units'][0]['amount']['value']

	# Payout
	ts = time.time()
	timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y%m%d%H%M%S')
	sender_batch_id = 'Payouts_' + timestamp

	song = app.db.Songs.find_one({'song_id': song_id}, {'_id': False})
	song_title = song.song_title

	if len(song.performer_known_as) > 0:
		song_artist = song.performer_known_as
	else:
		song_artist = song.song_writer

	user_to_pay = app.db.User.find_one({ 'user_id': song.user_id }, {'_id': False})
	email_address = user_to_pay.email

	paypalrestsdk.configure({
	        "mode": app.paypal_mode, # sandbox or live
	        "client_id": app.paypal_username,
	        "client_secret": app.paypal_password
	})

	payout = Payout({
		"sender_batch_header": {
			"sender_batch_id": sender_batch_id,
			"email_subject": "Someone purchased your song on RAIDAR!",
			"email_message": "Someone purchased a license to your song '" + song_title + "' by '" + song_artist + "' through the RAIDAR app. You can claim your payout through the link in this email. If you do not have a PayPal account associated with this email address, you will be prompted to create one. Thanks for using RAIDAR!"
			},
			"items": [
				{
				  "recipient_type": "EMAIL",
				  "amount": {
				    "value": amount,
				    "currency": "USD"
				  },
				  "receiver": email_address,
				  "note": "Thanks for using RAIDAR!",
				  "sender_item_id": song_id + '_' + timestamp,
				}
			]
	})

	if payout.create(sync_mode=False):
		# print("payout[%s] created successfully" %
		# (payout.batch_header.payout_batch_id))
		return payout.batch_header.payout_batch_id
	else:
		return payout.error

def get_order_details(pp_transaction_id)
	access_token = paypal_authenticate()
	order_url = app.paypal_endpoint + "/v2/checkout/orders/" + pp_transaction_id
	headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer {0}'.format(access_token)}
	api_call = '{0}'.format(order_url)
	return requests.get(api_call, headers=headers)
