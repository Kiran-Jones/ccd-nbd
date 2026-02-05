import { CAREER_VALUES } from '../../config/careerValues';
import MultiSelectAutocomplete from './MultiSelectAutocomplete';

interface Props {
  values: string[];
  onChange: (values: string[]) => void;
}

export default function CareerValueAutocomplete({ values, onChange }: Props) {
  return (
    <MultiSelectAutocomplete
      label="Select your top career values"
      inputId="career-value-input"
      options={CAREER_VALUES}
      values={values}
      maxSelections={2}
      noMatchText="No matching career values found"
      placeholderAtLimit="You have selected 2 values"
      onChange={onChange}
    />
  );
}
