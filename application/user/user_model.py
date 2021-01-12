from . import db

class User(db.Model):
	"""docstring for User"""
	def __init__(self, arg):
		super(User, self).__init__()
		self.arg = arg
