import { useState } from "react";
import { countWords, formatWordLabel } from "../../utils/wordCount";
import { useTypingAnimation } from "../../hooks/useTypingAnimation";

interface Props {
  value: string;
  previousResponse: string;
  onComplete: (value: string) => void;
  onBack: () => void;
}

const REQUIRED_WORDS = 1;

const TITLE = "Defining Word";
const SUBTITLE =
  "Choose one meaningful word that captures the motivation running through your sentence.";

export default function WordStep({
  value,
  previousResponse,
  onComplete,
  onBack,
}: Props) {
  const [text, setText] = useState(value);
  const {
    visibleTitle,
    visibleSubtitle,
    showTitleCursor,
    showSubtitleCursor,
    contentVisible,
  } = useTypingAnimation(TITLE, SUBTITLE);

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
    <div className="min-h-[100dvh] bg-[#469B57] flex flex-col px-6 md:px-10 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">03</p>
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
          {previousResponse && (
            <div className="w-full mb-4 bg-white/20 rounded-xl px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-white/60 mb-1">Your sentence</p>
              <p className="text-sm text-white/90 leading-relaxed">{previousResponse}</p>
            </div>
          )}

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
            <p className="text-sm text-white/70 mt-2">{getErrorMessage()}</p>
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
