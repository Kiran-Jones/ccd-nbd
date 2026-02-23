import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PhaseIndicator from "./components/common/PhaseIndicator";
import RouteGuard from "./components/common/RouteGuard";
import WelcomePage from "./pages/WelcomePage";
import IntakePage from "./pages/IntakePage";
import ResumePage from "./pages/ResumePage";
import CategorizePage from "./pages/CategorizePage";
import FinalWordPage from "./pages/FinalWordPage";
import SummaryPage from "./pages/SummaryPage";
import ReflectionPage from "./pages/ReflectionPage";

function App() {
  const location = useLocation();
  const isWelcome = location.pathname === "/";

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [location.pathname]);

  return (
    <>
      {!isWelcome && <PhaseIndicator />}

      <Routes>
        <Route path="/" element={<WelcomePage />} />

        <Route
          path="/intake"
          element={
            <RouteGuard requiredRoutes={["/"]}>
              <IntakePage />
            </RouteGuard>
          }
        />

        <Route
          path="/resume"
          element={
            <RouteGuard requiredRoutes={["/", "/intake"]}>
              <ResumePage />
            </RouteGuard>
          }
        />

        <Route
          path="/categorize"
          element={
            <RouteGuard requiredRoutes={["/", "/intake", "/resume"]}>
              <CategorizePage />
            </RouteGuard>
          }
        />

        <Route
          path="/final-word"
          element={
            <RouteGuard requiredRoutes={["/", "/intake", "/resume", "/categorize"]}>
              <FinalWordPage />
            </RouteGuard>
          }
        />

        <Route
          path="/summary"
          element={
            <RouteGuard requiredRoutes={["/", "/intake", "/resume", "/categorize", "/final-word"]}>
              <SummaryPage />
            </RouteGuard>
          }
        />

        <Route
          path="/reflection"
          element={
            <RouteGuard requiredRoutes={["/", "/intake", "/resume", "/categorize", "/final-word", "/summary"]}>
              <ReflectionPage />
            </RouteGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
