# routes/admin_routes.py

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from extensions import db
from models import User, Event, Registration
from dateutil import parser

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/test', methods=['GET'])
def test_admin():
    return jsonify({"status": "ok"})


@admin_bp.route('/organizers', methods=['GET'])
@jwt_required()
def get_organizers():
    organizers = User.query.filter(User.role.in_(["organizer", "admin"])).all()
    organizers_list = []
    for org in organizers:
        org_events = []
        for event in org.events_created:
            participants = [
                {"id": reg.user.id, "name": reg.user.name, "email": reg.user.email, "nb_tickets": reg.nb_tickets}
                for reg in event.registrations
            ]
            org_events.append({
                "id": event.id,
                "title": event.title,
                "date": event.date.strftime("%d/%m/%Y %H:%M"),
                "location": event.location,
                "participants": participants,
            })
        organizers_list.append({
            "id": org.id,
            "name": org.name,
            "email": org.email,
            "events": org_events
        })
    return jsonify({"organizers": organizers_list})


@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    events_count = Event.query.count()
    organizers = User.query.filter(User.role.in_(["organizer", "admin"])).all()
    participants_count = User.query.filter_by(role="participant").count()
    tickets_sold_count = db.session.query(db.func.sum(Registration.nb_tickets)).scalar() or 0

    organizers_list = []
    for org in organizers:
        org_events = []
        for event in org.events_created:
            participants = [
                {"id": reg.user.id, "name": reg.user.name, "email": reg.user.email, "nb_tickets": reg.nb_tickets}
                for reg in event.registrations
            ]
            org_events.append({
                "id": event.id,
                "title": event.title,
                "date": event.date.strftime("%d/%m/%Y %H:%M"),
                "location": event.location,
                "participants": participants,
            })
        organizers_list.append({
            "id": org.id,
            "name": org.name,
            "email": org.email,
            "events": org_events
        })

    return jsonify({
        "events_count": events_count,
        "organizers_count": len(organizers),
        "participants_count": participants_count,
        "tickets_sold_count": tickets_sold_count,
        "organizers": organizers_list
    })


@admin_bp.route('/event/<int:event_id>', methods=['PATCH'])
@jwt_required()
def edit_event(event_id):
    event = Event.query.get_or_404(event_id)
    data = request.json

    if "title" in data and data["title"]:
        event.title = data["title"]

    if "date" in data and data["date"]:
        try:
            event.date = parser.parse(data["date"])
        except Exception as e:
            return jsonify({"error": f"Invalid date format: {e}"}), 400

    if "location" in data and data["location"]:
        event.location = data["location"]

    db.session.commit()
    return jsonify({"message": "Event updated"}), 200


@admin_bp.route('/event/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted"})


@admin_bp.route('/organizer/<int:organizer_id>', methods=['DELETE'])
@jwt_required()
def delete_organizer(organizer_id):
    user = User.query.get_or_404(organizer_id)
    if user.role == "admin":
        return jsonify({"error": "You cannot delete an admin user via this route."}), 403
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Organizer deleted"}), 200



@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify({"users": [
        {"id": u.id, "name": u.name, "email": u.email, "role": u.role}
        for u in users
    ]})

 
@admin_bp.route('/delete_user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"})

print("ADMIN ROUTES LOADED")
