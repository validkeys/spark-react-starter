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

  return (
    <div>
      My App{" "}
      {session.isAuthenticated ? (
        <div>
          Authenticated <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>UnAuthenticated</div>
      )}
      <div>{session.isAuthenticated ? "Authenticated" : "Unauthenticated"}</div>
      <div className="bg-red-50">
        <Outlet />
      </div>
    </div>
  );
}
