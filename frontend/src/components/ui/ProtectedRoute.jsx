import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useSelector((store) => store.user);

  const storedUser = localStorage.getItem("user");

  const currentUser =
    user || (storedUser ? JSON.parse(storedUser) : null);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;