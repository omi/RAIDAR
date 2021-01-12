"""App entry point."""
# from application import create_app
from application.core import core_routes
from application.user import user_routes, user_role_routes
from application.song import song_routes, song_artist_routes
from application.cart import cart_routes
from application.album import album_routes, album_artist_routes
from application.contributor import contributor_routes
from flask import Flask
from flask_cors import CORS
import pymongo
import ssl
import urllib.parse
from flask import request, jsonify


app = Flask(__name__)
CORS(app)


"""
Running locally you need this connection string
"""
# db_url = 'mongodb://user:password@127.0.0.1:27018/raidar'
# app.aws_client = ''
# app.aws_secret = ''
# app.aws_region_name = 'us-east-1'
# app.aws_s3_song_wav = ''
# app.aws_s3_song_preview = ''
# app.aws_es_url = ''
# app.aws_sqs_lambda_method = ''
# app.aws_sqs_lambda_region = ''
# app.aws_s3_metadata = ''
# app.aws_s3_license_file = ''
# app.aws_s3_license_version = ''
# app.aws_s3_documents = ''
# app.aws_smtp_username = ''
# app.aws_smtp_password = ''
# app.aws_ses_sender = ''
# app.interested_user_email_list = ''
# app.aws_ses_endpoint = ''
# app.song_price = ''
# app.paypal_mode = ''
# app.paypal_endpoint = ''
# app.paypal_username = ''
# app.paypal_password = ''

client = pymongo.MongoClient(db_url, ssl_cert_reqs=ssl.CERT_NONE, maxPoolSize=None)
app.db = client.get_default_database()

app.register_blueprint(user_routes.users_bp)
app.register_blueprint(user_role_routes.user_roles_bp)
app.register_blueprint(song_routes.songs_bp)
app.register_blueprint(song_artist_routes.songs_artists_bp)
app.register_blueprint(cart_routes.cart_bp)
app.register_blueprint(core_routes.core_bp)
app.register_blueprint(album_routes.albums_bp)
app.register_blueprint(album_artist_routes.albums_artist_bp)
app.register_blueprint(contributor_routes.contributors_bp)


@app.route('/')
def index():
    response = {
        "message": "Welcome to RAIDAR"
    }
    return jsonify(response), 200

if __name__ == "__main__":
    app.run(host='127.0.0.1', debug=True)

