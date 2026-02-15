import { useState } from "react";
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
    <div className="min-h-[100dvh] bg-[#92D79F] flex flex-col px-6 md:px-10 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">01</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-[#003D1C] mb-2 text-center uppercase">
          Spoken Introduction
        </h2>
        <p className="text-[#003D1C]/70 text-sm md:text-base mb-6 text-center">
          Imagine you are introducing yourself out loud for about 90 seconds.
          Write one short paragraph in your natural voice, not a polished script.
        </p>

        <div className="relative w-full">
          <textarea
            id="paragraph-input"
            value={text}
            onChange={handleChange}
            placeholder="If I were introducing myself out loud, I would say..."
            rows={6}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-white/80 text-base font-sans text-[#262626]
              placeholder:text-[#A3A3A3]
              focus:outline-none focus:ring-2 focus:ring-[#469B57]/30
              transition-colors duration-200
              resize-none border-0
            `}
          />
          <span
            className={`absolute bottom-3 right-4 text-sm ${
              wordCount > 0 && wordCount < MIN_WORDS
                ? "text-[#9D162E]"
                : "text-[#525252]/60"
            }`}
          >
            {formatWordLabel(wordCount)}/{MAX_WORDS}
          </span>
        </div>

        {wordCount > 0 && wordCount < MIN_WORDS && (
          <p className="text-sm text-[#9D162E] mt-2">
            {MIN_WORDS - wordCount} more words needed
          </p>
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
