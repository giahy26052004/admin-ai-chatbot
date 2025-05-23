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
    <Box sx={{ maxWidth: 1300, margin: "auto", overflowX: "auto" }}>
      {intents.length === 0 ? (
        <Typography>Chưa có intent nào.</Typography>
      ) : (
        <Table
          size="small"
          sx={{
            tableLayout: "fixed", // ✨ cho ellipsis hoạt động
            width: "100%",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 120 }}>Name</TableCell>
              <TableCell sx={{ width: 240 }}>Prompt Template</TableCell>
              <TableCell sx={{ width: 200 }}>Description</TableCell>
              <TableCell sx={{ width: 100 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {intents.map((i) => (
              <TableRow key={i._id}>
                {/* Name với ellipsis*/}
                <TableCell
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography noWrap>{i.name}</Typography>
                </TableCell>

                {/* Prompt Template */}
                <TableCell
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography noWrap>{i.promptTemplate}</Typography>
                </TableCell>

                {/* Description */}
                <TableCell
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography noWrap>{i.description || "—"}</Typography>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <IconButton
                    size="small"
                    component={RouterLink}
                    to={`/edit/${i._id}`}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(i._id)}>
                    <Delete fontSize="small" />
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
