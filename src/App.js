import { Routes, Route, Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import IntentList from "./components/IntentList";
import IntentForm from "./components/IntentForm";
import ChatBot from "./components/ChatBot";

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Intents
          </Typography>

          <Button color="inherit" component={RouterLink} to="/">
            List
          </Button>

          <Button color="inherit" component={RouterLink} to="/create">
            Create
          </Button>
        </Toolbar>
      </AppBar>
      <Box p={3}>
        <Routes>
          <Route path="/" element={<IntentList />} />
          <Route path="/create" element={<IntentForm />} />
          <Route path="/edit/:id" element={<IntentForm />} />
        </Routes>
      </Box>
      <ChatBot />
    </>
  );
}
