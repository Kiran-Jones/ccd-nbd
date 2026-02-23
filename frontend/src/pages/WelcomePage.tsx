import { useNavigate } from "react-router-dom";
import WelcomeStep from "../components/onboarding/WelcomeStep";
import { useAppState } from "../context/AppStateContext";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { markRouteCompleted } = useAppState();

  return (
    <div className="h-[100dvh] overflow-hidden bg-white">
      <WelcomeStep
        onContinue={() => {
          markRouteCompleted("/");
          navigate("/intake");
        }}
      />
    </div>
  );
}
