from flask import Flask
from config import Config
from extensions import db, jwt, migrate
from routes.auth_routes import auth_bp
from routes.event_routes import event_bp
from routes.admin_routes import admin_bp
from routes.registration_routes import registration_bp

from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, supports_credentials=True)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(event_bp, url_prefix="/api/events")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(registration_bp, url_prefix="/api/registrations")
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
