from flask import Blueprint, request, jsonify
from flask import current_app as app
import uuid
import time
import datetime
import boto3
from flask import current_app as app
import application.cart.cart_model as cart_model
from application.cart.cart_model import get_paypal_transaction_status
from application.cart.cart_model import paypal_payout
from application.core import email_purchase_notify
# Set up a Blueprint
cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/transactions', methods=['POST'])
def create_transactions():

	ts = time.time()
	timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y%m%d%H%M%S')

	data = request.get_json(force=True)
	songs = data.get('song_ids')
	purchaser = data.get('user_id')
	paypal_transaction_id = data.get('transaction_id')
    amount = app.song_price

    # Set price to $1 for production test user
    if purchaser == "e5f95268-f623-11ea-89a3-4a32d95acf41":
        amount = "1.00"

	song_ids = songs.split(',')
	for song_id in song_ids:
		app.db.UserPurchases.insert({"song_id": song_id, "user_id": purchaser, "amount": amount, "paypal_transaction_id": paypal_transaction_id, "active": "1", "ts": timestamp})

    email_purchase_notify

	results = {
		"success": True
	}

	return jsonify(results), 200


@cart_bp.route('/payouts', methods=['POST'])
def get_payouts():
	key = []
	
	order_status = {'COMPLETED': '0', 'CREATED': '1', 'SAVED': '1', 'APPROVED': '1', 'PAYER_ACTION_REQUIRED': '1', 'VOIDED': '2'}

	incomplete_transactions = app.db.UserPurchases.find({'active': '1'}, {'_id': False})

	for t in incomplete_transactions:
		ppti = t.paypal_transaction_id
		status = get_paypal_transaction_status(ppti)

		if status != t.active:
			app.db.UserPurchases.update_one({"paypal_transaction_id": ppti}, {"$set": {'active': status}})
			
			if status == "0":
				paypal_payout(t.song_id, ppti)

	results = {
		"success": True
	}

	return jsonify(results), 200
