import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import axios from "axios";

const EventCard = ({ event, onRegister }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem("access_token");

      await axios.post(
        "https://eventora-backend.onrender.com/api/registrations/",  // <-- ICI
        { event_id: event.id, nb_tickets: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Registration successful!");
      if (onRegister) onRegister();
    } catch (error) {
      alert("Registration failed.");
      console.error("Error during registration:", error);
    }
  };

  return (
    <Card sx={{ m: 2, minWidth: 340 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="body2">
          {event.date} ({event.location})
        </Typography>
        <Typography variant="body1" sx={{ my: 1 }}>
          {event.description}
        </Typography>
        {user.role === "participant" && (
          <Button variant="contained" color="primary" onClick={handleRegister}>
            Register
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
