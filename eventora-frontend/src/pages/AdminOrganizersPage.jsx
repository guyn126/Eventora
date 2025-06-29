import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton, CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

import EditEventModal from "./EditEventModal"; 

const AdminOrganizersPage = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editEvent, setEditEvent] = useState(null);

  // Fetch organizers from backend
  const fetchOrganizers = async () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get("http://localhost:5000/api/admin/organizers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrganizers(res.data.organizers);
    } catch  {
      alert("Failed to load organizers");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);


  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    const token = localStorage.getItem("access_token");
    await axios.delete(`http://localhost:5000/api/admin/event/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchOrganizers();
  };

  
  const handleDeleteOrganizer = async (organizerId) => {
    if (!window.confirm("Are you sure you want to delete this organizer and all his/her events?")) return;
    const token = localStorage.getItem("access_token");
    await axios.delete(`http://localhost:5000/api/admin/organizer/${organizerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchOrganizers();
  };

  
  const handleEditEvent = (event) => setEditEvent(event);
  const handleCloseEditModal = () => setEditEvent(null);

  return (
    <Box sx={{ bgcolor: "#f5f6fa", minHeight: "100vh", p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Organizers & Admins
      </Typography>
      {loading ? (
        <Box textAlign="center" mt={8}><CircularProgress /></Box>
      ) : (
        organizers.map((org) => (
          <Paper elevation={3} sx={{ mb: 4, p: 3, borderRadius: 3 }} key={org.id}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">
                {org.name} ({org.email})
              </Typography>
              <IconButton
                onClick={() => handleDeleteOrganizer(org.id)}
                color="error"
                title="Delete Organizer"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {org.events.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>No events</TableCell>
                  </TableRow>
                )}
                {org.events.map((ev) => (
                  <TableRow key={ev.id}>
                    <TableCell>{ev.title}</TableCell>
                    <TableCell>{ev.date}</TableCell>
                    <TableCell>{ev.location}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditEvent(ev)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteEvent(ev.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ))
      )}

    
      {editEvent && (
        <EditEventModal
          open={!!editEvent}
          event={editEvent}
          onClose={handleCloseEditModal}
          onSave={() => {
            fetchOrganizers();
            handleCloseEditModal();
          }}
        />
      )}
    </Box>
  );
};

export default AdminOrganizersPage;
