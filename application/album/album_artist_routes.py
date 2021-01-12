from flask import Blueprint, request, jsonify
from flask import current_app as app
from flask_pymongo import PyMongo
import pymongo, ssl, sys, json
from bson.json_util import dumps
import uuid


albums_artist_bp = Blueprint('album_artist', __name__)

@albums_artist_bp.route('/artists/<album_id>')
def find_artists_by_album_id(album_id):
	results = []

	artists = app.db.AlbumArtists.find({"album_id": album_id},{'_id': False})

	for artist in artists:
		results.append(artist)

	return jsonify(results), 200