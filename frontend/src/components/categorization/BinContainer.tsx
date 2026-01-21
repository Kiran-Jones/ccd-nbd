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

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Bullet Pool */}
        <div className="lg:col-span-1">
          <BulletPool
            bullets={uncategorized}
            totalBullets={totalBullets}
            onDuplicate={handleDuplicate}
            onDeleteDuplicate={handleDeleteDuplicate}
          />
        </div>

        {/* Right: Categories */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#E5E5E5] rounded-md">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-[#262626]">
                  Categories
                </h3>
                <p className="text-sm text-[#737373] mt-1">
                  Organize your experiences into meaningful groups
                </p>
              </div>
              <Button onClick={onComplete} disabled={!canComplete}>
                View Summary
              </Button>
            </div>

            {/* Bins Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {bins.map((bin) => {
                  const config = BINS.find((c) => c.id === bin.id)!;
                  return (
                    <DroppableBin
                      key={bin.id}
                      bin={bin}
                      config={config}
                      onRemoveBullet={(bulletId) =>
                        handleRemoveBullet(bin.id, bulletId)
                      }
                    />
                  );
                })}
              </div>
            </div>
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
