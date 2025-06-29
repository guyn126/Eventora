import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/events" style={{ color: "inherit", textDecoration: "none" }}>
            Eventora
          </Link>
        </Typography>
        {isLoggedIn && user.role ? (
          <Box>
            <Button color="inherit" component={Link} to="/events">
              Events
            </Button>
            {/* For the participants only*/}
            {user.role === "participant" && (
              <Button color="inherit" component={Link} to="/my-registrations">
                My Registrations
              </Button>
            )}
            
            {(user.role === "admin" || user.role === "organizer") && (
              <>
                <Button color="inherit" component={Link} to="/add-event">
                  Add Event
                </Button>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
              
                {user.role === "admin" && (
                  <Button color="inherit" component={Link} to="/participants">
                    Participants
                  </Button>
                )}
              </>
            )}
            
            {user.role === "admin" && (
              <Button color="inherit" component={Link} to="/admin/organizers">
                Organizers
              </Button>
            )}
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
