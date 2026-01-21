import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
} from '@dnd-kit/core';
import { useState } from 'react';
import { Bin } from '../../types/Bin';
import { BulletPoint } from '../../types/BulletPoint';
import { BINS } from '../../config/bins';
import DroppableBin from './DroppableBin';
import BulletPool from './BulletPool';
import Button from '../common/Button';

interface Props {
  bins: Bin[];
  uncategorized: BulletPoint[];
  totalBullets: number;
  onBinsChange: (bins: Bin[]) => void;
  onUncategorizedChange: (bullets: BulletPoint[]) => void;
  onTotalChange: (total: number) => void;
  onComplete: () => void;
}

// Helper to check if a bullet is a duplicate
const isDuplicate = (bulletId: string) => bulletId.includes('-dup-');

export default function BinContainer({
  bins,
  uncategorized,
  totalBullets,
  onBinsChange,
  onUncategorizedChange,
  onTotalChange,
  onComplete,
}: Props) {
  const [activeBullet, setActiveBullet] = useState<BulletPoint | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const bullet = event.active.data.current as BulletPoint;
    setActiveBullet(bullet);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveBullet(null);

    const { active, over } = event;
    if (!over) return;

    const bulletId = active.id as string;
    const targetBinId = over.id as string;

    const bullet = uncategorized.find((b) => b.id === bulletId);
    if (!bullet) return;

    const targetBin = bins.find((b) => b.id === targetBinId);
    if (!targetBin) return;

    onUncategorizedChange(uncategorized.filter((b) => b.id !== bulletId));

    const updatedBins = bins.map((bin) =>
      bin.id === targetBinId
        ? { ...bin, bullets: [...bin.bullets, bullet] }
        : bin
    );
    onBinsChange(updatedBins);
  };

  const handleRemoveBullet = (binId: string, bulletId: string) => {
    const bin = bins.find((b) => b.id === binId);
    const bullet = bin?.bullets.find((b) => b.id === bulletId);

    if (bullet) {
      const updatedBins = bins.map((b) =>
        b.id === binId
          ? { ...b, bullets: b.bullets.filter((bu) => bu.id !== bulletId) }
          : b
      );
      onBinsChange(updatedBins);
      onUncategorizedChange([...uncategorized, bullet]);
    }
  };

  const handleDuplicate = (bullet: BulletPoint) => {
    const newBullet: BulletPoint = {
      ...bullet,
      id: `${bullet.id}-dup-${Date.now()}`,
    };
    onUncategorizedChange([...uncategorized, newBullet]);
    onTotalChange(totalBullets + 1);
  };

  const handleDeleteDuplicate = (bulletId: string) => {
    if (!isDuplicate(bulletId)) return;
    onUncategorizedChange(uncategorized.filter((b) => b.id !== bulletId));
    onTotalChange(totalBullets - 1);
  };

  const categorizedCount = bins.reduce((sum, bin) => sum + bin.bullets.length, 0);
  const canComplete = categorizedCount > 0;

  // Get bins by position: interests (top-left), skillset (top-right), values (bottom-left), strengths (bottom-right)
  const getBinByPosition = (position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    const binIds = {
      'top-left': 'interests',
      'top-right': 'skillset',
      'bottom-left': 'values',
      'bottom-right': 'strengths',
    };
    const binId = binIds[position];
    const bin = bins.find((b) => b.id === binId)!;
    const config = BINS.find((c) => c.id === binId)!;
    return { bin, config };
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Header with View Summary button */}
      <div className="flex justify-center mb-6">
        <Button onClick={onComplete} disabled={!canComplete}>
          View Summary
        </Button>
      </div>

      {/* Diamond Layout Container */}
      <div className="relative">
        {/* Grid layout for corners and center */}
        <div className="grid grid-cols-3 gap-4 lg:gap-6 items-start">
          {/* Top Row */}
          <div className="w-full max-w-[280px]">
            {/* Top-left: Interests */}
            {(() => {
              const { bin, config } = getBinByPosition('top-left');
              return (
                <DroppableBin
                  bin={bin}
                  config={config}
                  onRemoveBullet={(bulletId) => handleRemoveBullet(bin.id, bulletId)}
                />
              );
            })()}
          </div>
          <div>{/* Empty center top */}</div>
          <div className="w-full max-w-[280px] justify-self-end">
            {/* Top-right: Skill Set */}
            {(() => {
              const { bin, config } = getBinByPosition('top-right');
              return (
                <DroppableBin
                  bin={bin}
                  config={config}
                  onRemoveBullet={(bulletId) => handleRemoveBullet(bin.id, bulletId)}
                />
              );
            })()}
          </div>

          {/* Middle Row - Center Stack */}
          <div>{/* Empty left */}</div>
          <div className="justify-self-center py-6 lg:py-10 w-full">
            <BulletPool
              bullets={uncategorized}
              totalBullets={totalBullets}
              onDuplicate={handleDuplicate}
              onDeleteDuplicate={handleDeleteDuplicate}
            />
          </div>
          <div>{/* Empty right */}</div>

          {/* Bottom Row */}
          <div className="w-full max-w-[280px]">
            {/* Bottom-left: Values */}
            {(() => {
              const { bin, config } = getBinByPosition('bottom-left');
              return (
                <DroppableBin
                  bin={bin}
                  config={config}
                  onRemoveBullet={(bulletId) => handleRemoveBullet(bin.id, bulletId)}
                />
              );
            })()}
          </div>
          <div>{/* Empty center bottom */}</div>
          <div className="w-full max-w-[280px] justify-self-end">
            {/* Bottom-right: Strengths */}
            {(() => {
              const { bin, config } = getBinByPosition('bottom-right');
              return (
                <DroppableBin
                  bin={bin}
                  config={config}
                  onRemoveBullet={(bulletId) => handleRemoveBullet(bin.id, bulletId)}
                />
              );
            })()}
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeBullet && (
          <div className="bg-white border-2 border-[#00693E] rounded p-3 shadow-lg max-w-sm">
            <p className="text-sm text-[#404040]">{activeBullet.text}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
