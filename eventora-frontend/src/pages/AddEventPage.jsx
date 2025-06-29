import React from "react";
import { useNavigate } from "react-router-dom";
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
import dayjs from "dayjs";
import axios from "axios";

const EventSchema = Yup.object().shape({
  title: Yup.string().min(3).max(120).required("Title is required"),
  description: Yup.string().max(500),
  date: Yup.string().required("Date is required"),
  location: Yup.string().min(2).max(120).required("Location is required"),
});

const AddEventPage = () => {
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const navigate = useNavigate();

  return (
    <Box
      minHeight="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: "#f5f6fa" }}
    >
      <Paper elevation={6} sx={{ p: 4, minWidth: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Add New Event
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Formik
          initialValues={{
            title: "",
            description: "",
            date: dayjs().format("YYYY-MM-DDTHH:mm"),
            location: "",
          }}
          validationSchema={EventSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setError("");
            setSuccess("");
            try {
              const token = localStorage.getItem("access_token");
              await axios.post(
                "http://localhost:5000/api/events/",
                { ...values, date: dayjs(values.date).toISOString() },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setSuccess("Event created successfully!");
              resetForm();
              setTimeout(() => {
                navigate("/events");
              }, 1200);
            } catch (err) {
              setError(
                err.response?.data?.error ||
                  "Failed to create event. Please try again."
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
                name="title"
                label="Title"
                error={touched.title && !!errors.title}
                helperText={touched.title && errors.title}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                multiline
                minRows={2}
                maxRows={5}
                name="description"
                label="Description"
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
              />
              <TextField
                fullWidth
                margin="normal"
                name="date"
                label="Date & Time"
                type="datetime-local"
                value={values.date}
                onChange={handleChange}
                error={touched.date && !!errors.date}
                helperText={touched.date && errors.date}
                InputLabelProps={{ shrink: true }}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="location"
                label="Location"
                error={touched.location && !!errors.location}
                helperText={touched.location && errors.location}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2, mb: 1 }}
                disabled={isSubmitting}
              >
                Add Event
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default AddEventPage;
