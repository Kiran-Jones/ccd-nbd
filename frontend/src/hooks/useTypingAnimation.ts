import { useState, useEffect } from "react";

const TITLE_SPEED = 55;
const SUBTITLE_SPEED = 30;
const PAUSE_BETWEEN = 400;
const CONTENT_DELAY = 300;

type Phase = "typing-title" | "typing-subtitle" | "showing-content" | "done";

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

export function useTypingAnimation(titleText: string, subtitleText: string) {
  const reducedMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>(() =>
    reducedMotion ? "done" : "typing-title"
  );
  const [titleCount, setTitleCount] = useState(() =>
    reducedMotion ? titleText.length : 0
  );
  const [subtitleCount, setSubtitleCount] = useState(() =>
    reducedMotion ? subtitleText.length : 0
  );
  const [contentVisible, setContentVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setPhase("done");
      setTitleCount(titleText.length);
      setSubtitleCount(subtitleText.length);
      setContentVisible(true);
    }
  }, [reducedMotion, titleText.length, subtitleText.length]);

  useEffect(() => {
    if (reducedMotion) return;

    if (phase === "typing-title") {
      if (titleCount >= titleText.length) {
        const timeout = setTimeout(
          () => setPhase("typing-subtitle"),
          PAUSE_BETWEEN
        );
        return () => clearTimeout(timeout);
      }
      const interval = setInterval(() => {
        setTitleCount((c) => {
          if (c >= titleText.length) {
            clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, TITLE_SPEED);
      return () => clearInterval(interval);
    }

    if (phase === "typing-subtitle") {
      if (subtitleCount >= subtitleText.length) {
        const timeout = setTimeout(
          () => setPhase("showing-content"),
          CONTENT_DELAY
        );
        return () => clearTimeout(timeout);
      }
      const interval = setInterval(() => {
        setSubtitleCount((c) => {
          if (c >= subtitleText.length) {
            clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, SUBTITLE_SPEED);
      return () => clearInterval(interval);
    }

    if (phase === "showing-content") {
      setContentVisible(true);
      const timeout = setTimeout(() => setPhase("done"), 500);
      return () => clearTimeout(timeout);
    }
  }, [
    phase,
    titleCount,
    subtitleCount,
    reducedMotion,
    titleText.length,
    subtitleText.length,
  ]);

  return {
    visibleTitle: titleText.slice(0, titleCount),
    visibleSubtitle: subtitleText.slice(0, subtitleCount),
    showTitleCursor:
      phase === "typing-title" && titleCount < titleText.length,
    showSubtitleCursor:
      phase === "typing-subtitle" && subtitleCount < subtitleText.length,
    contentVisible,
  };
}
