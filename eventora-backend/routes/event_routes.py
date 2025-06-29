from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Event, Registration, User
from datetime import datetime

event_bp = Blueprint('events', __name__)


@event_bp.route('/', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([{
        "id": e.id,
        "title": e.title,
        "description": e.description,
        "date": e.date.strftime("%d/%m/%Y %H:%M"),
        "location": e.location,
        "created_by": e.created_by
    } for e in events])


@event_bp.route('/<int:event_id>/participants', methods=['GET'])
@jwt_required()
def get_event_participants(event_id):
    regs = Registration.query.filter_by(event_id=event_id).all()
    participants = []
    for reg in regs:
        user = User.query.get(reg.user_id)
        if user:
            participants.append({"id": user.id, "name": user.name, "email": user.email})
    return jsonify({"participants": participants})


@event_bp.route('/', methods=['POST'])
@jwt_required()
def add_event():
    data = request.get_json()
    title = data.get("title")
    description = data.get("description", "")
    date_str = data.get("date")
    location = data.get("location")
    created_by = get_jwt_identity()

    if not all([title, date_str, location]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        date = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except Exception as e:
        return jsonify({"error": "Invalid date format"}), 400

    event = Event(
        title=title,
        description=description,
        date=date,
        location=location,
        created_by=created_by
    )
    db.session.add(event)
    db.session.commit()
    return jsonify({"message": "Event created"}), 201


@event_bp.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({"msg": "Event deleted"})


@event_bp.route('/<int:event_id>', methods=['PUT'])
@jwt_required()
def edit_event(event_id):
    event = Event.query.get_or_404(event_id)
    data = request.get_json()
    if 'title' in data:
        event.title = data['title']
    if 'description' in data:
        event.description = data['description']
    if 'date' in data:
        try:
            event.date = datetime.fromisoformat(data['date'].replace("Z", "+00:00"))
        except Exception:
            return jsonify({"error": "Invalid date format"}), 400
    if 'location' in data:
        event.location = data['location']
    db.session.commit()
    return jsonify({"msg": "Event updated"})


@event_bp.route('/<int:event_id>/participant/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_participant(event_id, user_id):
    reg = Registration.query.filter_by(event_id=event_id, user_id=user_id).first()
    if not reg:
        return jsonify({"error": "Registration not found"}), 404
    db.session.delete(reg)
    db.session.commit()
    return jsonify({"msg": "Participant removed"})



from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Registration, Event, User

registration_bp = Blueprint('registration', __name__)

@registration_bp.route('/registrations/my', methods=['GET'])
@jwt_required()
def get_my_registrations():
    user_id = get_jwt_identity()
    regs = Registration.query.filter_by(user_id=user_id).all()
    events = []
    for reg in regs:
        event = Event.query.get(reg.event_id)
        if event:
            events.append({
                "event_id": event.id,
                "title": event.title,
                "date": event.date.strftime("%d/%m/%Y %H:%M"),
                "location": event.location,
                "nb_tickets": reg.nb_tickets,
            })
    return jsonify({"registrations": events}), 200
