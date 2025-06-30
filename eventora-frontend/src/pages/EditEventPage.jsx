import React, { useEffect, useState } from "react";
import axios from "axios";
import EventList from "../components/EventList";
import { Alert, Typography, Box } from "@mui/material";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      const res = await axios.get("https://eventora-backend.onrender.com/api/events/");
      setEvents(res.data || []);
    } catch {
      setError("Unable to fetch events.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box mt={6} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
        All Events
      </Typography>
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      {events.length === 0 ? (
        <Typography>No events found.</Typography>
      ) : (
        <EventList events={events} onRegister={fetchEvents} />
      )}
    </Box>
  );
};

export default EventsPage;
