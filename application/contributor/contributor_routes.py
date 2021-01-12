from flask import Blueprint, request, jsonify
from flask import current_app as app
from flask_pymongo import PyMongo
import pymongo, ssl, sys, json
from bson.json_util import dumps
import uuid

# Set up a Blueprint
contributors_bp = Blueprint('contributor', __name__)

@contributors_bp.route('/contributors', methods=['GET'])
def find_contributors():
	results = []

	cont = app.db.Contributors.find({},{'_id': False})

	for contributor in cont:
		results.append(contributor)

	return jsonify(results), 200

@contributors_bp.route('/contributor/<contributor_id>', methods=['GET'])
def find_contributor(contributor_id):
    results = []
    contributor = app.db.Contributors.find_one({'contrib_id': contributor_id},{'_id': False})
    results.append(contributor)
    return jsonify(results), 200

@contributors_bp.route('/contributor', methods=['POST'])
def create_contributor():
    data = request.get_json(force=True)

    contributor_name = data.get('name')
    contributor_id = str(uuid.uuid1())
    
    result = app.db.Contributors.insert({"contrib_id" : contributor_id, "contrib_name" : contributor_name})
    
    return contributor_id, 200