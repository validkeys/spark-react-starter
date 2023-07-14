import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "../stores";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode | ReactNode[];
};

export default function ProtectedRoute(props: ProtectedRouteProps) {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return props.children;
}
