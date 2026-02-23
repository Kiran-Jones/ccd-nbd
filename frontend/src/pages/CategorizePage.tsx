import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppStateContext";
import BinContainer from "../components/categorization/BinContainer";

export default function CategorizePage() {
  const navigate = useNavigate();
  const {
    bins,
    uncategorized,
    totalBullets,
    setBins,
    setUncategorized,
    setTotalBullets,
    handleCategorizationComplete,
    markRouteCompleted,
    setResumeStep,
  } = useAppState();

  return (
    <div className="min-h-screen">
      <BinContainer
        bins={bins}
        uncategorized={uncategorized}
        totalBullets={totalBullets}
        onBinsChange={setBins}
        onUncategorizedChange={setUncategorized}
        onTotalChange={setTotalBullets}
        onComplete={() => {
          handleCategorizationComplete();
          markRouteCompleted("/categorize");
          navigate("/final-word");
        }}
        onBack={() => {
          setResumeStep("preview");
          navigate("/resume");
        }}
      />
    </div>
  );
}
