import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index.tsx'; 
import Dashboard from './pages/Dashboard.tsx'; 

const App = () => {
    return ( 
        <Router>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
