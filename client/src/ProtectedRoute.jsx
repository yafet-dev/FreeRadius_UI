import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/" replace />;
  }
  // If token exists, allow access to the protected component
  return children;
};

export default ProtectedRoute;
