import { useDroppable } from '@dnd-kit/core';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
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

  // Keep index in bounds when bullets change
  const safeIndex = Math.min(currentIndex, Math.max(0, bin.bullets.length - 1));
  const topBullet = bin.bullets[safeIndex];
  const totalBullets = bin.bullets.length;
  const hasMultiple = totalBullets > 1;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(bin.bullets.length - 1, prev + 1));
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
        className="px-4 py-3 rounded-t-md"
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
      <div className="p-3 min-h-[120px]">
        {bin.bullets.length === 0 ? (
          <div
            className="h-full min-h-[96px] flex items-center justify-center border-2 border-dashed rounded-md"
            style={{ borderColor: `${config.color}40` }}
          >
            <p className="text-sm" style={{ color: `${config.color}80` }}>
              Drop items here
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Stack effect layers */}
            {totalBullets - safeIndex >= 3 && (
              <div
                className="absolute inset-0 bg-white rounded border"
                style={{
                  transform: 'translateY(6px) scale(0.96)',
                  borderColor: `${config.color}30`,
                  zIndex: 0,
                }}
              />
            )}
            {totalBullets - safeIndex >= 2 && (
              <div
                className="absolute inset-0 bg-white rounded border"
                style={{
                  transform: 'translateY(3px) scale(0.98)',
                  borderColor: `${config.color}30`,
                  zIndex: 1,
                }}
              />
            )}

            {/* Top card */}
            <div
              className="relative z-10 flex items-start gap-2 p-2.5 bg-white rounded border group"
              style={{ borderColor: `${config.color}40` }}
            >
              <p className="flex-1 text-sm text-[#404040] leading-relaxed">
                {topBullet.text}
              </p>
              <button
                onClick={() => handleRemove(topBullet.id)}
                className="p-1 text-[#A3A3A3] hover:text-[#9D162E] hover:bg-[#FFEBEE] rounded transition-all"
                title="Remove from this category"
                aria-label="Remove from this category"
              >
                <X size={14} />
              </button>
            </div>

            {/* Navigation for multiple items */}
            {hasMultiple && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  onClick={handlePrev}
                  disabled={safeIndex === 0}
                  className="p-1 rounded hover:bg-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  style={{ color: config.color }}
                  aria-label="Previous item"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs" style={{ color: config.color }}>
                  {safeIndex + 1} / {totalBullets}
                </span>
                <button
                  onClick={handleNext}
                  disabled={safeIndex === totalBullets - 1}
                  className="p-1 rounded hover:bg-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  style={{ color: config.color }}
                  aria-label="Next item"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
