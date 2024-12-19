import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const ProtectedRoute = ({ children, requiredRoles }) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    const decodedToken = jwtDecode(accessToken);
    const userRoles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (requiredRoles && !requiredRoles.some(role => userRoles.includes(role))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
