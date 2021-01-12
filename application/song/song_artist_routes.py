from flask import Blueprint, request, jsonify
from flask import current_app as app
from flask_pymongo import PyMongo
import pymongo, ssl, sys, json, os, uuid, time, datetime
from bson.json_util import dumps
import uuid

# Set up a Blueprint
songs_artists_bp = Blueprint('song_artist', __name__)

@songs_artists_bp.route('/song_artist/<song_id>')
def get_song_by_artist(song_id):
	results = []

	artists = app.db.SongArtists.find({"song_id": song_id},{'_id': False})

	for artist in artists:
		results.append(artist)

	return jsonify(results), 200	