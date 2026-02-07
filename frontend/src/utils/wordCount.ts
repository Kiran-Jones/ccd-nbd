export const countWords = (text: string): number => {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }

  return trimmed.split(/\s+/).filter(Boolean).length;
};

export const formatWordLabel = (count: number): string =>
  `${count} word${count === 1 ? "" : "s"}`;
