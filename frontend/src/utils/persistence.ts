import { BulletPoint } from "../types/BulletPoint";
import { Bin } from "../types/Bin";
import { OnboardingData } from "../types/Onboarding";
import { NarrativeResponse } from "../types/NarrativeAnalysis";

const STORAGE_KEY = "ccd-nbd-progress";
const DEBOUNCE_MS = 300;

export interface PersistedState {
  onboardingData: OnboardingData;
  bullets: BulletPoint[];
  uncategorized: BulletPoint[];
  bins: Bin[];
  totalBullets: number;
  finalParagraph: string;
  aiWord: string | null;
  narrativeStates: Record<string, { status: "success"; data: NarrativeResponse }>;
  completedRoutes: string[];
  intakeStep: number;
  resumeStep: "upload" | "preview";
  lastRoute: string;
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function saveState(state: PersistedState): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage full or unavailable — silently ignore
    }
  }, DEBOUNCE_MS);
}
