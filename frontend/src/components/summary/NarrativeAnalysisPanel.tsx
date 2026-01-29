import {
  NarrativeResponse,
  ExperienceSuggestion,
} from "../../types/NarrativeAnalysis";

type NarrativeState =
  | { status: "loading" }
  | { status: "success"; data: NarrativeResponse }
  | { status: "error"; message: string };

interface Props {
  narrativeState: NarrativeState;
  word: string;
  careerValue: string;
  onRetry: () => void;
}

const alignmentConfig = {
  strong: {
    label: "Strong Alignment",
    bgColor: "bg-[#00693E]/10",
    textColor: "text-[#00693E]",
    borderColor: "border-[#00693E]/20",
  },
  moderate: {
    label: "Moderate Alignment",
    bgColor: "bg-[#267ABA]/10",
    textColor: "text-[#267ABA]",
    borderColor: "border-[#267ABA]/20",
  },
  weak: {
    label: "Needs Reframing",
    bgColor: "bg-[#8A6996]/10",
    textColor: "text-[#8A6996]",
    borderColor: "border-[#8A6996]/20",
  },
};

function ExperienceCard({
  suggestion,
  word,
}: {
  suggestion: ExperienceSuggestion;
  word: string;
}) {
  const config = alignmentConfig[suggestion.alignment];

  return (
    <div className={`border ${config.borderColor} rounded-md p-4 ${config.bgColor}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <span className={`text-xs font-medium px-2 py-1 rounded ${config.bgColor} ${config.textColor}`}>
          {config.label}
        </span>
        <span className="text-xs text-[#737373]">{suggestion.category}</span>
      </div>

      <p className="text-[#404040] text-sm mb-3 leading-relaxed">
        "{suggestion.original}"
      </p>

      <p className="text-[#525252] text-sm mb-3">
        {suggestion.explanation}
      </p>

      {suggestion.reframe && (
        <div className="bg-white/80 rounded p-3 border border-[#E5E5E5]">
          <p className="text-xs text-[#737373] uppercase tracking-wide mb-1">
            How to frame around "{word}"
          </p>
          <p className="text-[#262626] text-sm leading-relaxed">
            {suggestion.reframe}
          </p>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-[#E5E5E5] rounded w-full"></div>
        <div className="h-4 bg-[#E5E5E5] rounded w-11/12"></div>
        <div className="h-4 bg-[#E5E5E5] rounded w-4/5"></div>
      </div>
      <div className="border-t border-[#E5E5E5] pt-6">
        <div className="h-4 bg-[#E5E5E5] rounded w-48 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-[#E5E5E5] rounded w-full"></div>
          <div className="h-4 bg-[#E5E5E5] rounded w-10/12"></div>
          <div className="h-4 bg-[#E5E5E5] rounded w-9/12"></div>
        </div>
      </div>
      <div className="border-t border-[#E5E5E5] mt-6 pt-6">
        <div className="h-4 bg-[#E5E5E5] rounded w-56 mb-4"></div>
        <div className="space-y-4">
          <div className="h-32 bg-[#E5E5E5] rounded"></div>
          <div className="h-32 bg-[#E5E5E5] rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function NarrativeAnalysisPanel({
  narrativeState,
  word,
  careerValue,
  onRetry,
}: Props) {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-md">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[#E5E5E5]">
        <h3 className="font-serif text-2xl text-[#262626]">
          Your Narrative Strategy
        </h3>
        <p className="text-[#525252] mt-2">
          Personalized guidance based on your workshop journey
        </p>
      </div>

      <div className="p-8">
        {narrativeState.status === "loading" && (
          <>
            <p className="text-[#737373] text-sm mb-6">
              Analyzing your workshop journey...
            </p>
            <LoadingSkeleton />
          </>
        )}

        {narrativeState.status === "error" && (
          <div className="text-center py-4">
            <p className="text-[#525252] mb-4">{narrativeState.message}</p>
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-[#00693E] text-white rounded-md hover:bg-[#005432] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {narrativeState.status === "success" && (
          <>
            {/* Word and Value Pills - at top */}
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-[#737373] text-sm">Your word:</span>
                <span className="bg-[#00693E]/10 text-[#00693E] px-3 py-1 rounded-full text-sm font-medium">
                  {word}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#737373] text-sm">Your value:</span>
                <span className="bg-[#00693E]/10 text-[#00693E] px-3 py-1 rounded-full text-sm font-medium">
                  {careerValue}
                </span>
              </div>
            </div>

            {/* Paragraph Content */}
            <p className="text-[#404040] leading-relaxed text-lg">
              {narrativeState.data.paragraph}
            </p>

            {/* Bullets Section */}
            {narrativeState.data.bullets.length > 0 && (
              <div className="border-t border-[#E5E5E5] mt-6 pt-6">
                <h4 className="font-serif text-lg text-[#262626] mb-4">
                  How to tell your story:
                </h4>
                <ul className="space-y-3">
                  {narrativeState.data.bullets.map((bullet, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-[#525252]"
                    >
                      <span className="text-[#00693E] mt-1">•</span>
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Experience-Specific Suggestions */}
            {narrativeState.data.experienceSuggestions.length > 0 && (
              <div className="border-t border-[#E5E5E5] mt-6 pt-6">
                <h4 className="font-serif text-lg text-[#262626] mb-2">
                  Experience-Specific Guidance
                </h4>
                <p className="text-[#737373] text-sm mb-4">
                  How to frame your specific experiences around "{word}"
                </p>
                <div className="space-y-4">
                  {narrativeState.data.experienceSuggestions.map(
                    (suggestion, index) => (
                      <ExperienceCard
                        key={index}
                        suggestion={suggestion}
                        word={word}
                      />
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
