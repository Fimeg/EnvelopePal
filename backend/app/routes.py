from flask import Blueprint, request, jsonify
from .models import db, Envelope, Transaction, Achievement
from datetime import datetime

api = Blueprint('api', __name__)

# Envelope endpoints
@api.route('/envelopes', methods=['GET'])
def get_envelopes():
    envelopes = Envelope.query.all()
    return jsonify([{
        'id': e.id,
        'name': e.name,
        'budget': e.budget,
        'spent': e.spent
    } for e in envelopes])

@api.route('/envelopes', methods=['POST'])
def create_envelope():
    data = request.json
    envelope = Envelope(name=data['name'], budget=data['budget'], spent=0)
    db.session.add(envelope)
    db.session.commit()
    return jsonify({
        'id': envelope.id,
        'name': envelope.name,
        'budget': envelope.budget,
        'spent': envelope.spent
    }), 201

@api.route('/envelopes/<int:id>', methods=['PUT'])
def update_envelope(id):
    envelope = Envelope.query.get_or_404(id)
    data = request.json
    envelope.name = data.get('name', envelope.name)
    envelope.budget = data.get('budget', envelope.budget)
    db.session.commit()
    return jsonify({
        'id': envelope.id,
        'name': envelope.name,
        'budget': envelope.budget,
        'spent': envelope.spent
    })

@api.route('/envelopes/<int:id>', methods=['DELETE'])
def delete_envelope(id):
    envelope = Envelope.query.get_or_404(id)
    db.session.delete(envelope)
    db.session.commit()
    return '', 204

# Transaction endpoints
@api.route('/envelopes/<int:envelope_id>/transactions', methods=['GET'])
def get_transactions(envelope_id):
    transactions = Transaction.query.filter_by(envelope_id=envelope_id).all()
    return jsonify([{
        'id': t.id,
        'amount': t.amount,
        'description': t.description,
        'date': t.date.isoformat(),
        'envelope_id': t.envelope_id
    } for t in transactions])

@api.route('/envelopes/<int:envelope_id>/transactions', methods=['POST'])
def create_transaction(envelope_id):
    envelope = Envelope.query.get_or_404(envelope_id)
    data = request.json
    transaction = Transaction(
        amount=data['amount'],
        description=data['description'],
        date=datetime.fromisoformat(data['date']),
        envelope_id=envelope_id
    )
    envelope.spent += transaction.amount
    db.session.add(transaction)
    db.session.commit()
    return jsonify({
        'id': transaction.id,
        'amount': transaction.amount,
        'description': transaction.description,
        'date': transaction.date.isoformat(),
        'envelope_id': transaction.envelope_id
    }), 201

# Achievement endpoints
@api.route('/achievements', methods=['GET'])
def get_achievements():
    achievements = Achievement.query.all()
    return jsonify([{
        'id': a.id,
        'name': a.name,
        'description': a.description,
        'unlocked': a.unlocked,
        'progress': a.progress
    } for a in achievements])

@api.route('/achievements/<int:id>', methods=['PUT'])
def update_achievement(id):
    achievement = Achievement.query.get_or_404(id)
    data = request.json
    achievement.progress = data.get('progress', achievement.progress)
    achievement.unlocked = data.get('unlocked', achievement.unlocked)
    db.session.commit()
    return jsonify({
        'id': achievement.id,
        'name': achievement.name,
        'description': achievement.description,
        'unlocked': achievement.unlocked,
        'progress': achievement.progress
    })
