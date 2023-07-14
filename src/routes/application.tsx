import { Outlet } from "react-router-dom";
import { useSession } from "@/stores/auth";

export default function Application() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <div>Checking Authentication</div>;
  }

  return (
    <div>
      My App{" "}
      <div>{session.isAuthenticated ? "Authenticated" : "Unauthenticated"}</div>
      <div className="bg-red-50">
        <Outlet />
      </div>
    </div>
  );
}
