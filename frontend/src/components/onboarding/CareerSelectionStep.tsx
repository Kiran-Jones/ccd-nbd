import { useState } from "react";
import MultiSelectAutocomplete from "./MultiSelectAutocomplete";

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

  const handleChange = (newValues: string[]) => {
    setSelected(newValues);
    onChange(newValues);
  };

  return (
    <div className="min-h-[100dvh] bg-[#92D79F] flex flex-col px-6 md:px-10 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">
          {stepNumber}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-[#003D1C] mb-2 text-center uppercase">
          {title}
        </h2>
        <p className="text-[#003D1C]/70 text-sm md:text-base mb-6 text-center">
          {subtitle}
        </p>

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

        <p className="text-sm text-[#003D1C]/70 mt-3">
          {selected.length} of 2 selected
        </p>

        <button
          onClick={onContinue}
          disabled={selected.length !== 2}
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
