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
  onBack: () => void;
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
  onBack,
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
        ? { ...bin, bullets: [bullet, ...bin.bullets] }
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

  const getBinWithConfig = (binId: 'skillset' | 'values' | 'strengths') => {
    const bin = bins.find((entry) => entry.id === binId);
    const config = BINS.find((entry) => entry.id === binId);
    if (!bin || !config) {
      return null;
    }
    return { bin, config };
  };

  const skillsetBin = getBinWithConfig('skillset');
  const valuesBin = getBinWithConfig('values');
  const strengthsBin = getBinWithConfig('strengths');

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Row layout: all bins aligned on one horizontal level */}
      <div className="relative">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start">
            <div className="w-full max-w-[320px] justify-self-center relative z-10">
              {skillsetBin && (
                <DroppableBin
                  bin={skillsetBin.bin}
                  config={skillsetBin.config}
                  onRemoveBullet={(bulletId) =>
                    handleRemoveBullet(skillsetBin.bin.id, bulletId)
                  }
                />
              )}
            </div>
            <div className="w-full max-w-[320px] justify-self-center relative z-10">
              {valuesBin && (
                <DroppableBin
                  bin={valuesBin.bin}
                  config={valuesBin.config}
                  onRemoveBullet={(bulletId) =>
                    handleRemoveBullet(valuesBin.bin.id, bulletId)
                  }
                />
              )}
            </div>
            <div className="w-full max-w-[320px] justify-self-center relative z-10">
              {strengthsBin && (
                <DroppableBin
                  bin={strengthsBin.bin}
                  config={strengthsBin.config}
                  onRemoveBullet={(bulletId) =>
                    handleRemoveBullet(strengthsBin.bin.id, bulletId)
                  }
                />
              )}
            </div>
          </div>

          <div className="mt-6 lg:mt-8 flex justify-center">
            <div className="w-full max-w-md relative z-20">
              <BulletPool
                bullets={uncategorized}
                onDuplicate={handleDuplicate}
                onDeleteDuplicate={handleDeleteDuplicate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeBullet && (
          <div className="bg-white border-2 border-[#00693E] rounded-md p-3 shadow-xl max-w-sm rotate-2 scale-105">
            <p className="text-sm text-[#404040] line-clamp-4">{activeBullet.text}</p>
          </div>
        )}
      </DragOverlay>

      <div className="flex justify-between items-center mt-6">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete} disabled={!canComplete}>
          View Summary
        </Button>
      </div>
    </DndContext>
  );
}
