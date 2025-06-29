# routes/organizer_routes.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Event, Registration

organizer_bp = Blueprint('organizer', __name__)

@organizer_bp.route('/participants', methods=['GET'])
@jwt_required()
def get_my_event_participants():
    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)
    if not user or user.role != "organizer":
        return jsonify({"error": "Unauthorized"}), 403

    
    events = Event.query.filter_by(created_by=current_user_id).all()
    event_ids = [event.id for event in events]

    
    registrations = (
        Registration.query
        .filter(Registration.event_id.in_(event_ids))
        .all()
    )
    
    seen_ids = set()
    participants = []
    for reg in registrations:
        if reg.user_id not in seen_ids:
            u = User.query.get(reg.user_id)
            if u:
                participants.append({
                    "id": u.id,
                    "name": u.name,
                    "email": u.email,
                })
                seen_ids.add(u.id)

    return jsonify({"participants": participants})

print("ORGANIZER ROUTES LOADED")
