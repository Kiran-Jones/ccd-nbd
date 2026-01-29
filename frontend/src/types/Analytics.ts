import { Bin } from './Bin';
import { OnboardingData } from './Onboarding';

export interface Distribution {
  bin_id: string;
  count: number;
  percentage: number;
}

export interface Analytics {
  distribution: Distribution[];
  top_category: string;
  suggestions: string[];
}

export interface AnalysisResult {
  bins: Bin[];
  analytics: Analytics;
  timestamp: string;
  onboardingData?: OnboardingData;
}
