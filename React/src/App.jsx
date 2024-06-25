import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/index";
import DashboardPage from "./pages/dashboard";
import BroadcastPage from "./pages/broadcast";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

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

    return (
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
                            <BroadcastPage user={user} setUser={setUser} />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
