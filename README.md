# Eventora - Event Management System
Eventora is an event management system that allows users to create, view, register for, and manage events. It consists of a frontend built with React and a backend powered by Flask with JWT for authentication and user management.


## Key Features
Create Events: Organizers can create events.

View Events: All users can view the list of events.

Event Registration: Users can register for events as participants.

Manage Registrations: Users can view and manage their event registrations.

User Management: JWT-based authentication and role management (organizer, participant).

### Installation

Backend
1. Clone the backend repository:
git clone <https://github.com/guyn126/Eventora>
cd eventora-backend

2. Install the dependencies:
pipenv install -r requirements.txt

3. Run the Flask app:
flask run

Frontend 
1. cd eventora-frontend
2. Install the dependencies: npm install
3. Start the React development server: npm run dev
    The frontend will be accessible at http://localhost:5174


#### Technologies Used
 Backend (Flask)
-Flask
-Flask-SQLAlchemy
-SQLAlchemy
-PostgreSQL

-Frontend (React)
-React
-Vite
-Axios