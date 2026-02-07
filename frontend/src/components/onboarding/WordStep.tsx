import { useState } from 'react';
import OnboardingStep from './OnboardingStep';
import { countWords, formatWordLabel } from '../../utils/wordCount';

interface Props {
  value: string;
  sentenceContext: string;
  onComplete: (value: string) => void;
  onBack: () => void;
}

const REQUIRED_WORDS = 1;

export default function WordStep({
  value,
  sentenceContext,
  onComplete,
  onBack,
}: Props) {
  const [text, setText] = useState(value);

  const wordCount = countWords(text);
  const isLettersOnly = /^[a-zA-Z]+$/.test(text);
  const isValid = wordCount === REQUIRED_WORDS && isLettersOnly;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const getErrorMessage = () => {
    if (text.length === 0) return '';
    if (wordCount !== REQUIRED_WORDS) return 'Please enter exactly one word';
    if (!isLettersOnly) return 'Letters only, please';
    return 'Perfect!';
  };

  const hasError = text.length > 0 && (!isLettersOnly || wordCount !== REQUIRED_WORDS);

  return (
    <OnboardingStep
      title="Name The Thread"
      subtitle="Choose one meaningful word that captures the motivation running through your sentence."
      onContinue={() => onComplete(text)}
      onBack={onBack}
      canContinue={isValid}
      stepNumber={5}
      totalSteps={7}
    >
      <div>
        {sentenceContext.trim().length > 0 && (
          <div className="mb-6 p-4 rounded border border-[#E5E5E5] bg-[#F5F5F5]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#525252] mb-2">
              Your submitted sentence
            </p>
            <p className="text-sm text-[#404040] leading-relaxed whitespace-pre-wrap">
              {sentenceContext}
            </p>
          </div>
        )}
        <label
          htmlFor="word-input"
          className="block text-sm font-semibold text-[#404040] mb-2"
        >
          Your central word
        </label>
        <p className="text-sm text-[#525252] mb-2">
          Pick a motivating word, not a job title or broad trait.
        </p>
        <input
          id="word-input"
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Curiosity"
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
            {formatWordLabel(wordCount)}/{REQUIRED_WORDS}
          </span>
        </div>
      </div>
    </OnboardingStep>
  );
}
