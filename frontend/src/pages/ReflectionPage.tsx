import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppStateContext";

const CELEBRATION_CONFETTI = [
  { left: 2, color: "#00693E", delay: 0.0, duration: 2.6, size: 8 },
  { left: 6, color: "#267ABA", delay: 0.2, duration: 2.9, size: 7 },
  { left: 10, color: "#643C20", delay: 0.15, duration: 2.7, size: 9 },
  { left: 14, color: "#8A6996", delay: 0.3, duration: 3.0, size: 8 },
  { left: 18, color: "#FFA00F", delay: 0.1, duration: 2.8, size: 7 },
  { left: 22, color: "#00693E", delay: 0.25, duration: 2.5, size: 9 },
  { left: 26, color: "#267ABA", delay: 0.05, duration: 2.9, size: 8 },
  { left: 30, color: "#643C20", delay: 0.35, duration: 2.7, size: 7 },
  { left: 34, color: "#8A6996", delay: 0.15, duration: 2.8, size: 8 },
  { left: 38, color: "#FFA00F", delay: 0.4, duration: 3.0, size: 9 },
  { left: 42, color: "#00693E", delay: 0.2, duration: 2.6, size: 8 },
  { left: 46, color: "#267ABA", delay: 0.45, duration: 2.8, size: 7 },
  { left: 50, color: "#643C20", delay: 0.1, duration: 2.9, size: 8 },
  { left: 54, color: "#8A6996", delay: 0.35, duration: 2.6, size: 9 },
  { left: 58, color: "#FFA00F", delay: 0.05, duration: 2.7, size: 8 },
  { left: 62, color: "#00693E", delay: 0.25, duration: 2.9, size: 7 },
  { left: 66, color: "#267ABA", delay: 0.15, duration: 2.5, size: 9 },
  { left: 70, color: "#643C20", delay: 0.3, duration: 2.8, size: 8 },
  { left: 74, color: "#8A6996", delay: 0.2, duration: 2.7, size: 7 },
  { left: 78, color: "#FFA00F", delay: 0.4, duration: 2.9, size: 8 },
  { left: 82, color: "#00693E", delay: 0.1, duration: 2.6, size: 9 },
  { left: 86, color: "#267ABA", delay: 0.35, duration: 2.8, size: 8 },
  { left: 90, color: "#643C20", delay: 0.15, duration: 2.9, size: 7 },
  { left: 94, color: "#8A6996", delay: 0.3, duration: 2.7, size: 8 },
  { left: 98, color: "#FFA00F", delay: 0.2, duration: 2.8, size: 9 },
];

export default function ReflectionPage() {
  const navigate = useNavigate();
  const { onboardingData, finalParagraph } = useAppState();
  const [showBurst, setShowBurst] = useState(false);

  const selectedWord = onboardingData.finalWord || onboardingData.word;

  useEffect(() => {
    setShowBurst(true);
    const id = window.setTimeout(() => setShowBurst(false), 3400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#469B57] px-6 md:px-10 py-8 md:py-12">
      {showBurst && (
        <div className="screen-celebration" aria-hidden="true">
          {CELEBRATION_CONFETTI.map((piece, index) => (
            <span
              key={`${index}-${piece.left}`}
              className="screen-confetti-piece"
              style={{
                left: `${piece.left}%`,
                backgroundColor: piece.color,
                width: `${piece.size}px`,
                height: `${Math.max(4, Math.round(piece.size * 0.4))}px`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="mb-6 md:mb-8">
        <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">09</p>
      </div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-white mb-2 uppercase">
          Reflect on Your Growth
        </h2>
        <p className="text-white text-sm md:text-base max-w-2xl mx-auto">
          Compare your original story with the version you crafted
          today. Notice how your values, skills, and strengths shaped
          the way you describe yourself.
        </p>
      </div>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white/80 rounded-xl p-6">
          <h3 className="text-xl font-medium text-[#262626] mb-4">
            Your Story Core
          </h3>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[#525252] text-sm">Defining word:</span>
            <span className="bg-[#00693E]/10 text-[#00693E] px-3 py-1 rounded-full text-sm font-medium">
              {selectedWord}
            </span>
          </div>
          {onboardingData.careerValues.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[#525252] text-sm">Top values:</span>
              {onboardingData.careerValues.map((value) => (
                <span
                  key={value}
                  className="bg-[#00693E]/10 text-[#00693E] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {value}
                </span>
              ))}
            </div>
          )}
          {onboardingData.careerSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[#525252] text-sm">Top skills:</span>
              {onboardingData.careerSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-[#00693E]/10 text-[#00693E] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          {onboardingData.careerStrengths.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[#525252] text-sm">Top strengths:</span>
              {onboardingData.careerStrengths.map((strength) => (
                <span
                  key={strength}
                  className="bg-[#00693E]/10 text-[#00693E] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {strength}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 rounded-xl p-6">
            <h3 className="text-xl font-medium text-[#262626] mb-3">
              Original Paragraph
            </h3>
            <p className="text-[#525252] leading-relaxed">
              {onboardingData.paragraph}
            </p>
          </div>
          <div className="bg-white/80 rounded-xl p-6">
            <h3 className="text-xl font-medium text-[#262626] mb-3">
              Rewritten Paragraph
            </h3>
            <p className="text-[#525252] leading-relaxed">
              {finalParagraph}
            </p>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl p-6 text-center">
          <h4 className="text-lg font-medium text-[#262626] mb-2">
            Reflection Prompt
          </h4>
          <p className="text-[#525252]">
            What feels more authentic in your rewritten paragraph, and
            what new possibilities do you see in how you present your
            story?
          </p>
        </div>

        <div>
          <button
            onClick={() => navigate("/summary")}
            className="text-[#003D1C]/70 hover:text-[#003D1C] text-sm font-medium transition-colors"
          >
            &larr; Back
          </button>
        </div>
      </div>
    </div>
  );
}
