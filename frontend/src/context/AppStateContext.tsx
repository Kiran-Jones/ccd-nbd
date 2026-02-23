import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { BulletPoint } from "../types/BulletPoint";
import { Bin } from "../types/Bin";
import { AnalysisResult, Distribution } from "../types/Analytics";
import { OnboardingData } from "../types/Onboarding";
import { NarrativeResponse } from "../types/NarrativeAnalysis";
import { BINS } from "../config/bins";
import {
  exportJSON,
  exportPDF,
  downloadBlob,
  generateNarrative,
  generateFinalWord,
  pingHealth,
} from "../services/api";
import { saveState, loadState, clearState, PersistedState } from "../utils/persistence";

export type NarrativeState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: NarrativeResponse }
  | { status: "error"; message: string };

type AiWordState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; word: string }
  | { status: "error" };

const DEFAULT_ONBOARDING: OnboardingData = {
  paragraph: "",
  sentence: "",
  word: "",
  careerValues: [],
  careerSkills: [],
  careerStrengths: [],
  finalWord: "",
};

const EMPTY_BINS = () => BINS.map((config) => ({ ...config, bullets: [] }));

interface AppStateContextValue {
  // Core data
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  bullets: BulletPoint[];
  setBullets: React.Dispatch<React.SetStateAction<BulletPoint[]>>;
  uncategorized: BulletPoint[];
  setUncategorized: React.Dispatch<React.SetStateAction<BulletPoint[]>>;
  bins: Bin[];
  setBins: React.Dispatch<React.SetStateAction<Bin[]>>;
  totalBullets: number;
  setTotalBullets: React.Dispatch<React.SetStateAction<number>>;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;
  finalParagraph: string;
  setFinalParagraph: React.Dispatch<React.SetStateAction<string>>;
  narrativeStates: Record<string, NarrativeState>;
  setNarrativeStates: React.Dispatch<React.SetStateAction<Record<string, NarrativeState>>>;
  aiWordState: AiWordState;
  setAiWordState: React.Dispatch<React.SetStateAction<AiWordState>>;
  uploadedFile: File | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>;
  exporting: "json" | "pdf" | null;

  // Route tracking
  completedRoutes: string[];
  markRouteCompleted: (route: string) => void;
  intakeStep: number;
  setIntakeStep: React.Dispatch<React.SetStateAction<number>>;
  resumeStep: "upload" | "preview";
  setResumeStep: React.Dispatch<React.SetStateAction<"upload" | "preview">>;

  // Helpers
  handleFileUploaded: (extractedBullets: BulletPoint[], file: File) => void;
  handlePreviewConfirmed: (editedBullets: BulletPoint[]) => void;
  handleCategorizationComplete: () => void;
  handleFinalWordComplete: (word: string) => void;
  fetchNarratives: (result: AnalysisResult) => Promise<void>;
  handleNarrativeRetry: (value: string) => void;
  handleExportJSON: () => Promise<void>;
  handleExportPDF: () => Promise<void>;
  resetAll: () => void;
  wakeBackend: () => void;

  // Celebration
  showCelebrationBurst: boolean;
  setShowCelebrationBurst: React.Dispatch<React.SetStateAction<boolean>>;

  // Constants
  MIN_FINAL_PARAGRAPH_WORDS: number;
  MAX_FINAL_PARAGRAPH_WORDS: number;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const persisted = useRef(loadState());

  const [onboardingData, setOnboardingData] = useState<OnboardingData>(
    persisted.current?.onboardingData ?? DEFAULT_ONBOARDING,
  );
  const [bullets, setBullets] = useState<BulletPoint[]>(
    persisted.current?.bullets ?? [],
  );
  const [uncategorized, setUncategorized] = useState<BulletPoint[]>(
    persisted.current?.uncategorized ?? [],
  );
  const [bins, setBins] = useState<Bin[]>(
    persisted.current?.bins ?? EMPTY_BINS(),
  );
  const [totalBullets, setTotalBullets] = useState(
    persisted.current?.totalBullets ?? 0,
  );
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [finalParagraph, setFinalParagraph] = useState(
    persisted.current?.finalParagraph ?? "",
  );
  const [narrativeStates, setNarrativeStates] = useState<Record<string, NarrativeState>>(() => {
    const saved = persisted.current?.narrativeStates;
    if (saved) {
      const restored: Record<string, NarrativeState> = {};
      for (const [key, val] of Object.entries(saved)) {
        restored[key] = { status: "success", data: val.data };
      }
      return restored;
    }
    return {};
  });
  const [aiWordState, setAiWordState] = useState<AiWordState>(() => {
    const w = persisted.current?.aiWord;
    if (w) return { status: "success", word: w };
    return { status: "idle" };
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [exporting, setExporting] = useState<"json" | "pdf" | null>(null);
  const [completedRoutes, setCompletedRoutes] = useState<string[]>(
    persisted.current?.completedRoutes ?? [],
  );
  const [intakeStep, setIntakeStep] = useState(
    persisted.current?.intakeStep ?? 0,
  );
  const [resumeStep, setResumeStep] = useState<"upload" | "preview">(
    persisted.current?.resumeStep ?? "upload",
  );
  const [showCelebrationBurst, setShowCelebrationBurst] = useState(false);

  const hasWokenBackend = useRef(false);
  const MIN_FINAL_PARAGRAPH_WORDS = 40;
  const MAX_FINAL_PARAGRAPH_WORDS = 180;

  // Reconstruct analysisResult from persisted bins on mount
  useEffect(() => {
    if (persisted.current && persisted.current.bins.some((b) => b.bullets.length > 0)) {
      const analytics = calculateAnalytics(persisted.current.bins);
      setAnalysisResult({
        bins: persisted.current.bins,
        analytics,
        timestamp: new Date().toISOString(),
        onboardingData: persisted.current.onboardingData,
      });
    }
  }, []);

  // Persist state on changes
  useEffect(() => {
    const successNarratives: Record<string, { status: "success"; data: NarrativeResponse }> = {};
    for (const [key, val] of Object.entries(narrativeStates)) {
      if (val.status === "success") {
        successNarratives[key] = val;
      }
    }
    const state: PersistedState = {
      onboardingData,
      bullets,
      uncategorized,
      bins,
      totalBullets,
      finalParagraph,
      aiWord: aiWordState.status === "success" ? aiWordState.word : null,
      narrativeStates: successNarratives,
      completedRoutes,
      intakeStep,
      resumeStep,
      lastRoute: window.location.pathname,
    };
    saveState(state);
  }, [
    onboardingData, bullets, uncategorized, bins, totalBullets,
    finalParagraph, aiWordState, narrativeStates, completedRoutes,
    intakeStep, resumeStep,
  ]);

  const markRouteCompleted = useCallback((route: string) => {
    setCompletedRoutes((prev) =>
      prev.includes(route) ? prev : [...prev, route],
    );
  }, []);

  const calculateAnalytics = (binsData: Bin[]) => {
    const total = binsData.reduce((sum, bin) => sum + bin.bullets.length, 0);
    const distribution: Distribution[] = binsData.map((bin) => ({
      bin_id: bin.id,
      count: bin.bullets.length,
      percentage:
        total > 0
          ? Math.round((bin.bullets.length / total) * 100 * 10) / 10
          : 0,
    }));
    const topBin = binsData.reduce((max, bin) =>
      bin.bullets.length > max.bullets.length ? bin : max,
    );
    const suggestions = generateSuggestions(distribution, binsData);
    return { distribution, top_category: topBin.label, suggestions };
  };

  const generateSuggestions = (distribution: Distribution[], binsData: Bin[]) => {
    const suggestions: string[] = [];
    distribution.forEach((dist) => {
      const bin = binsData.find((b) => b.id === dist.bin_id);
      if (!bin) return;
      if (dist.percentage < 15 && dist.count > 0) {
        suggestions.push(`Consider adding more bullets to '${bin.label}' to provide a fuller picture`);
      } else if (dist.percentage > 40) {
        suggestions.push(`Strong emphasis on '${bin.label}' - this is a key part of your profile!`);
      } else if (dist.count === 0) {
        suggestions.push(`No bullets in '${bin.label}' - reflect on experiences that fit this category`);
      }
    });
    if (distribution.filter((d) => d.count > 0).length === binsData.length) {
      suggestions.push("Well-balanced profile across all categories!");
    }
    return suggestions.slice(0, 5);
  };

  const fetchNarratives = useCallback(async (result: AnalysisResult) => {
    const values = result.onboardingData?.careerValues ?? [];
    if (values.length === 0) {
      setNarrativeStates({});
      return;
    }
    setNarrativeStates((prev) => {
      const updated: Record<string, NarrativeState> = { ...prev };
      values.forEach((value) => { updated[value] = { status: "loading" }; });
      return updated;
    });
    await Promise.allSettled(
      values.map(async (value) => {
        try {
          const narrative = await generateNarrative(result, value);
          setNarrativeStates((prev) => ({
            ...prev,
            [value]: { status: "success", data: narrative },
          }));
        } catch (error) {
          let message = "Unable to generate narrative analysis. Please try again.";
          if (error && typeof error === "object" && "response" in error) {
            const axiosError = error as { response?: { data?: { detail?: string } } };
            if (axiosError.response?.data?.detail) {
              message = axiosError.response.data.detail;
            }
          }
          console.error("Narrative generation failed:", error);
          setNarrativeStates((prev) => ({
            ...prev,
            [value]: { status: "error", message },
          }));
        }
      }),
    );
  }, []);

  const handleFileUploaded = useCallback((extractedBullets: BulletPoint[], file: File) => {
    setBullets(extractedBullets);
    setUploadedFile(file);
    setResumeStep("preview");
  }, []);

  const handlePreviewConfirmed = useCallback((editedBullets: BulletPoint[]) => {
    setUncategorized(editedBullets);
    setTotalBullets(editedBullets.length);
    if (editedBullets.length > 0) {
      setAiWordState({ status: "loading" });
      generateFinalWord(editedBullets.map((b) => b.text))
        .then((result) => setAiWordState({ status: "success", word: result.word }))
        .catch(() => setAiWordState({ status: "error" }));
    } else {
      setAiWordState({ status: "error" });
    }
  }, []);

  const handleCategorizationComplete = useCallback(() => {
    const analytics = calculateAnalytics(bins);
    const result: AnalysisResult = {
      bins,
      analytics,
      timestamp: new Date().toISOString(),
      onboardingData,
    };
    setAnalysisResult(result);
    setNarrativeStates({});
    return result;
  }, [bins, onboardingData]);

  const handleFinalWordComplete = useCallback((word: string) => {
    const updatedOnboarding = { ...onboardingData, finalWord: word };
    setOnboardingData(updatedOnboarding);
    if (analysisResult) {
      const result = { ...analysisResult, onboardingData: updatedOnboarding };
      setAnalysisResult(result);
      fetchNarratives(result);
    }
  }, [onboardingData, analysisResult, fetchNarratives]);

  const handleNarrativeRetry = useCallback((value: string) => {
    if (analysisResult) {
      const baseOnboarding = analysisResult.onboardingData ?? DEFAULT_ONBOARDING;
      fetchNarratives({
        ...analysisResult,
        onboardingData: { ...baseOnboarding, careerValues: [value] },
      });
    }
  }, [analysisResult, fetchNarratives]);

  const handleExportJSON = useCallback(async () => {
    if (!analysisResult) return;
    setExporting("json");
    try {
      const blob = await exportJSON(analysisResult);
      downloadBlob(blob, `career_analysis_${new Date().toISOString().split("T")[0]}.json`);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(null);
    }
  }, [analysisResult]);

  const handleExportPDF = useCallback(async () => {
    if (!analysisResult) return;
    setExporting("pdf");
    try {
      const blob = await exportPDF(analysisResult);
      downloadBlob(blob, `career_analysis_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(null);
    }
  }, [analysisResult]);

  const resetAll = useCallback(() => {
    clearState();
    setOnboardingData(DEFAULT_ONBOARDING);
    setBullets([]);
    setUncategorized([]);
    setBins(EMPTY_BINS());
    setAnalysisResult(null);
    setTotalBullets(0);
    setUploadedFile(null);
    setNarrativeStates({});
    setAiWordState({ status: "idle" });
    setFinalParagraph("");
    setCompletedRoutes([]);
    setIntakeStep(0);
    setResumeStep("upload");
    setShowCelebrationBurst(false);
  }, []);

  // Wake backend on first onboarding interaction
  const wakeBackend = useCallback(() => {
    if (!hasWokenBackend.current) {
      hasWokenBackend.current = true;
      pingHealth();
    }
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        onboardingData, setOnboardingData,
        bullets, setBullets,
        uncategorized, setUncategorized,
        bins, setBins,
        totalBullets, setTotalBullets,
        analysisResult, setAnalysisResult,
        finalParagraph, setFinalParagraph,
        narrativeStates, setNarrativeStates,
        aiWordState, setAiWordState,
        uploadedFile, setUploadedFile,
        exporting,
        completedRoutes, markRouteCompleted,
        intakeStep, setIntakeStep,
        resumeStep, setResumeStep,
        handleFileUploaded, handlePreviewConfirmed,
        handleCategorizationComplete, handleFinalWordComplete,
        fetchNarratives, handleNarrativeRetry,
        handleExportJSON, handleExportPDF,
        resetAll, wakeBackend,
        showCelebrationBurst, setShowCelebrationBurst,
        MIN_FINAL_PARAGRAPH_WORDS, MAX_FINAL_PARAGRAPH_WORDS,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
