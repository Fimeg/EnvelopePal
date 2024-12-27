from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Envelope(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    budget = db.Column(db.Float, nullable=False)
    spent = db.Column(db.Float, default=0.0)
    transactions = db.relationship('Transaction', backref='envelope', lazy=True, cascade='all, delete-orphan')

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200))
    date = db.Column(db.DateTime, nullable=False)
    envelope_id = db.Column(db.Integer, db.ForeignKey('envelope.id'), nullable=False)

class Achievement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    unlocked = db.Column(db.Boolean, default=False)
    progress = db.Column(db.Float, default=0.0)
