import { ReactNode } from 'react';
import Button from '../common/Button';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  onContinue: () => void;
  onBack?: () => void;
  canContinue: boolean;
  stepNumber: number;
  totalSteps: number;
}

export default function OnboardingStep({
  title,
  subtitle,
  children,
  onContinue,
  onBack,
  canContinue,
  stepNumber,
  totalSteps,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="text-center mb-4">
        <span className="text-sm text-[#525252]">
          Step {stepNumber} of {totalSteps}
        </span>
      </div>

      {/* Title and subtitle */}
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-[#262626] mb-3">
          {title}
        </h2>
        <p className="text-[#525252] text-lg">{subtitle}</p>
      </div>

      {/* Content */}
      <div className="bg-white border border-[#E5E5E5] rounded-md p-8 mb-6">
        {children}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        {onBack ? (
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
        ) : (
          <div />
        )}
        <Button onClick={onContinue} disabled={!canContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
