
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";
import Navbar from "./components/Navbar";
import AddEventPage from "./pages/AddEventPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import EditEventPage from "./pages/EditEventPage"; 
import ProfilePage from "./pages/ProfilePage";
import RequireAuth from "./components/RequireAuth";
import AdminOrganizersPage from "./pages/AdminOrganizersPage";
import OrganizerListPage from "./pages/OrganizerListPage";
import ParticipantsList from "./pages/ParticipantsList";

function App() {
  console.log("App loaded !");
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/participants" element={<ParticipantsList />} />
        <Route path="/organizers" element={<OrganizerListPage />} />
        <Route path="/admin/organizers" element={<AdminOrganizersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-registrations" element={<MyRegistrationsPage />} />
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/add-event" element={<AddEventPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events" element={<EventsPage />} />
        
        <Route path="/events/:eventId/edit" element={<EditEventPage />} />
        <Route path="*" element={<Navigate to="/events" />} />
      </Routes>
    </Router>
  );
}

export default App;
