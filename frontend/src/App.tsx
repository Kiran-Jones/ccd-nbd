import { useEffect, useRef, useState } from "react";
import { BulletPoint } from "./types/BulletPoint";
import { Bin } from "./types/Bin";
import { AnalysisResult, Distribution } from "./types/Analytics";
import { OnboardingData } from "./types/Onboarding";
import { NarrativeResponse } from "./types/NarrativeAnalysis";
import { BINS } from "./config/bins";
import FileUpload from "./components/upload/FileUpload";
import BulletPreview from "./components/upload/BulletPreview";
import BinContainer from "./components/categorization/BinContainer";
import DistributionChart from "./components/summary/DistributionChart";
import BinList from "./components/summary/BinList";
import InsightsPanel from "./components/summary/InsightsPanel";
import NarrativeAnalysisPanel from "./components/summary/NarrativeAnalysisPanel";
import ParagraphStep from "./components/onboarding/ParagraphStep";
import SentenceStep from "./components/onboarding/SentenceStep";
import WordStep from "./components/onboarding/WordStep";
import CareerSelectionStep from "./components/onboarding/CareerSelectionStep";
import { CAREER_VALUES } from "./config/careerValues";
import { CAREER_SKILLS } from "./config/careerSkills";
import { CAREER_STRENGTHS } from "./config/careerStrengths";
import WelcomeStep from "./components/onboarding/WelcomeStep";
import StaticTextReviewStep from "./components/onboarding/StaticTextReviewStep";
import SelectionReviewStep from "./components/onboarding/SelectionReviewStep";
import FinalWordStep from "./components/final-word/FinalWordStep";
import { countWords, formatWordLabel } from "./utils/wordCount";
import {
  exportJSON,
  exportPDF,
  downloadBlob,
  generateNarrative,
  generateFinalWord,
  pingHealth,
} from "./services/api";
import PhaseIndicator from "./components/common/PhaseIndicator";

type NarrativeState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: NarrativeResponse }
  | { status: "error"; message: string };

type AppPhase =
  | "welcome"
  | "paragraph"
  | "paragraphReview"
  | "sentence"
  | "sentenceReview"
  | "word"
  | "wordReview"
  | "careerValue"
  | "careerSkill"
  | "careerStrength"
  | "selectionReview"
  | "upload"
  | "preview"
  | "categorize"
  | "finalWord"
  | "summary"
  | "finalReflection";

const CELEBRATION_CONFETTI = [
  { left: 2, color: "#00693E", delay: 0.0, duration: 2.6, size: 8 },
  { left: 6, color: "#267ABA", delay: 0.2, duration: 2.9, size: 7 },
  { left: 10, color: "#643C20", delay: 0.15, duration: 2.7, size: 9 },
  { left: 14, color: "#8A6996", delay: 0.3, duration: 3.0, size: 8 },
  { left: 18, color: "#FFA00F", delay: 0.1, duration: 2.8, size: 7 },
  { left: 22, color: "#00693E", delay: 0.25, duration: 2.5, size: 9 },
  { left: 26, color: "#267ABA", delay: 0.05, duration: 2.9, size: 8 },
  { left: 30, color: "#643C20", delay: 0.35, duration: 2.7, size: 7 },
  { left: 34, color: "#8A6996", delay: 0.15, duration: 2.8, size: 8 },
  { left: 38, color: "#FFA00F", delay: 0.4, duration: 3.0, size: 9 },
  { left: 42, color: "#00693E", delay: 0.2, duration: 2.6, size: 8 },
  { left: 46, color: "#267ABA", delay: 0.45, duration: 2.8, size: 7 },
  { left: 50, color: "#643C20", delay: 0.1, duration: 2.9, size: 8 },
  { left: 54, color: "#8A6996", delay: 0.35, duration: 2.6, size: 9 },
  { left: 58, color: "#FFA00F", delay: 0.05, duration: 2.7, size: 8 },
  { left: 62, color: "#00693E", delay: 0.25, duration: 2.9, size: 7 },
  { left: 66, color: "#267ABA", delay: 0.15, duration: 2.5, size: 9 },
  { left: 70, color: "#643C20", delay: 0.3, duration: 2.8, size: 8 },
  { left: 74, color: "#8A6996", delay: 0.2, duration: 2.7, size: 7 },
  { left: 78, color: "#FFA00F", delay: 0.4, duration: 2.9, size: 8 },
  { left: 82, color: "#00693E", delay: 0.1, duration: 2.6, size: 9 },
  { left: 86, color: "#267ABA", delay: 0.35, duration: 2.8, size: 8 },
  { left: 90, color: "#643C20", delay: 0.15, duration: 2.9, size: 7 },
  { left: 94, color: "#8A6996", delay: 0.3, duration: 2.7, size: 8 },
  { left: 98, color: "#FFA00F", delay: 0.2, duration: 2.8, size: 9 },
];

function App() {
  const [phase, setPhase] = useState<AppPhase>("welcome");
  const [bullets, setBullets] = useState<BulletPoint[]>([]);
  const [uncategorized, setUncategorized] = useState<BulletPoint[]>([]);
  const [bins, setBins] = useState<Bin[]>(
    BINS.map((config) => ({ ...config, bullets: [] })),
  );
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [totalBullets, setTotalBullets] = useState(0);
  const [exporting, setExporting] = useState<"json" | "pdf" | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    paragraph: "",
    sentence: "",
    word: "",
    careerValues: [],
    careerSkills: [],
    careerStrengths: [],
    finalWord: "",
  });
  const [narrativeStates, setNarrativeStates] = useState<
    Record<string, NarrativeState>
  >({});
  const [finalParagraph, setFinalParagraph] = useState("");
  const showSummaryDetails = false;
  const [aiWordState, setAiWordState] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; word: string }
    | { status: "error" }
  >({ status: "idle" });
  const [showCelebrationBurst, setShowCelebrationBurst] = useState(false);
  const hasWokenBackend = useRef(false);
  const MIN_FINAL_PARAGRAPH_WORDS = 40;
  const MAX_FINAL_PARAGRAPH_WORDS = 180;

  const isViewportLocked = [
    "welcome", "paragraph", "paragraphReview", "sentence", "sentenceReview",
    "word", "wordReview", "careerValue", "careerSkill", "careerStrength",
    "selectionReview", "upload", "preview", "finalWord",
  ].includes(phase);

  const isScrollableFullscreen = [
    "categorize", "summary", "finalReflection",
  ].includes(phase);

  const isWelcomePhase = phase === "welcome";

  const handleOnboardingStepComplete = (
    field: keyof OnboardingData,
    value: string | string[],
  ) => {
    if (field === "paragraph" && !hasWokenBackend.current) {
      hasWokenBackend.current = true;
      pingHealth();
    }
    setOnboardingData((prev) => ({ ...prev, [field]: value }));
    const phaseOrder: AppPhase[] = [
      "welcome",
      "paragraph",
      "paragraphReview",
      "sentence",
      "sentenceReview",
      "word",
      "wordReview",
      "careerValue",
      "careerSkill",
      "careerStrength",
      "selectionReview",
      "upload",
    ];
    const currentIndex = phaseOrder.indexOf(phase);
    if (currentIndex < phaseOrder.length - 1) {
      setPhase(phaseOrder[currentIndex + 1]);
    }
  };

  const handleOnboardingBack = () => {
    const phaseOrder: AppPhase[] = [
      "welcome",
      "paragraph",
      "paragraphReview",
      "sentence",
      "sentenceReview",
      "word",
      "wordReview",
      "careerValue",
      "careerSkill",
      "careerStrength",
      "selectionReview",
    ];
    const currentIndex = phaseOrder.indexOf(phase);
    if (currentIndex > 0) {
      setPhase(phaseOrder[currentIndex - 1]);
    }
  };

  const handleFileUploaded = (extractedBullets: BulletPoint[], file: File) => {
    setBullets(extractedBullets);
    setUploadedFile(file);
    setPhase("preview");
  };

  const handlePreviewConfirmed = (editedBullets: BulletPoint[]) => {
    setUncategorized(editedBullets);
    setTotalBullets(editedBullets.length);
    if (editedBullets.length > 0) {
      setAiWordState({ status: "loading" });
      generateFinalWord(editedBullets.map((bullet) => bullet.text))
        .then((result) => {
          setAiWordState({ status: "success", word: result.word });
        })
        .catch(() => {
          setAiWordState({ status: "error" });
        });
    } else {
      setAiWordState({ status: "error" });
    }
    setPhase("categorize");
  };

  const fetchNarratives = async (result: AnalysisResult) => {
    const values = result.onboardingData?.careerValues ?? [];
    if (values.length === 0) {
      setNarrativeStates({});
      return;
    }

    setNarrativeStates((prev) => {
      const updated: Record<string, NarrativeState> = { ...prev };
      values.forEach((value) => {
        updated[value] = { status: "loading" };
      });
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
          let message =
            "Unable to generate narrative analysis. Please try again.";
          if (error && typeof error === "object" && "response" in error) {
            const axiosError = error as {
              response?: { data?: { detail?: string } };
            };
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
      })
    );
  };

  const handleCategorizationComplete = () => {
    const analytics = calculateAnalytics(bins);
    const result: AnalysisResult = {
      bins,
      analytics,
      timestamp: new Date().toISOString(),
      onboardingData,
    };
    setAnalysisResult(result);
    setPhase("finalWord");
    setNarrativeStates({});
  };

  const handleFinalWordComplete = (word: string) => {
    const updatedOnboarding = { ...onboardingData, finalWord: word };
    setOnboardingData(updatedOnboarding);
    if (analysisResult) {
      const result = {
        ...analysisResult,
        onboardingData: updatedOnboarding,
      };
      setAnalysisResult(result);
      setPhase("summary");
      fetchNarratives(result);
    } else {
      setPhase("summary");
    }
  };

  const handleNarrativeRetry = (value: string) => {
    if (analysisResult) {
      const baseOnboarding = analysisResult.onboardingData ?? {
        paragraph: "",
        sentence: "",
        word: "",
        careerValues: [],
        careerSkills: [],
        careerStrengths: [],
        finalWord: "",
      };
      fetchNarratives({
        ...analysisResult,
        onboardingData: {
          ...baseOnboarding,
          careerValues: [value],
        },
      });
    }
  };

  const calculateAnalytics = (bins: Bin[]) => {
    const total = bins.reduce((sum, bin) => sum + bin.bullets.length, 0);

    const distribution: Distribution[] = bins.map((bin) => ({
      bin_id: bin.id,
      count: bin.bullets.length,
      percentage:
        total > 0
          ? Math.round((bin.bullets.length / total) * 100 * 10) / 10
          : 0,
    }));

    const topBin = bins.reduce((max, bin) =>
      bin.bullets.length > max.bullets.length ? bin : max,
    );

    const suggestions = generateSuggestions(distribution, bins);

    return {
      distribution,
      top_category: topBin.label,
      suggestions,
    };
  };

  const generateSuggestions = (distribution: Distribution[], bins: Bin[]) => {
    const suggestions: string[] = [];

    distribution.forEach((dist) => {
      const bin = bins.find((b) => b.id === dist.bin_id);
      if (!bin) return;

      if (dist.percentage < 15 && dist.count > 0) {
        suggestions.push(
          `Consider adding more bullets to '${bin.label}' to provide a fuller picture`,
        );
      } else if (dist.percentage > 40) {
        suggestions.push(
          `Strong emphasis on '${bin.label}' - this is a key part of your profile!`,
        );
      } else if (dist.count === 0) {
        suggestions.push(
          `No bullets in '${bin.label}' - reflect on experiences that fit this category`,
        );
      }
    });

    if (distribution.filter((d) => d.count > 0).length === bins.length) {
      suggestions.push("Well-balanced profile across all categories!");
    }

    return suggestions.slice(0, 5);
  };

  const handleExportJSON = async () => {
    if (!analysisResult) return;
    setExporting("json");
    try {
      const blob = await exportJSON(analysisResult);
      downloadBlob(
        blob,
        `career_analysis_${new Date().toISOString().split("T")[0]}.json`,
      );
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async () => {
    if (!analysisResult) return;
    setExporting("pdf");
    try {
      const blob = await exportPDF(analysisResult);
      downloadBlob(
        blob,
        `career_analysis_${new Date().toISOString().split("T")[0]}.pdf`,
      );
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(null);
    }
  };

  const handleReset = () => {
    setPhase("welcome");
    setBullets([]);
    setUncategorized([]);
    setBins(BINS.map((config) => ({ ...config, bullets: [] })));
    setAnalysisResult(null);
    setTotalBullets(0);
    setUploadedFile(null);
    setOnboardingData({
      paragraph: "",
      sentence: "",
      word: "",
      careerValues: [],
      careerSkills: [],
      careerStrengths: [],
      finalWord: "",
    });
    setNarrativeStates({});
    setAiWordState({ status: "idle" });
    setFinalParagraph("");
  };

  // Keep for potential future use
  const substepByPhase: Record<
    AppPhase,
    { step: number; total: number; milestoneLabel: string }
  > = {
    welcome: { step: 1, total: 11, milestoneLabel: "Intake" },
    paragraph: { step: 2, total: 11, milestoneLabel: "Intake" },
    paragraphReview: { step: 3, total: 11, milestoneLabel: "Intake" },
    sentence: { step: 4, total: 11, milestoneLabel: "Intake" },
    sentenceReview: { step: 5, total: 11, milestoneLabel: "Intake" },
    word: { step: 6, total: 11, milestoneLabel: "Intake" },
    wordReview: { step: 7, total: 11, milestoneLabel: "Intake" },
    careerValue: { step: 8, total: 11, milestoneLabel: "Intake" },
    careerSkill: { step: 9, total: 11, milestoneLabel: "Intake" },
    careerStrength: { step: 10, total: 11, milestoneLabel: "Intake" },
    selectionReview: { step: 11, total: 11, milestoneLabel: "Intake" },
    upload: { step: 1, total: 2, milestoneLabel: "Resume" },
    preview: { step: 2, total: 2, milestoneLabel: "Resume" },
    categorize: { step: 1, total: 1, milestoneLabel: "Categorize" },
    finalWord: { step: 1, total: 2, milestoneLabel: "Rewrite" },
    summary: { step: 2, total: 2, milestoneLabel: "Rewrite" },
    finalReflection: { step: 1, total: 1, milestoneLabel: "Reflect" },
  };

  const finalParagraphWordCount = countWords(finalParagraph);
  const selectedWord = onboardingData.finalWord || onboardingData.word;

  // Suppress unused variable warnings
  void substepByPhase;
  void handleReset;
  void handleExportJSON;
  void handleExportPDF;
  void exporting;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [phase]);

  useEffect(() => {
    if (phase !== "finalReflection") {
      return;
    }
    setShowCelebrationBurst(true);
    const timeoutId = window.setTimeout(() => {
      setShowCelebrationBurst(false);
    }, 3400);
    return () => window.clearTimeout(timeoutId);
  }, [phase]);

  return (
    <div
      className={`${
        isViewportLocked
          ? "h-[100dvh] overflow-hidden"
          : isScrollableFullscreen
            ? "min-h-screen"
            : "min-h-screen"
      } ${isWelcomePhase ? "bg-white" : ""}`}
    >
      {phase === "finalReflection" && showCelebrationBurst && (
        <div className="screen-celebration" aria-hidden="true">
          {CELEBRATION_CONFETTI.map((piece, index) => (
            <span
              key={`${index}-${piece.left}`}
              className="screen-confetti-piece"
              style={{
                left: `${piece.left}%`,
                backgroundColor: piece.color,
                width: `${piece.size}px`,
                height: `${Math.max(4, Math.round(piece.size * 0.4))}px`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {!isWelcomePhase && <PhaseIndicator phase={phase} />}

      {phase === "welcome" && (
        <WelcomeStep onContinue={() => setPhase("paragraph")} />
      )}

      {phase === "paragraph" && (
        <ParagraphStep
          value={onboardingData.paragraph}
          onComplete={(value) =>
            handleOnboardingStepComplete("paragraph", value)
          }
          onBack={() => setPhase("welcome")}
        />
      )}

      {phase === "paragraphReview" && (
        <StaticTextReviewStep
          sectionNumber={1}
          value={onboardingData.paragraph}
          onContinue={() => setPhase("sentence")}
          onBack={() => setPhase("paragraph")}
        />
      )}

      {phase === "sentence" && (
        <SentenceStep
          value={onboardingData.sentence}
          previousResponse={onboardingData.paragraph}
          onComplete={(value) =>
            handleOnboardingStepComplete("sentence", value)
          }
          onBack={handleOnboardingBack}
        />
      )}

      {phase === "sentenceReview" && (
        <StaticTextReviewStep
          sectionNumber={2}
          value={onboardingData.sentence}
          onContinue={() => setPhase("word")}
          onBack={() => setPhase("sentence")}
        />
      )}

      {phase === "word" && (
        <WordStep
          value={onboardingData.word}
          previousResponse={onboardingData.sentence}
          onComplete={(value) =>
            handleOnboardingStepComplete("word", value)
          }
          onBack={handleOnboardingBack}
        />
      )}

      {phase === "wordReview" && (
        <StaticTextReviewStep
          sectionNumber={3}
          value={onboardingData.word}
          onContinue={() => setPhase("careerValue")}
          onBack={() => setPhase("word")}
        />
      )}

      {phase === "careerValue" && (
        <CareerSelectionStep
          stepNumber="04"
          title="VALUES"
          subtitle="Select exactly 2 values that resonate most strongly with who you are professionally."
          label="Select your top career values"
          inputId="career-values-input"
          options={CAREER_VALUES}
          values={onboardingData.careerValues}
          onChange={(values) =>
            setOnboardingData((prev) => ({ ...prev, careerValues: values }))
          }
          onContinue={() => setPhase("careerSkill")}
          onBack={handleOnboardingBack}
        />
      )}

      {phase === "careerSkill" && (
        <CareerSelectionStep
          stepNumber="04"
          title="SKILLS"
          subtitle="Select exactly 2 skills that describe how you like to contribute."
          label="Select your top career skills"
          inputId="career-skills-input"
          options={CAREER_SKILLS}
          values={onboardingData.careerSkills}
          onChange={(values) =>
            setOnboardingData((prev) => ({ ...prev, careerSkills: values }))
          }
          onContinue={() => setPhase("careerStrength")}
          onBack={handleOnboardingBack}
        />
      )}

      {phase === "careerStrength" && (
        <CareerSelectionStep
          stepNumber="04"
          title="STRENGTHS"
          subtitle="Select exactly 2 strengths that show how you naturally operate."
          label="Select your top career strengths"
          inputId="career-strengths-input"
          options={CAREER_STRENGTHS}
          values={onboardingData.careerStrengths}
          onChange={(values) =>
            setOnboardingData((prev) => ({
              ...prev,
              careerStrengths: values,
            }))
          }
          onContinue={() => setPhase("selectionReview")}
          onBack={handleOnboardingBack}
        />
      )}

      {phase === "selectionReview" && (
        <SelectionReviewStep
          values={onboardingData.careerValues}
          strengths={onboardingData.careerStrengths}
          skills={onboardingData.careerSkills}
          onContinue={() => setPhase("upload")}
          onBack={handleOnboardingBack}
        />
      )}

      {phase === "upload" && (
        <FileUpload onFileUploaded={handleFileUploaded} onBack={() => setPhase("selectionReview")} />
      )}

      {phase === "preview" && (
        <BulletPreview
          bullets={bullets}
          file={uploadedFile}
          onConfirm={handlePreviewConfirmed}
          onBack={() => setPhase("upload")}
        />
      )}

      {phase === "categorize" && (
        <BinContainer
          bins={bins}
          uncategorized={uncategorized}
          totalBullets={totalBullets}
          onBinsChange={setBins}
          onUncategorizedChange={setUncategorized}
          onTotalChange={setTotalBullets}
          onComplete={handleCategorizationComplete}
          onBack={() => setPhase("preview")}
        />
      )}

      {phase === "finalWord" && (
        <FinalWordStep
          originalWord={onboardingData.word}
          suggestedState={aiWordState}
          onComplete={handleFinalWordComplete}
          onBack={() => setPhase("categorize")}
        />
      )}

      {phase === "summary" && analysisResult && (
        <div className="min-h-screen bg-[#469B57] px-6 md:px-10 py-8 md:py-12">
          <div className="mb-6 md:mb-8">
            <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">08</p>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-white mb-2 uppercase">
              Rewrite Your Story
            </h2>
            <p className="text-white text-sm md:text-base max-w-2xl mx-auto">
              Draft your interview-ready response to "Tell me about yourself"
              using the value-focused perspectives below.
            </p>
          </div>
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col gap-3 items-center text-center">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-white/70 text-sm">Defining word:</span>
                <span className="bg-white/80 text-[#003D1C] px-3 py-1 rounded-full text-sm font-medium">
                  {onboardingData.finalWord || onboardingData.word}
                </span>
              </div>
              {onboardingData.careerSkills.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="text-white/70 text-sm">
                    Top skills:
                  </span>
                  {onboardingData.careerSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-white/80 text-[#003D1C] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {onboardingData.careerStrengths.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="text-white/70 text-sm">
                    Top strengths:
                  </span>
                  {onboardingData.careerStrengths.map((strength) => (
                    <span
                      key={strength}
                      className="bg-white/80 text-[#003D1C] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {onboardingData.careerValues.length > 0 && (
              <div
                className={
                  onboardingData.careerValues.length === 1
                    ? ""
                    : onboardingData.careerValues.length === 2
                      ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
                      : "grid grid-cols-1 lg:grid-cols-3 gap-6"
                }
              >
                {onboardingData.careerValues.map((value) => (
                  <NarrativeAnalysisPanel
                    key={value}
                    narrativeState={
                      narrativeStates[value] || { status: "idle" }
                    }
                    word={onboardingData.finalWord || onboardingData.word}
                    careerValue={value}
                    onRetry={() => handleNarrativeRetry(value)}
                  />
                ))}
              </div>
            )}

            <div className="bg-white/80 rounded-xl p-8 text-center">
              <h3 className="text-xl font-medium text-[#262626] mb-2">
                Write Your Final Paragraph
              </h3>
              <p className="text-[#525252] mb-6 max-w-2xl mx-auto">
                Use the prompts above to craft a single, authentic paragraph
                in your own words.
              </p>
              <div className="max-w-3xl mx-auto text-left">
                <label
                  htmlFor="final-paragraph"
                  className="block text-sm font-semibold text-[#404040] mb-2"
                >
                  Your final response
                </label>
                <textarea
                  id="final-paragraph"
                  value={finalParagraph}
                  onChange={(event) => {
                    if (
                      countWords(event.target.value) <= MAX_FINAL_PARAGRAPH_WORDS
                    ) {
                      setFinalParagraph(event.target.value);
                    }
                  }}
                  placeholder="I am a professional who..."
                  rows={6}
                  className={`
                    w-full px-4 py-3 rounded-xl
                    bg-white/60 border-0 text-base font-sans
                    placeholder:text-[#A3A3A3]
                    focus:outline-none focus:ring-2 focus:ring-[#469B57]/30
                    transition-colors duration-200
                    resize-none
                    ${
                      finalParagraphWordCount > 0 &&
                      finalParagraphWordCount < MIN_FINAL_PARAGRAPH_WORDS
                        ? "ring-2 ring-[#9D162E]/30"
                        : ""
                    }
                  `}
                />
                <div className="flex justify-between mt-2">
                  <span
                    className={`text-sm ${
                      finalParagraphWordCount > 0 &&
                      finalParagraphWordCount < MIN_FINAL_PARAGRAPH_WORDS
                        ? "text-[#9D162E]"
                        : "text-[#525252]"
                    }`}
                  >
                    {finalParagraphWordCount < MIN_FINAL_PARAGRAPH_WORDS
                      ? `${MIN_FINAL_PARAGRAPH_WORDS - finalParagraphWordCount} more words needed`
                      : "Looking good!"}
                  </span>
                  <span
                    className={`text-sm ${
                      finalParagraphWordCount > MAX_FINAL_PARAGRAPH_WORDS * 0.9
                        ? "text-[#9D162E]"
                        : "text-[#525252]"
                    }`}
                  >
                    {formatWordLabel(finalParagraphWordCount)}/
                    {MAX_FINAL_PARAGRAPH_WORDS}
                  </span>
                </div>
              </div>
            </div>

            {showSummaryDetails && (
              <>
                <DistributionChart
                  analytics={analysisResult.analytics}
                  bins={bins}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <BinList bins={bins} />
                  <InsightsPanel analytics={analysisResult.analytics} />
                </div>

                <div className="bg-white/80 rounded-xl p-8">
                  <div className="text-center">
                    <h3 className="text-xl font-medium text-[#262626] mb-2">
                      Save Your Analysis
                    </h3>
                    <p className="text-[#525252] mb-6">
                      Download your career profile for future reference or
                      sharing.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={handleExportJSON}
                        disabled={exporting !== null}
                        className="px-6 py-2 border border-black/10 text-[#262626] rounded-xl hover:bg-white/60 disabled:opacity-40 transition-colors"
                      >
                        {exporting === "json" ? "Exporting..." : "Download JSON"}
                      </button>
                      <button
                        onClick={handleExportPDF}
                        disabled={exporting !== null}
                        className="px-6 py-2 bg-[#366946] text-white rounded-xl hover:bg-[#2E5A3C] disabled:opacity-40 transition-colors"
                      >
                        {exporting === "pdf" ? "Exporting..." : "Download PDF"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setPhase("finalWord")}
                className="text-[#003D1C]/70 hover:text-[#003D1C] text-sm font-medium transition-colors"
              >
                &larr; Back
              </button>
              <button
                onClick={() => setPhase("finalReflection")}
                disabled={finalParagraphWordCount < MIN_FINAL_PARAGRAPH_WORDS}
                className="px-10 py-3 bg-[#366946] text-white uppercase tracking-[0.16em] text-sm md:text-base font-medium rounded-xl hover:bg-[#2E5A3C] active:bg-[#264D33] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === "finalReflection" && (
        <div className="min-h-screen bg-[#469B57] px-6 md:px-10 py-8 md:py-12">
          <div className="mb-6 md:mb-8">
            <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">09</p>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-white mb-2 uppercase">
              Reflect on Your Growth
            </h2>
            <p className="text-white text-sm md:text-base max-w-2xl mx-auto">
              Compare your original story with the version you crafted
              today. Notice how your values, skills, and strengths shaped
              the way you describe yourself.
            </p>
          </div>
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white/80 rounded-xl p-6">
              <h3 className="text-xl font-medium text-[#262626] mb-4">
                Your Story Core
              </h3>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[#525252] text-sm">Defining word:</span>
                <span className="bg-[#00693E]/10 text-[#00693E] px-3 py-1 rounded-full text-sm font-medium">
                  {selectedWord}
                </span>
              </div>
              {onboardingData.careerValues.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[#525252] text-sm">Top values:</span>
                  {onboardingData.careerValues.map((value) => (
                    <span
                      key={value}
                      className="bg-[#00693E]/10 text-[#00693E] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              )}
              {onboardingData.careerSkills.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[#525252] text-sm">Top skills:</span>
                  {onboardingData.careerSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-[#00693E]/10 text-[#00693E] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {onboardingData.careerStrengths.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[#525252] text-sm">Top strengths:</span>
                  {onboardingData.careerStrengths.map((strength) => (
                    <span
                      key={strength}
                      className="bg-[#00693E]/10 text-[#00693E] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/80 rounded-xl p-6">
                <h3 className="text-xl font-medium text-[#262626] mb-3">
                  Original Paragraph
                </h3>
                <p className="text-[#525252] leading-relaxed">
                  {onboardingData.paragraph}
                </p>
              </div>
              <div className="bg-white/80 rounded-xl p-6">
                <h3 className="text-xl font-medium text-[#262626] mb-3">
                  Rewritten Paragraph
                </h3>
                <p className="text-[#525252] leading-relaxed">
                  {finalParagraph}
                </p>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-6 text-center">
              <h4 className="text-lg font-medium text-[#262626] mb-2">
                Reflection Prompt
              </h4>
              <p className="text-[#525252]">
                What feels more authentic in your rewritten paragraph, and
                what new possibilities do you see in how you present your
                story?
              </p>
            </div>

            <div>
              <button
                onClick={() => setPhase("summary")}
                className="text-[#003D1C]/70 hover:text-[#003D1C] text-sm font-medium transition-colors"
              >
                &larr; Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
