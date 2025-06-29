import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";

const EditEventModal = ({ open, onClose, event, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        date: event.date ? dayjs(event.date).format("YYYY-MM-DDTHH:mm") : "",
        location: event.location || "",
      });
    }
  }, [event, open]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("access_token");
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/event/${event.id}`,
        {
          title: form.title,
          date: form.date,
          location: form.location,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      if (onSave) onSave();
      if (onClose) onClose();
    } catch (err) {
      setLoading(false);
      alert("Erreur lors de la sauvegarde: " + (err?.response?.data?.error || ""));
    }
  };

  return (
    <Modal open={open} onClose={() => { if (!loading) onClose(); }}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper",
        boxShadow: 24, p: 4, borderRadius: 2
      }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" mb={2}>Edit Event</Typography>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth margin="normal" required
          />
          <TextField
            label="Date"
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            fullWidth margin="normal" required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            fullWidth margin="normal" required
          />
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button
              onClick={() => { if (!loading) onClose(); }}
              color="secondary"
              variant="outlined"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditEventModal;
