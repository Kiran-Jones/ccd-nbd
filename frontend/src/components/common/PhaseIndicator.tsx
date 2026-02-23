import { useLocation } from "react-router-dom";

const PHASE_COLORS = ["#366946", "#469B57", "#6FC37F", "#92D79F", "#B1E3BB"];

const MILESTONE_IDS = ["intake", "resume", "categorize", "rewrite", "reflect"] as const;

const milestoneByPath: Record<string, (typeof MILESTONE_IDS)[number]> = {
  "/": "intake",
  "/intake": "intake",
  "/resume": "resume",
  "/categorize": "categorize",
  "/final-word": "rewrite",
  "/summary": "rewrite",
  "/reflection": "reflect",
};

export default function PhaseIndicator() {
  const location = useLocation();
  const milestoneId = milestoneByPath[location.pathname] ?? "intake";
  const index = MILESTONE_IDS.indexOf(milestoneId);
  const color = PHASE_COLORS[index] ?? PHASE_COLORS[0];

  return (
    <div
      className="fixed right-0 w-3 md:w-4 h-16 md:h-20 z-50 transition-all duration-500 ease-in-out"
      style={{ top: `${index * 20}vh`, backgroundColor: color }}
      aria-hidden="true"
    />
  );
}
