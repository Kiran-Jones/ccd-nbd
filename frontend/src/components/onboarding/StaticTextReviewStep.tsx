import OnboardingStep from "./OnboardingStep";
import { countWords, formatWordLabel } from "../../utils/wordCount";

interface Props {
  title: string;
  subtitle: string;
  label: string;
  value: string;
  onContinue: () => void;
  onBack: () => void;
  stepNumber: number;
  totalSteps: number;
}

export default function StaticTextReviewStep({
  title,
  subtitle,
  label,
  value,
  onContinue,
  onBack,
  stepNumber,
  totalSteps,
}: Props) {
  const wordCount = countWords(value);

  return (
    <OnboardingStep
      title={title}
      subtitle={subtitle}
      onContinue={onContinue}
      onBack={onBack}
      canContinue={true}
      stepNumber={stepNumber}
      totalSteps={totalSteps}
    >
      <div>
        <p className="block text-sm font-semibold text-[#404040] mb-2">{label}</p>
        <div className="w-full px-4 py-3 rounded border border-[#D4D4D4] bg-[#F5F5F5] min-h-24">
          <p className="text-base font-sans text-[#262626] whitespace-pre-wrap break-words">
            {value}
          </p>
        </div>
        <div className="flex justify-end mt-2">
          <span className="text-sm text-[#525252]">{formatWordLabel(wordCount)}</span>
        </div>
      </div>
    </OnboardingStep>
  );
}
