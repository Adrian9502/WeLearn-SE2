import { Navigate } from "react-router-dom";
import React from "react";

// Destructure "role" as a prop to use it in the logic
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = () => {
    return localStorage.getItem("authToken") !== null;
  };

  const getUserRole = () => {
    return localStorage.getItem("userRole"); // Store "admin" or "user" when logging in
  };

  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  const userRole = getUserRole();

  // Check if the logged-in user's role matches the allowedRoles
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />; // Redirect if the role doesn't match
  }

  return children;
};

export default ProtectedRoute;
