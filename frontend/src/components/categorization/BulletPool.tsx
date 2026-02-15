import { BulletPoint } from '../../types/BulletPoint';
import DraggableBullet from './DraggableBullet';

interface Props {
  bullets: BulletPoint[];
  onDuplicate: (bullet: BulletPoint) => void;
  onDeleteDuplicate: (bulletId: string) => void;
}

// Helper to check if a bullet is a duplicate
const isDuplicate = (bulletId: string) => bulletId.includes('-dup-');

export default function BulletPool({ bullets, onDuplicate, onDeleteDuplicate }: Props) {
  const topBullet = bullets[0];
  const remainingCount = bullets.length - 1;
  const totalBullets = bullets.length;

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <h3 className="text-lg font-medium text-white uppercase tracking-wider mb-1 text-center">
        Your Experiences
      </h3>

      {/* Stack container - extra padding for stack offset */}
      <div className="relative w-full max-w-sm pt-3 pl-3">
        {bullets.length === 0 ? (
          <div className="text-center py-8 bg-white/80 border border-black/10 rounded-xl">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-white/60 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#003D1C]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-[#262626] font-medium text-sm">All done!</p>
            <p className="text-xs text-[#525252] mt-1">
              Every experience has been categorized.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Stack effect layers (behind the top card) */}
            {totalBullets >= 3 && (
              <div
                className="absolute top-0 left-0 right-0 h-[120px] bg-white/70 border border-black/10 rounded-xl shadow-sm"
                style={{
                  transform: 'translate(-8px, -8px)',
                  zIndex: 0,
                }}
              />
            )}
            {totalBullets >= 2 && (
              <div
                className="absolute top-0 left-0 right-0 h-[120px] bg-white/80 border border-black/10 rounded-xl shadow-sm"
                style={{
                  transform: 'translate(-4px, -4px)',
                  zIndex: 1,
                }}
              />
            )}

            {/* Top card - the draggable bullet with fixed height */}
            <div className="relative z-10">
              <DraggableBullet
                key={topBullet.id}
                bullet={topBullet}
                onDuplicate={() => onDuplicate(topBullet)}
                onDelete={isDuplicate(topBullet.id) ? () => onDeleteDuplicate(topBullet.id) : undefined}
                fixedHeight
              />
            </div>

            {/* Remaining count indicator */}
            {remainingCount > 0 && (
              <p className="text-xs text-white/70 text-center mt-3">
                {remainingCount} more {remainingCount === 1 ? 'experience' : 'experiences'} remaining
              </p>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      {bullets.length > 0 && (
        <p className="text-xs text-white/60 mt-3 leading-relaxed text-center max-w-sm">
          Drag to a category corner. Use the copy button to place in multiple categories.
        </p>
      )}
    </div>
  );
}
