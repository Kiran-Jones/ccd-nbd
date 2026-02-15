import { useState } from "react";
import { countWords, formatWordLabel } from "../../utils/wordCount";

interface Props {
  value: string;
  onComplete: (value: string) => void;
  onBack: () => void;
}

const REQUIRED_WORDS = 1;

export default function WordStep({
  value,
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
    if (text.length === 0) return "";
    if (wordCount !== REQUIRED_WORDS) return "Please enter exactly one word";
    if (!isLettersOnly) return "Letters only, please";
    return "Perfect!";
  };

  const hasError =
    text.length > 0 && (!isLettersOnly || wordCount !== REQUIRED_WORDS);

  return (
    <div className="min-h-[100dvh] bg-[#8BD89A] flex flex-col px-6 md:px-10 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">03</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-[#003D1C] mb-2 text-center uppercase">
          Defining Word
        </h2>
        <p className="text-[#003D1C]/70 text-sm md:text-base mb-6 text-center">
          Choose one meaningful word that captures the motivation running through your sentence.
        </p>

        <div className="relative w-full">
          <input
            id="word-input"
            type="text"
            value={text}
            onChange={handleChange}
            placeholder="Curiosity"
            className={`
              w-full px-4 py-3 rounded-xl
              bg-white/80 text-base font-sans text-[#262626]
              placeholder:text-[#A3A3A3]
              focus:outline-none focus:ring-2 focus:ring-[#469B57]/30
              transition-colors duration-200
              border-0
            `}
          />
          <span
            className={`absolute top-1/2 -translate-y-1/2 right-4 text-sm ${
              hasError ? "text-[#9D162E]" : "text-[#525252]/60"
            }`}
          >
            {formatWordLabel(wordCount)}/{REQUIRED_WORDS}
          </span>
        </div>

        {hasError && (
          <p className="text-sm text-[#9D162E] mt-2">{getErrorMessage()}</p>
        )}
        {text.length > 0 && !hasError && (
          <p className="text-sm text-[#003D1C]/70 mt-2">{getErrorMessage()}</p>
        )}

        <button
          onClick={() => onComplete(text)}
          disabled={!isValid}
          className="mt-8 px-10 py-3 bg-[#469B57] text-white uppercase tracking-[0.16em] text-sm md:text-base font-medium rounded-xl hover:bg-[#3F8F50] active:bg-[#357A44] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
