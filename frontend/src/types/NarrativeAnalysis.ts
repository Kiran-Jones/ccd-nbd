export interface ExperienceSuggestion {
  original: string;
  category: string;
  alignment: "strong" | "moderate" | "weak";
  reframe: string | null;
  explanation: string;
}

export interface NarrativeResponse {
  paragraph: string;
  bullets: string[];
  experienceSuggestions: ExperienceSuggestion[];
}
