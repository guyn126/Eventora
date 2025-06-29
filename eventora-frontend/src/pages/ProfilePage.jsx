import React, { useState } from "react";
import { Box, Typography, Paper, TextField, Button, Alert, Snackbar } from "@mui/material";
import axios from "axios";

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        { name, email, password: password ? password : undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated!");
      localStorage.setItem("user", JSON.stringify(res.data));
      setPassword("");
      setOpen(true);
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
      setOpen(true);
    }
  };

  return (
    <Box minHeight="70vh" display="flex" alignItems="center" justifyContent="center" sx={{ bgcolor: "#f5f6fa" }}>
      <Paper elevation={6} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" align="center" gutterBottom>
          My Profile
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleUpdate}>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
          <TextField
            label="New Password (leave blank to keep current)"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Update Profile
          </Button>
        </form>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          message={message || error}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        />
      </Paper>
    </Box>
  );
};

export default ProfilePage;
