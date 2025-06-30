import React, { useEffect, useState } from "react";
import { Alert, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(
          
          "https://eventora-backend.onrender.com/api/registrations/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRegistrations(res.data.registrations || []);
      } catch {
        setError("Unable to fetch your registrations.");
        setRegistrations([]);
      }
    };
    fetchRegistrations();
  }, []);

  if (!Array.isArray(registrations)) return <div>Loading...</div>;

  return (
    <Box mt={4}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold" }}
      >
        My Registrations
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      {registrations.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="30vh"
        >
          <Typography>No registrations found.</Typography>
        </Box>
      ) : (
        <Paper sx={{ width: "100%", overflow: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Tickets</TableCell>
                <TableCell>Registered On</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations.map((reg, i) => (
                <TableRow key={reg.id || i}>
                  <TableCell>{reg.event?.title}</TableCell>
                  <TableCell>{reg.event?.date}</TableCell>
                  <TableCell>{reg.event?.location}</TableCell>
                  <TableCell>{reg.nb_tickets}</TableCell>
                  <TableCell>{reg.date_inscription}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default MyRegistrations;
