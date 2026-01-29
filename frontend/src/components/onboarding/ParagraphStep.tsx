import { useState } from "react";
import OnboardingStep from "./OnboardingStep";

interface Props {
  value: string;
  onComplete: (value: string) => void;
}

const MIN_CHARS = 50;
const MAX_CHARS = 1200;

export default function ParagraphStep({ value, onComplete }: Props) {
  const [text, setText] = useState(value);

  const charCount = text.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHARS) {
      setText(newValue);
    }
  };

  return (
    <OnboardingStep
      title="Tell Us About Yourself"
      subtitle="Write a brief paragraph describing who you are professionally and what drives you."
      onContinue={() => onComplete(text)}
      canContinue={isValid}
      stepNumber={1}
      totalSteps={4}
    >
      <div>
        <label
          htmlFor="paragraph-input"
          className="block text-sm font-semibold text-[#404040] mb-2"
        >
          Your professional story
        </label>
        <textarea
          id="paragraph-input"
          value={text}
          onChange={handleChange}
          placeholder="I am a professional who..."
          rows={6}
          className={`
            w-full px-4 py-3 rounded
            border text-base font-sans
            placeholder:text-[#A3A3A3]
            focus:outline-none focus:ring-2 focus:ring-[#00693E]/10
            transition-colors duration-200
            resize-none
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
