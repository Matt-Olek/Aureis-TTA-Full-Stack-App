import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner/loading indicator
  }

  return (
    <div>
      {/* Common layout for authenticated users */}
      <Outlet /> {/* Renders nested routes */}
    </div>
  );
}
