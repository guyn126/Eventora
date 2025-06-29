import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too short!").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(4, "Too short!").required("Required"),
  role: Yup.string().oneOf(["admin", "organizer", "participant"]).required("Required"),
});

const RegisterPage = () => {
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  return (
    <Box
      minHeight="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: "#f5f6fa" }}
    >
      <Paper elevation={6} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register for <span style={{ color: "#1976d2" }}>Eventora</span>
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            role: "participant",
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setError("");
            try {
              await axios.post(
                "http://localhost:5000/api/auth/register",
                values
              );
              navigate("/login");
            } catch (err) {
              setError(
                err.response?.data?.error || "Registration failed. Try again."
              );
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting, values, handleChange }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="name"
                label="Full Name"
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                autoFocus
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="email"
                label="Email"
                type="email"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="password"
                label="Password"
                type="password"
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
              <TextField
                select
                fullWidth
                margin="normal"
                name="role"
                label="Role"
                value={values.role}
                onChange={handleChange}
                error={touched.role && !!errors.role}
                helperText={touched.role && errors.role}
              >
                <MenuItem value="participant">Participant</MenuItem>
                <MenuItem value="organizer">Organizer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2, mb: 1 }}
                disabled={isSubmitting}
              >
                Register
              </Button>
              <Typography align="center" variant="body2" sx={{ mt: 2 }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#1976d2" }}>
                  Login here
                </Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
