import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
    if (!user) {
        // If user is not logged in, redirect to the login page
        return <Navigate to="/" />;
    }

    // If user is logged in, render the children components (i.e., the protected route components)
    return children;
};

export default ProtectedRoute;
