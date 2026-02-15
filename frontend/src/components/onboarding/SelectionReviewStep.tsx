interface Props {
  values: string[];
  strengths: string[];
  skills: string[];
  onContinue: () => void;
  onBack: () => void;
}

export default function SelectionReviewStep({
  values,
  strengths,
  skills,
  onContinue,
  onBack,
}: Props) {
  return (
    <div className="min-h-[100dvh] bg-[#469B57] flex flex-col px-6 md:px-10 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">04</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-white mb-2 text-center uppercase">
          Review
        </h2>
        <p className="text-white text-sm md:text-base mb-8 text-center">
          Review your selections before moving to the next step.
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-lg md:text-xl font-medium text-white uppercase tracking-wider mb-4 text-center">
              Values
            </p>
            <div className="bg-[#366946] rounded-2xl p-6 space-y-4">
              {values.map((v) => (
                <div
                  key={v}
                  className="bg-white rounded-xl px-6 py-5 text-[#262626] text-lg font-medium text-center"
                >
                  {v}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-lg md:text-xl font-medium text-white uppercase tracking-wider mb-4 text-center">
              Strengths
            </p>
            <div className="bg-[#366946] rounded-2xl p-6 space-y-4">
              {strengths.map((s) => (
                <div
                  key={s}
                  className="bg-white rounded-xl px-6 py-5 text-[#262626] text-lg font-medium text-center"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-lg md:text-xl font-medium text-white uppercase tracking-wider mb-4 text-center">
              Skills
            </p>
            <div className="bg-[#366946] rounded-2xl p-6 space-y-4">
              {skills.map((s) => (
                <div
                  key={s}
                  className="bg-white rounded-xl px-6 py-5 text-[#262626] text-lg font-medium text-center"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="mt-8 px-10 py-3 bg-[#366946] text-white uppercase tracking-[0.16em] text-sm md:text-base font-medium rounded-xl hover:bg-[#2E5A3C] active:bg-[#264D33] transition-colors"
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
