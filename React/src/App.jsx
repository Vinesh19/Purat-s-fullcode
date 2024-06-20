import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Load user data from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Index setUser={setUser} />} />
                <Route path="/dashboard" element={<Dashboard user={user} />} />
            </Routes>
        </Router>
    );
};

export default App;
