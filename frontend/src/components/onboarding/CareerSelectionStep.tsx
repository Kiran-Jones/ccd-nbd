import { useState } from "react";
import MultiSelectAutocomplete from "./MultiSelectAutocomplete";
import { useTypingAnimation } from "../../hooks/useTypingAnimation";

interface Props {
  stepNumber: string;
  title: string;
  subtitle: string;
  label: string;
  inputId: string;
  options: readonly string[];
  values: string[];
  onChange: (values: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function CareerSelectionStep({
  stepNumber,
  title,
  subtitle,
  label,
  inputId,
  options,
  values,
  onChange,
  onContinue,
  onBack,
}: Props) {
  const [selected, setSelected] = useState(values);
  const {
    visibleTitle,
    visibleSubtitle,
    showTitleCursor,
    showSubtitleCursor,
    contentVisible,
  } = useTypingAnimation(title, subtitle);

  const handleChange = (newValues: string[]) => {
    setSelected(newValues);
    onChange(newValues);
  };

  return (
    <div className="min-h-[100dvh] bg-[#469B57] flex flex-col px-6 md:px-10 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">
          {stepNumber}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <h2 className="sr-only">{title}</h2>
        <p
          aria-hidden="true"
          className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-white mb-2 text-center uppercase"
        >
          {visibleTitle}
          {showTitleCursor && <span className="typing-cursor-light" />}
        </p>

        <div className="relative mb-6 text-center w-full">
          <p className="text-white text-sm md:text-base invisible">
            {subtitle}
          </p>
          <p className="sr-only">{subtitle}</p>
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
          <div className="w-full bg-white/80 rounded-xl p-4">
            <MultiSelectAutocomplete
              label={label}
              inputId={inputId}
              options={options}
              values={selected}
              maxSelections={2}
              noMatchText={`No matching ${title.toLowerCase()} found`}
              placeholderAtLimit={`You have selected 2 ${title.toLowerCase()}`}
              onChange={handleChange}
            />
          </div>

          <p className="text-sm text-white/70 mt-3">
            {selected.length} of 2 selected
          </p>

          <button
            onClick={onContinue}
            disabled={selected.length !== 2}
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
