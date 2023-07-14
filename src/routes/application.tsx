import { Outlet } from "react-router-dom";
import { useLogout, useSession } from "@/stores/auth";

export default function Application() {
  const { session, isLoading } = useSession();
  const { logout } = useLogout();

  if (isLoading) {
    return <div>Checking Authentication</div>;
  }

  const handleLogout = () => {
    void logout([undefined]);
  };

  return <Outlet />;
}
