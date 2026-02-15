import { useState } from "react";
import { countWords, formatWordLabel } from "../../utils/wordCount";
import { useTypingAnimation } from "../../hooks/useTypingAnimation";

interface Props {
  value: string;
  onComplete: (value: string) => void;
  onBack: () => void;
}

const MIN_WORDS = 40;
const MAX_WORDS = 180;

const TITLE = "Spoken Introduction";
const SUBTITLE =
  "Imagine you are introducing yourself out loud for about 90 seconds. Write one short paragraph in your natural voice, not a polished script.";

export default function ParagraphStep({ value, onComplete, onBack }: Props) {
  const [text, setText] = useState(value);
  const {
    visibleTitle,
    visibleSubtitle,
    showTitleCursor,
    showSubtitleCursor,
    contentVisible,
  } = useTypingAnimation(TITLE, SUBTITLE);

  const wordCount = countWords(text);
  const isValid = wordCount >= MIN_WORDS && wordCount <= MAX_WORDS;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (countWords(newValue) <= MAX_WORDS) {
      setText(newValue);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#469B57] flex flex-col px-6 md:px-10 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">01</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <h2 className="sr-only">{TITLE}</h2>
        <p
          aria-hidden="true"
          className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-white mb-2 text-center uppercase"
        >
          {visibleTitle}
          {showTitleCursor && <span className="typing-cursor-light" />}
        </p>

        <div className="relative mb-6 text-center w-full">
          <p className="text-white text-sm md:text-base invisible">
            {SUBTITLE}
          </p>
          <p className="sr-only">{SUBTITLE}</p>
          <p
            aria-hidden="true"
            className="absolute inset-0 text-white text-sm md:text-base text-center"
          >
            {visibleSubtitle}
            {showSubtitleCursor && <span className="typing-cursor-light" />}
          </p>
        </div>

        <div
          className={`transition-opacity duration-500 w-full flex flex-col items-center ${contentVisible ? "opacity-100" : "opacity-0"}`}
          {...(!contentVisible && { inert: "" as unknown as string })}
        >
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
            className="mt-8 px-10 py-3 bg-[#366946] text-white uppercase tracking-[0.16em] text-sm md:text-base font-medium rounded-xl hover:bg-[#2E5A3C] active:bg-[#264D33] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        </div>
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
