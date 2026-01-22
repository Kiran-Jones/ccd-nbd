import { useDroppable } from '@dnd-kit/core';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Bin } from '../../types/Bin';
import { BinConfig } from '../../config/bins';

interface Props {
  bin: Bin;
  config: BinConfig;
  onRemoveBullet: (bulletId: string) => void;
}

export default function DroppableBin({ bin, config, onRemoveBullet }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: bin.id,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollState, setScrollState] = useState({ canScrollUp: false, canScrollDown: false });
  const textRef = useRef<HTMLDivElement>(null);

  // Keep index in bounds when bullets change
  const safeIndex = Math.min(currentIndex, Math.max(0, bin.bullets.length - 1));
  const topBullet = bin.bullets[safeIndex];
  const totalBullets = bin.bullets.length;
  const hasMultiple = totalBullets > 1;

  // Check scroll state
  const updateScrollState = useCallback(() => {
    if (textRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = textRef.current;
      setScrollState({
        canScrollUp: scrollTop > 0,
        canScrollDown: scrollTop + clientHeight < scrollHeight - 1,
      });
    }
  }, []);

  // Update scroll state when content changes
  useEffect(() => {
    updateScrollState();
  }, [topBullet?.text, safeIndex, updateScrollState]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(totalBullets - 1, prev + 1));
  };

  const handleRemove = (bulletId: string) => {
    onRemoveBullet(bulletId);
    // Adjust index if needed after removal
    if (safeIndex >= bin.bullets.length - 1 && safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-lg transition-all duration-200
        border-2
        flex flex-col
        h-[200px] md:h-[220px]
        ${isOver ? 'ring-2 ring-offset-2 scale-105' : ''}
      `}
      style={{
        backgroundColor: `${config.color}12`,
        borderColor: isOver ? config.color : `${config.color}40`,
        // @ts-expect-error CSS custom property
        '--tw-ring-color': config.color,
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-2 rounded-t-md flex-shrink-0"
        style={{
          backgroundColor: `${config.color}20`,
        }}
      >
        <div className="flex items-center justify-between">
          <h4
            className="font-serif text-lg font-medium"
            style={{ color: config.color }}
          >
            {config.label}
          </h4>
          <span
            className="text-xs font-medium px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: config.color }}
          >
            {bin.bullets.length}
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: `${config.color}99` }}>
          {config.description}
        </p>
      </div>

      {/* Bullets - Stack View */}
      <div className="p-2 pb-3 pr-3 flex-1 min-h-0 overflow-visible">
        {bin.bullets.length === 0 ? (
          <div
            className="h-full flex items-center justify-center border-2 border-dashed rounded-md"
            style={{ borderColor: `${config.color}40` }}
          >
            <p className="text-sm" style={{ color: `${config.color}80` }}>
              Drop items here
            </p>
          </div>
        ) : (
          <div className="relative h-full flex flex-col">
            {/* Stack container with padding for stack offset */}
            <div className="relative flex-1 min-h-0 mr-2 mb-2">
              {/* Stack effect layers - peek out from bottom-right */}
              {totalBullets >= 3 && (
                <div
                  className="absolute rounded border bg-white"
                  style={{
                    top: '6px',
                    left: '6px',
                    right: '-6px',
                    bottom: '-6px',
                    borderColor: `${config.color}30`,
                    zIndex: 0,
                  }}
                />
              )}
              {totalBullets >= 2 && (
                <div
                  className="absolute rounded border bg-white"
                  style={{
                    top: '3px',
                    left: '3px',
                    right: '-3px',
                    bottom: '-3px',
                    borderColor: `${config.color}35`,
                    zIndex: 1,
                  }}
                />
              )}

              {/* Top card */}
              <div
                className="absolute inset-0 z-10 flex flex-col bg-white rounded border overflow-hidden"
                style={{ borderColor: `${config.color}40` }}
              >
                {/* Card content */}
                <div className="flex items-start gap-2 p-2.5 flex-1 min-h-0">
                  <div className="flex-1 min-h-0 overflow-hidden relative">
                    {/* Fade gradient at top when scrolled */}
                    {scrollState.canScrollUp && (
                      <div
                        className="absolute top-0 left-0 right-2 h-4 pointer-events-none z-10"
                        style={{
                          background: 'linear-gradient(white, transparent)',
                        }}
                      />
                    )}

                    {/* Scrollable text container */}
                    <div
                      ref={textRef}
                      onScroll={updateScrollState}
                      className="h-full overflow-y-auto pr-1 scrollbar-thin"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: `${config.color}40 transparent`,
                      }}
                    >
                      <p className="text-sm text-[#404040] leading-relaxed">
                        {topBullet.text}
                      </p>
                    </div>

                    {/* Fade gradient at bottom when more content */}
                    {scrollState.canScrollDown && (
                      <div
                        className="absolute bottom-0 left-0 right-2 h-6 pointer-events-none z-10"
                        style={{
                          background: 'linear-gradient(transparent, white)',
                        }}
                      />
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(topBullet.id)}
                    className="p-1.5 rounded transition-all flex-shrink-0 hover:scale-110"
                    style={{
                      color: `${config.color}80`,
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#9D162E';
                      e.currentTarget.style.backgroundColor = '#FFEBEE';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = `${config.color}80`;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="Remove from this category"
                    aria-label="Remove from this category"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation for multiple items - always visible when multiple */}
            {hasMultiple && (
              <div
                className="flex items-center justify-center gap-3 py-1 rounded-md flex-shrink-0 mt-auto"
                style={{ backgroundColor: `${config.color}10` }}
              >
                <button
                  onClick={handlePrev}
                  disabled={safeIndex === 0}
                  className="p-1 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                  style={{
                    color: config.color,
                    backgroundColor: safeIndex === 0 ? 'transparent' : `${config.color}20`,
                  }}
                  aria-label="Previous item"
                >
                  <ChevronLeft size={18} />
                </button>
                <span
                  className="text-xs font-medium min-w-[40px] text-center"
                  style={{ color: config.color }}
                >
                  {safeIndex + 1} / {totalBullets}
                </span>
                <button
                  onClick={handleNext}
                  disabled={safeIndex === totalBullets - 1}
                  className="p-1 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                  style={{
                    color: config.color,
                    backgroundColor: safeIndex === totalBullets - 1 ? 'transparent' : `${config.color}20`,
                  }}
                  aria-label="Next item"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
