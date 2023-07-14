import { useAtomValue, useAtom } from "jotai";
import {
  isAuthenticatedAtom,
  routeAfterAuthenticationAtom,
} from "../stores/auth";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode | ReactNode[];
};

export default function ProtectedRoute(props: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [, setRouteAfterAuthentication] = useAtom(routeAfterAuthenticationAtom);
  setRouteAfterAuthentication(location.pathname + location.search);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return props.children;
}
