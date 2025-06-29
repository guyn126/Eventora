from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Registration, Event
from datetime import datetime


registration_bp = Blueprint('registration_bp', __name__, url_prefix='/api/registrations')


@registration_bp.before_request
def handle_options():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight request accepted'})
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
        return response


@registration_bp.route('/', methods=['POST'])
@registration_bp.route('/<int:event_id>', methods=['POST', 'OPTIONS'])
@jwt_required()
def register_to_event(event_id=None):
    current_user = get_jwt_identity()  
    data = request.json or {}

    
    event_id = event_id or data.get('event_id')
    if not event_id:
        return jsonify({'msg': 'Event ID is required.'}), 400  

    nb_tickets = data.get('nb_tickets', 1) 


    event = Event.query.get(event_id)
    if not event:
        return jsonify({'msg': 'Event not found.'}), 404  


    existing_registration = Registration.query.filter_by(
        user_id=current_user, 
        event_id=event_id
    ).first()

    if existing_registration:
        return jsonify({'msg': 'Already registered for this event.'}), 400 

    
    new_registration = Registration(
        event_id=event_id,
        user_id=current_user,
        nb_tickets=nb_tickets,
        date_inscription=datetime.utcnow() 
    )

    try:
        db.session.add(new_registration)
        db.session.commit()  
        
        return jsonify({
            'msg': 'Registration successful.',
            'registration_id': new_registration.id  # ID of inscription
        }), 201
    except Exception as e:
        db.session.rollback()  # if error comes, cancel the transaction
        # Resend msg error
        return jsonify({'msg': 'Registration failed.', 'error': str(e)}), 500


@registration_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_registrations():
    current_user = get_jwt_identity()  
    registrations = Registration.query.filter_by(user_id=current_user).all()  

    result = []
    for reg in registrations:
        event = Event.query.get(reg.event_id)
        if event:  # if the event exist add those informations
            result.append({
                'id': reg.id,
                'event': {
                    'id': event.id,
                    'title': event.title,
                    'date': event.date.strftime("%d/%m/%Y %H:%M"),
                    'location': event.location,
                    'description': event.description,
                },
                'nb_tickets': reg.nb_tickets,
                'date_inscription': reg.date_inscription.strftime("%d/%m/%Y %H:%M")  # Format  date of inscription
            })

    return jsonify({'registrations': result}), 200  
