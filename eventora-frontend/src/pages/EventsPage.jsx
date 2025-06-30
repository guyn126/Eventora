import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, Grid } from "@mui/material";
import axios from "axios";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [userRegistrations, setUserRegistrations] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}"); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        
        const res = await axios.get("https://eventora-backend.onrender.com/api/events");
        setEvents(res.data); 
      } catch {
        setError("Unable to fetch events.");
      }
    };
    fetchEvents();
    
    const fetchUserRegistrations = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("https://eventora-backend.onrender.com/api/registrations/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserRegistrations(res.data.registrations || []); 
      } catch (err) {
        console.error("Error fetching registrations", err);
      }
    };
    fetchUserRegistrations();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem("access_token");
      
      const res = await axios.post(
        `https://eventora-backend.onrender.com/api/registrations/`,
        { event_id: eventId, nb_tickets: 1 }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200 || res.status === 201) {
        alert("Successfully registered!");
        
        const updatedRegs = await axios.get("https://eventora-backend.onrender.com/api/registrations/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRegistrations(updatedRegs.data.registrations || []);
      } else {
        alert("Failed to register for this event.");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Failed to register for this event.");
    }
  };

  return (
    <Box mt={4} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>
        All Events
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {events.length === 0 ? (
        <Typography>No events found.</Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {events.map((event) => {
            const isRegistered = userRegistrations.some(
              (registration) => registration.event_id === event.id
            );
            return (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Paper sx={{ padding: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Typography variant="h6" align="center">{event.title}</Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    {event.date} ({event.location})
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }} align="center">
                    {event.description}
                  </Typography>
                  {user.role === "participant" && (
                    <>
                      {isRegistered ? (
                        <Button
                          variant="contained"
                          color="error"
                          disabled
                          sx={{ marginTop: 2 }}
                        >
                          Already Registered
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleRegister(event.id)}
                          sx={{ marginTop: 2 }}
                        >
                          Register
                        </Button>
                      )}
                    </>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default EventsPage;
