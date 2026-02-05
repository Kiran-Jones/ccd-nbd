import { useState } from 'react';
import OnboardingStep from './OnboardingStep';
import MultiSelectAutocomplete from './MultiSelectAutocomplete';
import { CAREER_VALUES } from '../../config/careerValues';
import { CAREER_SKILLS } from '../../config/careerSkills';
import { CAREER_STRENGTHS } from '../../config/careerStrengths';

interface Props {
  values: string[];
  skills: string[];
  strengths: string[];
  onComplete: (payload: {
    careerValues: string[];
    careerSkills: string[];
    careerStrengths: string[];
  }) => void;
  onBack: () => void;
}

export default function CareerValueStep({
  values,
  skills,
  strengths,
  onComplete,
  onBack,
}: Props) {
  const [selectedValues, setSelectedValues] = useState(values);
  const [selectedSkills, setSelectedSkills] = useState(skills);
  const [selectedStrengths, setSelectedStrengths] = useState(strengths);

  const isValid =
    selectedValues.length === 2 &&
    selectedSkills.length === 2 &&
    selectedStrengths.length === 2;

  return (
    <OnboardingStep
      title="What Matters Most"
      subtitle="Select exactly two values, skills, and strengths that resonate most strongly with who you are."
      onContinue={() =>
        onComplete({
          careerValues: selectedValues,
          careerSkills: selectedSkills,
          careerStrengths: selectedStrengths,
        })
      }
      onBack={onBack}
      canContinue={isValid}
      stepNumber={4}
      totalSteps={5}
    >
      <div className="space-y-8">
        <div>
          <MultiSelectAutocomplete
            label="Select your top career values"
            inputId="career-values-input"
            options={CAREER_VALUES}
            values={selectedValues}
            maxSelections={2}
            noMatchText="No matching career values found"
            placeholderAtLimit="You have selected 2 values"
            onChange={setSelectedValues}
          />
          <p className="mt-4 text-sm text-[#525252]">
            Choose from {CAREER_VALUES.length} career values that reflect what's
            important to you in your professional life. Select exactly 2 values
            in the order that feels most true to you.
          </p>
        </div>

        <div>
          <MultiSelectAutocomplete
            label="Select your top career skills"
            inputId="career-skills-input"
            options={CAREER_SKILLS}
            values={selectedSkills}
            maxSelections={2}
            noMatchText="No matching career skills found"
            placeholderAtLimit="You have selected 2 skills"
            onChange={setSelectedSkills}
          />
          <p className="mt-4 text-sm text-[#525252]">
            Choose from {CAREER_SKILLS.length} career skills that describe how
            you like to contribute. Select exactly 2 skills that feel most true.
          </p>
        </div>

        <div>
          <MultiSelectAutocomplete
            label="Select your top career strengths"
            inputId="career-strengths-input"
            options={CAREER_STRENGTHS}
            values={selectedStrengths}
            maxSelections={2}
            noMatchText="No matching career strengths found"
            placeholderAtLimit="You have selected 2 strengths"
            onChange={setSelectedStrengths}
          />
          <p className="mt-4 text-sm text-[#525252]">
            Choose from {CAREER_STRENGTHS.length} career strengths that show how
            you naturally operate. Select exactly 2 strengths that best fit you.
          </p>
        </div>
      </div>
    </OnboardingStep>
  );
}
