"""App configuration."""
from os import environ
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Set Flask configuration vars from .env file."""

    # General Config
    SECRET_KEY = environ.get('SECRET_KEY')
    FLASK_ENV = environ.get('FLASK_ENV')

    # Flask-Assets
    LESS_BIN = environ.get('LESS_BIN')
    ASSETS_DEBUG = environ.get('ASSETS_DEBUG')
    LESS_RUN_IN_DEBUG = environ.get('LESS_RUN_IN_DEBUG')

    # database configs
    DB_NAME = environ.get('raidar')
    DB_URI = environ.get('DOCUMENTDB_ENDPOINT')
    DB_PORT = environ.get('PORT')
    DB_USER = environ.get('USER')
    DB_PASSWORD = environ.get('PASSWPORD')

    # Fall back db configs
    MONGO_URI = environ.get('MONGO_URI')

    