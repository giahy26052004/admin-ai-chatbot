import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import api from "../api";

export default function IntentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    promptTemplate: "",
    description: "",
  });
  const [loading, setLoading] = useState(isEdit);

  // Nếu edit, fetch existing intent
  useEffect(() => {
    if (isEdit) {
      api
        .get(`/intents`)
        .then((res) => {
          const intent = res.data.find((i) => i._id === id);
          if (intent)
            setForm({
              name: intent.name,
              promptTemplate: intent.promptTemplate,
              description: intent.description || "",
            });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const req = isEdit
      ? api.put(`/intents/${id}`, form)
      : api.post("/intents", form);

    req
      .then(() => navigate("/"))
      .catch((err) => alert(err.response?.data?.message || err.message));
  };

  if (loading) return <CircularProgress />;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: "auto" }}
    >
      <Typography variant="h5" mb={2}>
        {isEdit ? "Edit Intent" : "Create Intent"}
      </Typography>

      <TextField
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />

      <TextField
        label="Prompt Template"
        name="promptTemplate"
        value={form.promptTemplate}
        onChange={handleChange}
        fullWidth
        required
        multiline
        minRows={4}
        margin="normal"
      />

      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button onClick={() => navigate("/")} sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button variant="contained" type="submit">
          {isEdit ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
}
