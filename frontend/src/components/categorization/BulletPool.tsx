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
      <h3 className="font-serif text-xl text-[#262626] mb-2 text-center">
        Your Experiences
      </h3>

      {/* Stack container */}
      <div className="relative w-full max-w-sm pl-4 pb-4">
        {bullets.length === 0 ? (
          <div className="text-center py-12 bg-white border border-[#E5E5E5] rounded-md">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#E8F5E9] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[#00693E]"
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
            <p className="text-[#404040] font-medium">All done!</p>
            <p className="text-sm text-[#737373] mt-1">
              Every experience has been categorized.
            </p>
          </div>
        ) : (
          <>
            {/* Stack effect layers (behind the top card) */}
            {totalBullets >= 3 && (
              <div
                className="absolute inset-0 bg-white border border-[#E5E5E5] rounded-md"
                style={{
                  transform: 'translate(-12px, 12px)',
                  zIndex: 0,
                }}
              />
            )}
            {totalBullets >= 2 && (
              <div
                className="absolute inset-0 bg-white border border-[#E5E5E5] rounded-md"
                style={{
                  transform: 'translate(-6px, 6px)',
                  zIndex: 1,
                }}
              />
            )}

            {/* Top card - the draggable bullet */}
            <div className="relative z-10">
              <DraggableBullet
                key={topBullet.id}
                bullet={topBullet}
                onDuplicate={() => onDuplicate(topBullet)}
                onDelete={isDuplicate(topBullet.id) ? () => onDeleteDuplicate(topBullet.id) : undefined}
              />
            </div>

            {/* Remaining count indicator */}
            {remainingCount > 0 && (
              <p className="text-xs text-[#737373] text-center mt-2">
                {remainingCount} more {remainingCount === 1 ? 'experience' : 'experiences'} remaining
              </p>
            )}
          </>
        )}
      </div>

      {/* Instructions */}
      {bullets.length > 0 && (
        <p className="text-sm text-[#737373] mt-3 leading-relaxed text-center max-w-sm">
          Drag to a category corner. Use the copy button to place in multiple categories.
        </p>
      )}
    </div>
  );
}
