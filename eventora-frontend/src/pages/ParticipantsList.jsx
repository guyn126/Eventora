import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const BASE_URL = "https://eventora-backend.onrender.com";


const ParticipantsList = () => {
  const [participants, setParticipants] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";
  const isOrganizer = user.role === "organizer";

  useEffect(() => {
    const fetchParticipants = async () => {
      const token = localStorage.getItem("access_token");
      let url = "";
      if (isAdmin) {
        url = `${BASE_URL}/api/admin/users`;
      } else if (isOrganizer) {
        url = `${BASE_URL}/api/organizer/participants`;
      } else {
        setParticipants([]);
        return;
      }
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (isAdmin) {
        setParticipants((res.data.users || []).filter((u) => u.role === "participant"));
      } else if (isOrganizer) {
        setParticipants(res.data.participants || []);
      }
    };
    fetchParticipants();
  }, [isAdmin, isOrganizer]);

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this participant?")) {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${BASE_URL}/api/admin/delete_user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  return (
    <Box mt={6} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Participants
      </Typography>
      <Paper sx={{ width: "80%", overflow: "auto", mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>{participant.name}</TableCell>
                <TableCell>{participant.email}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <IconButton onClick={() => handleDelete(participant.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ParticipantsList;
