import { useMemo, useState } from "react";

type SuggestedState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; word: string }
  | { status: "error" };

interface Props {
  originalWord: string;
  suggestedState: SuggestedState;
  onComplete: (word: string) => void;
  onBack: () => void;
}

type Selection = "original" | "ai" | "custom";

export default function FinalWordStep({
  originalWord,
  suggestedState,
  onComplete,
  onBack,
}: Props) {
  const [selection, setSelection] = useState<Selection>("original");
  const [customWord, setCustomWord] = useState("");

  const aiWord =
    suggestedState.status === "success" ? suggestedState.word : "";

  const finalWord = useMemo(() => {
    if (selection === "original") return originalWord;
    if (selection === "ai") return aiWord;
    return customWord.trim();
  }, [selection, originalWord, aiWord, customWord]);

  const canContinue = finalWord.length > 0;

  return (
    <div className="min-h-[100dvh] bg-[#469B57] flex flex-col px-6 md:px-10 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">07</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-white mb-2 text-center uppercase">
          Choose Your Final Word
        </h2>
        <p className="text-white text-sm md:text-base mb-8 text-center">
          Pick the word that best captures your narrative moving forward.
        </p>

        <div className="w-full bg-white/80 rounded-xl p-6 md:p-8 space-y-4">
          <button
            type="button"
            onClick={() => setSelection("original")}
            className={`w-full text-left rounded-xl p-4 transition-colors flex items-start gap-3 border ${
              selection === "original"
                ? "border-[#003D1C] bg-white"
                : "border-black/10 bg-white/60 hover:bg-white/80"
            }`}
          >
            <input
              type="radio"
              checked={selection === "original"}
              onChange={() => setSelection("original")}
              className="mt-1"
            />
            <div>
              <p className="text-[#262626] font-medium">Your original word</p>
              <p className="text-[#525252] text-sm mt-1">{originalWord}</p>
            </div>
          </button>

          {suggestedState.status === "success" && (
            <button
              type="button"
              onClick={() => setSelection("ai")}
              className={`w-full text-left rounded-xl p-4 transition-colors flex items-start gap-3 border ${
                selection === "ai"
                  ? "border-[#003D1C] bg-white"
                  : "border-black/10 bg-white/60 hover:bg-white/80"
              }`}
            >
              <input
                type="radio"
                checked={selection === "ai"}
                onChange={() => setSelection("ai")}
                className="mt-1"
              />
              <div>
                <p className="text-[#262626] font-medium">AI-suggested word</p>
                <p className="text-[#525252] text-sm mt-1">{aiWord}</p>
              </div>
            </button>
          )}

          {suggestedState.status === "loading" && (
            <div className="border border-dashed border-black/10 rounded-xl p-4 text-sm text-[#525252]">
              Generating an AI-suggested word...
            </div>
          )}

          <div
            className={`rounded-xl p-4 transition-colors flex items-start gap-3 border ${
              selection === "custom"
                ? "border-[#003D1C] bg-white"
                : "border-black/10 bg-white/60 hover:bg-white/80"
            }`}
          >
            <input
              type="radio"
              checked={selection === "custom"}
              onChange={() => setSelection("custom")}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="text-[#262626] font-medium">
                Choose a different word
              </p>
              <input
                type="text"
                value={customWord}
                onChange={(event) => {
                  setCustomWord(event.target.value);
                  if (event.target.value.trim().length > 0) {
                    setSelection("custom");
                  }
                }}
                onFocus={() => setSelection("custom")}
                placeholder="Enter your final word..."
                className="mt-2 w-full px-4 py-3 rounded-xl bg-white/60 border-0 text-base font-sans placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#469B57]/30"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => onComplete(finalWord)}
          disabled={!canContinue}
          className="mt-8 px-10 py-3 bg-[#366946] text-white uppercase tracking-[0.16em] text-sm md:text-base font-medium rounded-xl hover:bg-[#2E5A3C] active:bg-[#264D33] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={onBack}
          className="text-[#003D1C]/70 hover:text-[#003D1C] text-sm font-medium transition-colors"
        >
          &larr; Back
        </button>
      </div>
    </div>
  );
}
