import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppStateContext";
import FinalWordStep from "../components/final-word/FinalWordStep";

export default function FinalWordPage() {
  const navigate = useNavigate();
  const {
    onboardingData,
    aiWordState,
    handleFinalWordComplete,
    markRouteCompleted,
  } = useAppState();

  return (
    <div className="h-[100dvh] overflow-hidden">
      <FinalWordStep
        originalWord={onboardingData.word}
        suggestedState={aiWordState}
        onComplete={(word) => {
          handleFinalWordComplete(word);
          markRouteCompleted("/final-word");
          navigate("/summary");
        }}
        onBack={() => navigate("/categorize")}
      />
    </div>
  );
}
