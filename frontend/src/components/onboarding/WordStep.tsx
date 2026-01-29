import { useState } from 'react';
import OnboardingStep from './OnboardingStep';

interface Props {
  value: string;
  onComplete: (value: string) => void;
  onBack: () => void;
}

const MIN_CHARS = 2;
const MAX_CHARS = 30;

export default function WordStep({ value, onComplete, onBack }: Props) {
  const [text, setText] = useState(value);

  const charCount = text.length;
  const isLettersOnly = /^[a-zA-Z]+$/.test(text);
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS && isLettersOnly;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHARS) {
      setText(newValue);
    }
  };

  const getErrorMessage = () => {
    if (charCount === 0) return '';
    if (!isLettersOnly && charCount > 0) return 'Letters only, please';
    if (charCount < MIN_CHARS) return `${MIN_CHARS - charCount} more characters needed`;
    return 'Perfect!';
  };

  const hasError = charCount > 0 && (!isLettersOnly || charCount < MIN_CHARS);

  return (
    <OnboardingStep
      title="One Word"
      subtitle="If you could describe yourself in a single word, what would it be?"
      onContinue={() => onComplete(text)}
      onBack={onBack}
      canContinue={isValid}
      stepNumber={3}
      totalSteps={4}
    >
      <div>
        <label
          htmlFor="word-input"
          className="block text-sm font-semibold text-[#404040] mb-2"
        >
          Your defining word
        </label>
        <input
          id="word-input"
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Creative"
          className={`
            w-full px-4 py-3 rounded
            border text-base font-sans
            placeholder:text-[#A3A3A3]
            focus:outline-none focus:ring-2 focus:ring-[#00693E]/10
            transition-colors duration-200
            ${hasError ? 'border-[#9D162E] focus:border-[#9D162E]' : 'border-[#D4D4D4] focus:border-[#00693E]'}
          `}
        />
        <div className="flex justify-between mt-2">
          <span className={`text-sm ${hasError ? 'text-[#9D162E]' : 'text-[#525252]'}`}>
            {getErrorMessage()}
          </span>
          <span className="text-sm text-[#525252]">
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </div>
    </OnboardingStep>
  );
}
