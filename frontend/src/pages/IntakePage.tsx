import { useNavigate } from "react-router-dom";
import { useAppState } from "../context/AppStateContext";
import ParagraphStep from "../components/onboarding/ParagraphStep";
import SentenceStep from "../components/onboarding/SentenceStep";
import WordStep from "../components/onboarding/WordStep";
import CareerSelectionStep from "../components/onboarding/CareerSelectionStep";
import StaticTextReviewStep from "../components/onboarding/StaticTextReviewStep";
import SelectionReviewStep from "../components/onboarding/SelectionReviewStep";
import { CAREER_VALUES } from "../config/careerValues";
import { CAREER_SKILLS } from "../config/careerSkills";
import { CAREER_STRENGTHS } from "../config/careerStrengths";

export default function IntakePage() {
  const navigate = useNavigate();
  const {
    onboardingData,
    setOnboardingData,
    intakeStep,
    setIntakeStep,
    markRouteCompleted,
    wakeBackend,
  } = useAppState();

  const handleStepComplete = (field: keyof typeof onboardingData, value: string | string[]) => {
    if (field === "paragraph") wakeBackend();
    setOnboardingData((prev) => ({ ...prev, [field]: value }));
    setIntakeStep((s) => s + 1);
  };

  const handleBack = () => {
    if (intakeStep === 0) {
      navigate("/");
    } else {
      setIntakeStep((s) => s - 1);
    }
  };

  const handleIntakeFinished = () => {
    markRouteCompleted("/");
    markRouteCompleted("/intake");
    navigate("/resume");
  };

  return (
    <div className="h-[100dvh] overflow-hidden">
      {intakeStep === 0 && (
        <ParagraphStep
          value={onboardingData.paragraph}
          onComplete={(value) => handleStepComplete("paragraph", value)}
          onBack={handleBack}
        />
      )}

      {intakeStep === 1 && (
        <StaticTextReviewStep
          sectionNumber={1}
          value={onboardingData.paragraph}
          onContinue={() => setIntakeStep(2)}
          onBack={handleBack}
        />
      )}

      {intakeStep === 2 && (
        <SentenceStep
          value={onboardingData.sentence}
          previousResponse={onboardingData.paragraph}
          onComplete={(value) => handleStepComplete("sentence", value)}
          onBack={handleBack}
        />
      )}

      {intakeStep === 3 && (
        <StaticTextReviewStep
          sectionNumber={2}
          value={onboardingData.sentence}
          onContinue={() => setIntakeStep(4)}
          onBack={handleBack}
        />
      )}

      {intakeStep === 4 && (
        <WordStep
          value={onboardingData.word}
          previousResponse={onboardingData.sentence}
          onComplete={(value) => handleStepComplete("word", value)}
          onBack={handleBack}
        />
      )}

      {intakeStep === 5 && (
        <StaticTextReviewStep
          sectionNumber={3}
          value={onboardingData.word}
          onContinue={() => setIntakeStep(6)}
          onBack={handleBack}
        />
      )}

      {intakeStep === 6 && (
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
          onContinue={() => setIntakeStep(7)}
          onBack={handleBack}
        />
      )}

      {intakeStep === 7 && (
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
          onContinue={() => setIntakeStep(8)}
          onBack={handleBack}
        />
      )}

      {intakeStep === 8 && (
        <CareerSelectionStep
          stepNumber="04"
          title="STRENGTHS"
          subtitle="Select exactly 2 strengths that show how you naturally operate."
          label="Select your top career strengths"
          inputId="career-strengths-input"
          options={CAREER_STRENGTHS}
          values={onboardingData.careerStrengths}
          onChange={(values) =>
            setOnboardingData((prev) => ({ ...prev, careerStrengths: values }))
          }
          onContinue={() => setIntakeStep(9)}
          onBack={handleBack}
        />
      )}

      {intakeStep === 9 && (
        <SelectionReviewStep
          values={onboardingData.careerValues}
          strengths={onboardingData.careerStrengths}
          skills={onboardingData.careerSkills}
          onContinue={handleIntakeFinished}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
