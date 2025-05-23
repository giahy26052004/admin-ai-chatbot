import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import api from "../api.js";

export default function IntentList() {
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/intents")
      .then((res) => setIntents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Xác nhận xóa?")) return;
    api
      .delete(`/intents/${id}`)
      .then(() => setIntents(intents.filter((i) => i._id !== id)))
      .catch(console.error);
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      {intents.length === 0 ? (
        <Typography>Chưa có intent nào.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Prompt Template</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {intents.map((i) => (
              <TableRow key={i._id}>
                <TableCell>{i.name}</TableCell>
                <TableCell>
                  <Typography noWrap maxWidth={300}>
                    {i.promptTemplate}
                  </Typography>
                </TableCell>
                <TableCell>{i.description || "—"}</TableCell>
                <TableCell>
                  <IconButton component={RouterLink} to={`/edit/${i._id}`}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(i._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}
