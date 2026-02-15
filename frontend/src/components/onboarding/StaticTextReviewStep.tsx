import { countWords, formatWordLabel } from "../../utils/wordCount";

interface Props {
  sectionNumber: number;
  value: string;
  onContinue: () => void;
  onBack: () => void;
}

const SECTION_LABELS: Record<number, string> = {
  1: "01",
  2: "02",
  3: "03",
};

export default function StaticTextReviewStep({
  sectionNumber,
  value,
  onContinue,
  onBack,
}: Props) {
  const wordCount = countWords(value);
  const displayNumber = SECTION_LABELS[sectionNumber] ?? `0${sectionNumber}`;

  return (
    <div className="min-h-[100dvh] bg-[#92D79F] flex flex-col px-6 md:px-10 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">
          {displayNumber}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-[#003D1C] mb-2 text-center uppercase">
          Review
        </h2>
        <p className="text-[#003D1C]/70 text-sm md:text-base mb-6 text-center">
          Review your response before moving to the next step.
        </p>

        <div className="relative w-full">
          <div className="w-full px-4 py-3 rounded-xl bg-white/80 min-h-24">
            <p className="text-base font-sans text-[#262626] whitespace-pre-wrap break-words">
              {value}
            </p>
          </div>
          <span className="absolute bottom-3 right-4 text-sm text-[#525252]/60">
            {formatWordLabel(wordCount)}
          </span>
        </div>

        <button
          onClick={onContinue}
          className="mt-8 px-10 py-3 bg-[#469B57] text-white uppercase tracking-[0.16em] text-sm md:text-base font-medium rounded-xl hover:bg-[#3F8F50] active:bg-[#357A44] transition-colors"
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
