import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AdminStaffAuthLayout(): JSX.Element {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner/loading indicator
  }

  if (!user.loggedIn) {
    return <Navigate to="/login" />;
  } else if (!user.is_staff) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {/* Common layout for authenticated users */}
      <Outlet /> {/* Renders nested routes */}
    </div>
  );
}

export default AdminStaffAuthLayout;
