import { useState } from "react";
import OnboardingStep from "./OnboardingStep";

interface Props {
  value: string;
  onComplete: (value: string) => void;
  onBack: () => void;
}

const MIN_CHARS = 10;
const MAX_CHARS = 300;

export default function SentenceStep({ value, onComplete, onBack }: Props) {
  const [text, setText] = useState(value);

  const charCount = text.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHARS) {
      setText(newValue);
    }
  };

  return (
    <OnboardingStep
      title="Distill Your Essence"
      subtitle="Summarize your professional identity in a single sentence."
      onContinue={() => onComplete(text)}
      onBack={onBack}
      canContinue={isValid}
      stepNumber={2}
      totalSteps={4}
    >
      <div>
        <label
          htmlFor="sentence-input"
          className="block text-sm font-semibold text-[#404040] mb-2"
        >
          One sentence that captures you
        </label>
        <input
          id="sentence-input"
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="I am someone who..."
          className={`
            w-full px-4 py-3 rounded
            border text-base font-sans
            placeholder:text-[#A3A3A3]
            focus:outline-none focus:ring-2 focus:ring-[#00693E]/10
            transition-colors duration-200
            ${
              charCount > 0 && charCount < MIN_CHARS
                ? "border-[#9D162E] focus:border-[#9D162E]"
                : "border-[#D4D4D4] focus:border-[#00693E]"
            }
          `}
        />
        <div className="flex justify-between mt-2">
          <span
            className={`text-sm ${
              charCount > 0 && charCount < MIN_CHARS
                ? "text-[#9D162E]"
                : "text-[#525252]"
            }`}
          >
            {charCount < MIN_CHARS
              ? `${MIN_CHARS - charCount} more characters needed`
              : "Looking good!"}
          </span>
          <span
            className={`text-sm ${
              charCount > MAX_CHARS * 0.9 ? "text-[#9D162E]" : "text-[#525252]"
            }`}
          >
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </div>
    </OnboardingStep>
  );
}
