import { useState } from "react";
import OnboardingStep from "./OnboardingStep";
import { countWords, formatWordLabel } from "../../utils/wordCount";

interface Props {
  value: string;
  paragraphContext: string;
  onComplete: (value: string) => void;
  onBack: () => void;
}

const MIN_WORDS = 8;
const MAX_WORDS = 35;

export default function SentenceStep({
  value,
  paragraphContext,
  onComplete,
  onBack,
}: Props) {
  const [text, setText] = useState(value);

  const wordCount = countWords(text);
  const isValid = wordCount >= MIN_WORDS && wordCount <= MAX_WORDS;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (countWords(newValue) <= MAX_WORDS) {
      setText(newValue);
    }
  };

  return (
    <OnboardingStep
      title="Boil It Down"
      subtitle="Condense your paragraph into one complete, honest sentence with one clear idea."
      onContinue={() => onComplete(text)}
      onBack={onBack}
      canContinue={isValid}
      stepNumber={3}
      totalSteps={7}
    >
      <div>
        {paragraphContext.trim().length > 0 && (
          <div className="mb-6 p-4 rounded border border-[#E5E5E5] bg-[#F5F5F5]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#525252] mb-2">
              Your submitted paragraph
            </p>
            <p className="text-sm text-[#404040] leading-relaxed whitespace-pre-wrap">
              {paragraphContext}
            </p>
          </div>
        )}
        <label
          htmlFor="sentence-input"
          className="block text-sm font-semibold text-[#404040] mb-2"
        >
          One clear sentence
        </label>
        <input
          id="sentence-input"
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="The common thread in my story is..."
          className={`
            w-full px-4 py-3 rounded
            border text-base font-sans
            placeholder:text-[#A3A3A3]
            focus:outline-none focus:ring-2 focus:ring-[#00693E]/10
            transition-colors duration-200
            ${
              wordCount > 0 && wordCount < MIN_WORDS
                ? "border-[#9D162E] focus:border-[#9D162E]"
                : "border-[#D4D4D4] focus:border-[#00693E]"
            }
          `}
        />
        <div className="flex justify-between mt-2">
          <span
            className={`text-sm ${
              wordCount > 0 && wordCount < MIN_WORDS
                ? "text-[#9D162E]"
                : "text-[#525252]"
            }`}
          >
            {wordCount < MIN_WORDS
              ? `${MIN_WORDS - wordCount} more words needed`
              : "Looking good!"}
          </span>
          <span
            className={`text-sm ${
              wordCount > MAX_WORDS * 0.9 ? "text-[#9D162E]" : "text-[#525252]"
            }`}
          >
            {formatWordLabel(wordCount)}/{MAX_WORDS}
          </span>
        </div>
      </div>
    </OnboardingStep>
  );
}
