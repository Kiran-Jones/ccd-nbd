import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppStateContext";
import NarrativeAnalysisPanel from "../components/summary/NarrativeAnalysisPanel";
import { countWords, formatWordLabel } from "../utils/wordCount";

export default function SummaryPage() {
  const navigate = useNavigate();
  const {
    onboardingData,
    narrativeStates,
    finalParagraph,
    setFinalParagraph,
    handleNarrativeRetry,
    markRouteCompleted,
    MIN_FINAL_PARAGRAPH_WORDS,
    MAX_FINAL_PARAGRAPH_WORDS,
  } = useAppState();

  const finalParagraphWordCount = countWords(finalParagraph);

  return (
    <div className="min-h-screen bg-[#469B57] px-6 md:px-10 py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">08</p>
      </div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-white mb-2 uppercase">
          Rewrite Your Story
        </h2>
        <p className="text-white text-sm md:text-base max-w-2xl mx-auto">
          Draft your interview-ready response to "Tell me about yourself"
          using the value-focused perspectives below.
        </p>
      </div>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col gap-3 items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-white/70 text-sm">Defining word:</span>
            <span className="bg-white/80 text-[#003D1C] px-3 py-1 rounded-full text-sm font-medium">
              {onboardingData.finalWord || onboardingData.word}
            </span>
          </div>
          {onboardingData.careerSkills.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-white/70 text-sm">Top skills:</span>
              {onboardingData.careerSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-white/80 text-[#003D1C] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          {onboardingData.careerStrengths.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-white/70 text-sm">Top strengths:</span>
              {onboardingData.careerStrengths.map((strength) => (
                <span
                  key={strength}
                  className="bg-white/80 text-[#003D1C] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {strength}
                </span>
              ))}
            </div>
          )}
        </div>
        {onboardingData.careerValues.length > 0 && (
          <div
            className={
              onboardingData.careerValues.length === 1
                ? ""
                : onboardingData.careerValues.length === 2
                  ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
                  : "grid grid-cols-1 lg:grid-cols-3 gap-6"
            }
          >
            {onboardingData.careerValues.map((value) => (
              <NarrativeAnalysisPanel
                key={value}
                narrativeState={
                  narrativeStates[value] || { status: "idle" }
                }
                word={onboardingData.finalWord || onboardingData.word}
                careerValue={value}
                onRetry={() => handleNarrativeRetry(value)}
              />
            ))}
          </div>
        )}

        <div className="bg-white/80 rounded-xl p-8 text-center">
          <h3 className="text-xl font-medium text-[#262626] mb-2">
            Write Your Final Paragraph
          </h3>
          <p className="text-[#525252] mb-6 max-w-2xl mx-auto">
            Use the prompts above to craft a single, authentic paragraph
            in your own words.
          </p>
          <div className="max-w-3xl mx-auto text-left">
            <label
              htmlFor="final-paragraph"
              className="block text-sm font-semibold text-[#404040] mb-2"
            >
              Your final response
            </label>
            <textarea
              id="final-paragraph"
              value={finalParagraph}
              onChange={(event) => {
                if (countWords(event.target.value) <= MAX_FINAL_PARAGRAPH_WORDS) {
                  setFinalParagraph(event.target.value);
                }
              }}
              placeholder="I am a professional who..."
              rows={6}
              className={`
                w-full px-4 py-3 rounded-xl
                bg-white/60 border-0 text-base font-sans
                placeholder:text-[#A3A3A3]
                focus:outline-none focus:ring-2 focus:ring-[#469B57]/30
                transition-colors duration-200
                resize-none
                ${
                  finalParagraphWordCount > 0 &&
                  finalParagraphWordCount < MIN_FINAL_PARAGRAPH_WORDS
                    ? "ring-2 ring-[#9D162E]/30"
                    : ""
                }
              `}
            />
            <div className="flex justify-between mt-2">
              <span
                className={`text-sm ${
                  finalParagraphWordCount > 0 &&
                  finalParagraphWordCount < MIN_FINAL_PARAGRAPH_WORDS
                    ? "text-[#9D162E]"
                    : "text-[#525252]"
                }`}
              >
                {finalParagraphWordCount < MIN_FINAL_PARAGRAPH_WORDS
                  ? `${MIN_FINAL_PARAGRAPH_WORDS - finalParagraphWordCount} more words needed`
                  : "Looking good!"}
              </span>
              <span
                className={`text-sm ${
                  finalParagraphWordCount > MAX_FINAL_PARAGRAPH_WORDS * 0.9
                    ? "text-[#9D162E]"
                    : "text-[#525252]"
                }`}
              >
                {formatWordLabel(finalParagraphWordCount)}/
                {MAX_FINAL_PARAGRAPH_WORDS}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/final-word")}
            className="text-[#003D1C]/70 hover:text-[#003D1C] text-sm font-medium transition-colors"
          >
            &larr; Back
          </button>
          <button
            onClick={() => {
              markRouteCompleted("/summary");
              navigate("/reflection");
            }}
            disabled={finalParagraphWordCount < MIN_FINAL_PARAGRAPH_WORDS}
            className="px-10 py-3 bg-[#366946] text-white uppercase tracking-[0.16em] text-sm md:text-base font-medium rounded-xl hover:bg-[#2E5A3C] active:bg-[#264D33] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
