import { useState, useEffect } from "react";
import Button from "../common/Button";

interface Props {
  onContinue: () => void;
}

const TITLE_TEXT = "NARRATIVE ";
const TITLE_SUFFIX = "by design";
const SUBTITLE_TEXT =
  "Take a few minutes to explore your story and how you want to share it.";

const TITLE_SPEED = 55;
const SUBTITLE_SPEED = 30;
const PAUSE_BETWEEN = 400;
const BUTTON_DELAY = 300;

type Phase = "typing-title" | "typing-subtitle" | "showing-button" | "done";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export default function WelcomeStep({ onContinue }: Props) {
  const reducedMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>(() =>
    reducedMotion ? "done" : "typing-title"
  );
  const [titleCount, setTitleCount] = useState(() => (reducedMotion ? TITLE_TEXT.length + TITLE_SUFFIX.length : 0));
  const [subtitleCount, setSubtitleCount] = useState(() => (reducedMotion ? SUBTITLE_TEXT.length : 0));
  const [buttonVisible, setButtonVisible] = useState(reducedMotion);

  // Skip animation if reduced motion preference changes
  useEffect(() => {
    if (reducedMotion) {
      setPhase("done");
      setTitleCount(TITLE_TEXT.length + TITLE_SUFFIX.length);
      setSubtitleCount(SUBTITLE_TEXT.length);
      setButtonVisible(true);
    }
  }, [reducedMotion]);

  // Drive the typing animation
  useEffect(() => {
    if (reducedMotion) return;

    const totalTitle = TITLE_TEXT.length + TITLE_SUFFIX.length;

    if (phase === "typing-title") {
      if (titleCount >= totalTitle) {
        const timeout = setTimeout(() => setPhase("typing-subtitle"), PAUSE_BETWEEN);
        return () => clearTimeout(timeout);
      }
      const interval = setInterval(() => {
        setTitleCount((c) => {
          if (c >= totalTitle) {
            clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, TITLE_SPEED);
      return () => clearInterval(interval);
    }

    if (phase === "typing-subtitle") {
      if (subtitleCount >= SUBTITLE_TEXT.length) {
        const timeout = setTimeout(() => setPhase("showing-button"), BUTTON_DELAY);
        return () => clearTimeout(timeout);
      }
      const interval = setInterval(() => {
        setSubtitleCount((c) => {
          if (c >= SUBTITLE_TEXT.length) {
            clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, SUBTITLE_SPEED);
      return () => clearInterval(interval);
    }

    if (phase === "showing-button") {
      setButtonVisible(true);
      const timeout = setTimeout(() => setPhase("done"), 500);
      return () => clearTimeout(timeout);
    }
  }, [phase, titleCount, subtitleCount, reducedMotion]);

  const totalTitle = TITLE_TEXT.length + TITLE_SUFFIX.length;

  // Render the title with proper styling, sliced to titleCount characters
  const renderTitle = () => {
    const visibleChars = titleCount;
    const mainVisible = Math.min(visibleChars, TITLE_TEXT.length);
    const suffixVisible = Math.max(0, visibleChars - TITLE_TEXT.length);

    return (
      <>
        {TITLE_TEXT.slice(0, mainVisible)}
        {suffixVisible > 0 && (
          <span className="font-normal normal-case tracking-normal text-3xl sm:text-4xl md:text-5xl">
            {TITLE_SUFFIX.slice(0, suffixVisible)}
          </span>
        )}
      </>
    );
  };

  const showTitleCursor = phase === "typing-title" && titleCount < totalTitle;
  const showSubtitleCursor = phase === "typing-subtitle" && subtitleCount < SUBTITLE_TEXT.length;

  return (
    <div className="h-full w-full flex flex-col bg-white">
      <div className="relative w-full h-[44vh] md:h-[50vh] flex">
        <div className="h-full" style={{ width: "40%", backgroundColor: "#469B57" }} />
        <div className="h-full" style={{ width: "24%", backgroundColor: "#59AF6A" }} />
        <div className="h-full" style={{ width: "18%", backgroundColor: "#6FC37F" }} />
        <div className="h-full" style={{ width: "12%", backgroundColor: "#8BD89A" }} />
        <div className="h-full" style={{ width: "6%", backgroundColor: "#ADF5BB" }} />
        <img
          src="/LonePine_Rev.png"
          alt="Dartmouth pine logo"
          className="absolute top-4 left-4 md:top-6 md:left-6 h-16 md:h-24 w-auto"
        />
      </div>

      <div className="flex-1 md:h-[50vh] flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 md:px-10 py-8 md:py-10">
          <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-10 md:gap-16 items-start">
            <div className="md:-ml-24">
              {/* Screen reader accessible full text */}
              <h1 className="sr-only">
                NARRATIVE by design
              </h1>
              {/* Visual animated title */}
              <p
                aria-hidden="true"
                className="text-[#262626] whitespace-nowrap leading-none font-medium text-4xl sm:text-5xl md:text-6xl tracking-[0.08em]"
              >
                {renderTitle()}
                {showTitleCursor && <span className="typing-cursor" />}
              </p>
            </div>

            <div className="max-w-md space-y-6 md:ml-28">
              <div className="relative">
                {/* Invisible full text to reserve height */}
                <p className="text-[#525252] text-lg md:text-2xl leading-relaxed invisible" aria-hidden="true">
                  {SUBTITLE_TEXT}
                </p>
                {/* Screen reader accessible full text */}
                <p className="sr-only">
                  {SUBTITLE_TEXT}
                </p>
                {/* Visual animated subtitle */}
                <p
                  aria-hidden="true"
                  className="absolute inset-0 text-[#525252] text-lg md:text-2xl leading-relaxed"
                >
                  {SUBTITLE_TEXT.slice(0, subtitleCount)}
                  {showSubtitleCursor && <span className="typing-cursor" />}
                </p>
              </div>
              <div
                className={`transition-opacity duration-500 ${buttonVisible ? "opacity-100" : "opacity-0"}`}
                {...(!buttonVisible && { inert: "" as unknown as string })}
              >
                <Button
                  onClick={onContinue}
                  className="!rounded-xl !px-8 !py-3 !text-sm md:!text-base !font-medium !tracking-[0.16em] !uppercase !bg-[#469B57] hover:!bg-[#3F8F50] active:!bg-[#357A44] !shadow-none"
                >
                  CONTINUE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
