import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppState } from "../../context/AppStateContext";

const ROUTE_ORDER = ["/", "/intake", "/resume", "/categorize", "/final-word", "/summary", "/reflection"];

interface Props {
  requiredRoutes: string[];
  children: ReactNode;
}

export default function RouteGuard({ requiredRoutes, children }: Props) {
  const { completedRoutes } = useAppState();

  for (const req of requiredRoutes) {
    if (!completedRoutes.includes(req)) {
      // Redirect to the furthest incomplete prerequisite route
      const target = ROUTE_ORDER.find(
        (r) => requiredRoutes.includes(r) && !completedRoutes.includes(r),
      ) ?? "/";
      return <Navigate to={target} replace />;
    }
  }

  return <>{children}</>;
}
