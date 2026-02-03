import { useMemo, useState } from "react";
import Button from "../common/Button";

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

  const optionBase =
    "border rounded-md p-4 transition-colors flex items-start gap-3";
  const selectedStyle = "border-[#00693E] bg-[#00693E]/5";
  const unselectedStyle = "border-[#E5E5E5] hover:border-[#D4D4D4]";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-[#262626] mb-3">
          Choose Your Final Word
        </h2>
        <p className="text-[#525252] text-lg">
          Pick the word that best captures your narrative moving forward.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-md p-8 mb-6 space-y-4">
        <button
          type="button"
          onClick={() => setSelection("original")}
          className={`${optionBase} ${
            selection === "original" ? selectedStyle : unselectedStyle
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
            className={`${optionBase} ${
              selection === "ai" ? selectedStyle : unselectedStyle
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
          <div className="border border-dashed border-[#D4D4D4] rounded-md p-4 text-sm text-[#737373]">
            Generating an AI-suggested word...
          </div>
        )}

        <div
          className={`${optionBase} ${
            selection === "custom" ? selectedStyle : unselectedStyle
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
              className="mt-2 w-full px-4 py-3 rounded border border-[#D4D4D4] text-base font-sans placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#00693E]/10 focus:border-[#00693E]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={() => onComplete(finalWord)} disabled={!canContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
