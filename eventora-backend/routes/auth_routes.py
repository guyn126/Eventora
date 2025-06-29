from flask import Blueprint, request, jsonify
from models import User
from extensions import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role', 'participant')
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409
    user = User(name=name, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered!"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        token = create_access_token(identity=user.id)
        return jsonify({"access_token": token, "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}})
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    data = request.get_json()
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    password = data.get('password')
    if password:
        user.set_password(password)
    db.session.commit()
    return jsonify({"id": user.id, "name": user.name, "email": user.email, "role": user.role}), 200
