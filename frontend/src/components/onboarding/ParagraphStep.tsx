import { useState } from "react";
import OnboardingStep from "./OnboardingStep";
import { countWords, formatWordLabel } from "../../utils/wordCount";

interface Props {
  value: string;
  onComplete: (value: string) => void;
  onBack: () => void;
}

const MIN_WORDS = 40;
const MAX_WORDS = 180;

export default function ParagraphStep({ value, onComplete, onBack }: Props) {
  const [text, setText] = useState(value);

  const wordCount = countWords(text);
  const isValid = wordCount >= MIN_WORDS && wordCount <= MAX_WORDS;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (countWords(newValue) <= MAX_WORDS) {
      setText(newValue);
    }
  };

  return (
    <OnboardingStep
      title="Start With Your Real Intro"
      subtitle="Imagine you are introducing yourself out loud for about 90 seconds. Write one short paragraph in your natural voice, not a polished script."
      onContinue={() => onComplete(text)}
      onBack={onBack}
      canContinue={isValid}
      stepNumber={1}
      totalSteps={7}
    >
      <div>
        <label
          htmlFor="paragraph-input"
          className="block text-sm font-semibold text-[#404040] mb-2"
        >
          Your spoken-style introduction
        </label>
        <textarea
          id="paragraph-input"
          value={text}
          onChange={handleChange}
          placeholder="If I were introducing myself out loud, I would say..."
          rows={6}
          className={`
            w-full px-4 py-3 rounded
            border text-base font-sans
            placeholder:text-[#A3A3A3]
            focus:outline-none focus:ring-2 focus:ring-[#00693E]/10
            transition-colors duration-200
            resize-none
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
