import { useState } from 'react';
import OnboardingStep from './OnboardingStep';
import CareerValueAutocomplete from './CareerValueAutocomplete';
import { CAREER_VALUES } from '../../config/careerValues';

interface Props {
  values: string[];
  onComplete: (values: string[]) => void;
  onBack: () => void;
}

export default function CareerValueStep({ values, onComplete, onBack }: Props) {
  const [selectedValues, setSelectedValues] = useState(values);

  const isValid = selectedValues.length > 0;

  return (
    <OnboardingStep
      title="What Matters Most"
      subtitle="Choose up to three career values that resonate most strongly with who you are."
      onContinue={() => onComplete(selectedValues)}
      onBack={onBack}
      canContinue={isValid}
      stepNumber={4}
      totalSteps={4}
    >
      <div>
        <CareerValueAutocomplete values={selectedValues} onChange={setSelectedValues} />
        <p className="mt-4 text-sm text-[#525252]">
          Choose from {CAREER_VALUES.length} career values that reflect what's
          important to you in your professional life. Select 1-3 values in the
          order that feels most true to you.
        </p>
      </div>
    </OnboardingStep>
  );
}
