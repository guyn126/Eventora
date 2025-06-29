# backend/schemas.py
from extensions import ma
from marshmallow import fields, validate, validates, ValidationError
from models import User, Event, Registration

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ("password_hash", )

    email = fields.Email(required=True, validate=validate.Length(max=120))
    name = fields.Str(required=True, validate=validate.Length(min=2, max=80))
    role = fields.Str(validate=validate.OneOf(["admin", "organizer", "participant"]))

class EventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Event
        load_instance = True
    created_by = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=3, max=120))
    description = fields.Str()
    date = fields.DateTime(required=True)
    location = fields.Str(required=True, validate=validate.Length(min=2, max=120))

class RegistrationSchema(ma.SQLAlchemyAutoSchema):
    user = fields.Nested(UserSchema, only=("id", "name", "email", "role"))
    event = fields.Nested(EventSchema, only=("id", "title", "date", "location"))

    class Meta:
        model = Registration
        load_instance = True

    nb_tickets = fields.Int(required=True, validate=validate.Range(min=1, max=20))
    date_inscription = fields.DateTime(dump_only=True)
    user_id = fields.Int(required=True)
    event_id = fields.Int(required=True)

    @validates("nb_tickets")
    def validate_nb_tickets(self, value):
        if value < 1:
            raise ValidationError("At least one ticket must be purchased.")
