from flask import Blueprint, request, jsonify
from flask import current_app as app
from flask_pymongo import PyMongo
import pymongo, ssl, sys, json
from bson.json_util import dumps
import uuid

user_roles_bp = Blueprint('user_roles', __name__)

@user_roles_bp.route('/roles', methods=['GET'])
def roles():
	results = []
	roles = app.db.UserRoles.find({},{'_id': False})

	for role in roles:
		results.append(role)

	return jsonify(results), 200

@user_roles_bp.route('/role/<role_id>', methods=['GET'])
def role(role_id):
	results = []
	role = app.db.UserRoles.find_one({'role_id': role_id},{'_id': False})
	results.append(role)
	return jsonify(results), 200

@user_roles_bp.route('/role', methods=['POST'])
def create_role(role_id):
	data = request.get_json(force=True)

	role_name = data.get('role_name')
	role_id = str(uuid.uuid1())


	result = app.db.UserRoles.insert({"role_id": role_id, "role_name": role_name})
	
	return role_id, 200
