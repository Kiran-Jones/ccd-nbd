import { useState } from 'react';
import OnboardingStep from './OnboardingStep';
import CareerValueAutocomplete from './CareerValueAutocomplete';
import { CAREER_VALUES } from '../../config/careerValues';

interface Props {
  value: string;
  onComplete: (value: string) => void;
  onBack: () => void;
}

export default function CareerValueStep({ value, onComplete, onBack }: Props) {
  const [selectedValue, setSelectedValue] = useState(value);

  const isValid = CAREER_VALUES.includes(
    selectedValue as (typeof CAREER_VALUES)[number]
  );

  return (
    <OnboardingStep
      title="What Matters Most"
      subtitle="Choose the career value that resonates most strongly with who you are."
      onContinue={() => onComplete(selectedValue)}
      onBack={onBack}
      canContinue={isValid}
      stepNumber={4}
      totalSteps={4}
    >
      <div>
        <CareerValueAutocomplete value={selectedValue} onChange={setSelectedValue} />
        <p className="mt-4 text-sm text-[#525252]">
          Choose from {CAREER_VALUES.length} career values that reflect what's
          important to you in your professional life.
        </p>
      </div>
    </OnboardingStep>
  );
}
