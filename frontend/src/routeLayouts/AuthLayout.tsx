import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AuthLayout(): JSX.Element {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
