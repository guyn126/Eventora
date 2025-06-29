import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const EventList = ({ events, onRegister, userRole, userRegistrations }) => {
  if (!Array.isArray(events) || events.length === 0) {
    return (
      <Typography align="center" sx={{ mt: 4, fontSize: 24 }}>
        No events found.
      </Typography>
    );
  }

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4}>
      {events.map((event) => {
        const isRegistered = userRegistrations.some(
          (registration) => registration.event_id === event.id
        );

        return (
          <Card key={event.id} sx={{ width: 350, m: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {event.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {event.date} ({event.location})
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {event.description}
              </Typography>

              
              {userRole === "participant" && !isRegistered && (
                <Box mt={2}>
                  <button
                    onClick={() => onRegister(event.id)}
                    style={{
                      background: "#1976d2",
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Register
                  </button>
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default EventList;
