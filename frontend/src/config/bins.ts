export interface BinConfig {
  id: string;
  label: string;
  color: string;
  description: string;
}

// Using Dartmouth tertiary colors - should always appear alongside Dartmouth Green
export const BINS: BinConfig[] = [
  {
    id: 'interests',
    label: 'Interests',
    color: '#267ABA', // River Blue
    description: 'What excites and motivates you',
  },
  {
    id: 'skillset',
    label: 'Skill Set',
    color: '#00693E', // Dartmouth Green (primary for emphasis)
    description: 'Technical and professional capabilities',
  },
  {
    id: 'values',
    label: 'Values',
    color: '#8A6996', // Web Violet
    description: 'What matters to you in your work',
  },
  {
    id: 'strengths',
    label: 'Strengths',
    color: '#643C20', // Autumn Brown
    description: 'What you excel at naturally',
  },
];
