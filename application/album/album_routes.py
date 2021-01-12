from flask import Blueprint, request, jsonify
from flask import current_app as app
from flask_pymongo import PyMongo
import pymongo, ssl, sys, json
from bson.json_util import dumps
import uuid

# Set up a Blueprint
albums_bp = Blueprint('album', __name__)

@albums_bp.route('/albums', methods=['GET'])
def albums():
    results = []

    albums = app.db.Albums.find({},{'_id': False})
    
    for album in albums:
        results.append(album)
    
    return jsonify(results), 200

@albums_bp.route('/album/<album_id>', methods=['GET'])
def album(album_id):
    results = []
    album = app.db.Albums.find_one({'album_id': album_id},{'_id': False})
    results.append(album)
    return jsonify(results), 200    

@albums_bp.route('/album', methods=['POST'])
def album_create():
    data = request.get_json(force=True)

    album_title = data.get('album_title')
    artwork_loc = data.get('artwork_loc')
    
    album_id = str(uuid.uuid1())
    
    result = app.db.Albums.insert({"album_id" : album_id, "artwork_loc" : artwork_loc, "album_title" : album_title})
    
    return album_id, 200