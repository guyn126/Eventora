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
} from "@mui/material";
import axios from "axios";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(4, "Too short!").required("Required"),
});

const LoginPage = () => {
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
          Login to <span style={{ color: "#1976d2" }}>Eventora</span>
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setError("");
            try {
              const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                values
              );
              localStorage.setItem("access_token", res.data.access_token);
              localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
              );
              navigate("/events");
            } catch (err) {
              setError(
                err.response?.data?.error || "Login failed. Try again."
              );
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="email"
                label="Email"
                type="email"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                autoFocus
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
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2, mb: 1 }}
                disabled={isSubmitting}
              >
                Login
              </Button>
              <Typography align="center" variant="body2" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "#1976d2" }}>
                  Register here
                </Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default LoginPage;
