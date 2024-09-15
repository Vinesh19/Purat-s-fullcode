import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import Home from "./pages/index";
import DashboardPage from "./pages/dashboard";
import BroadcastPage from "./pages/broadcast";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import TeamInbox from "./containers/TeamInbox";
import WhatsappNavbar from "./components/WhatsappNavbar";
import Crm from "./containers/Crm";
import Chatbot from "./containers/Chatbot";
import ChatbotBuilder from "./containers/Chatbot/ChatbotBuilder";
import CreateChatbot from "./containers/Chatbot/CreateChatbot";
import GroupList from "./containers/Contacts";
import ContactTable from "./containers/Contacts/ContactTable";

const validateToken = () => {
  const token = localStorage.getItem("token");
  return !!token; // Returns true if token exists, otherwise false
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && validateToken()) {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#2070e2",
      },
      common: {
        white: "#ffffff",
      },
      action: {
        hover: "#f5f5f5",
      },
    },
    spacing: 8, // This defines the spacing unit
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute user={user}>
                <Home setUser={setUser} />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <DashboardPage user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/whatsapp"
            element={
              <ProtectedRoute user={user}>
                <WhatsappNavbar user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard/whatsapp/broadcast"
              element={<BroadcastPage user={user} />}
            />

            <Route
              path="/dashboard/whatsapp/teamInbox"
              element={<TeamInbox user={user} />}
            />

            <Route path="/dashboard/whatsapp/chatbots" element={<Chatbot />} />

            <Route
              path="/dashboard/whatsapp/chatbotBuilder"
              element={<ChatbotBuilder />}
            />

            <Route
              path="/dashboard/whatsapp/createChatbot"
              element={<CreateChatbot />}
            />

            <Route
              path="/dashboard/whatsapp/crm"
              element={<Crm user={user?.username} />}
            />

            <Route
              path="/dashboard/whatsapp/contacts"
              element={<GroupList user={user?.username} />}
            />

            <Route
              path="/dashboard/whatsapp/contacts/:groupId/:groupName"
              element={<ContactTable user={user?.username} />}
            />
          </Route>
        </Routes>

        <ToastContainer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
