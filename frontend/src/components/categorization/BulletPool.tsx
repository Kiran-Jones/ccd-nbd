import { BulletPoint } from '../../types/BulletPoint';
import DraggableBullet from './DraggableBullet';
import ProgressIndicator from '../common/ProgressIndicator';

interface Props {
  bullets: BulletPoint[];
  totalBullets: number;
  onDuplicate: (bullet: BulletPoint) => void;
}

export default function BulletPool({ bullets, totalBullets, onDuplicate }: Props) {
  const categorized = totalBullets - bullets.length;

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-md h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#E5E5E5]">
        <h3 className="font-serif text-xl text-[#262626] mb-4">
          Your Experiences
        </h3>
        <ProgressIndicator
          current={categorized}
          total={totalBullets}
          label="Categorized"
        />
      </div>

      {/* Bullet list */}
      <div className="p-6">
        <div className="space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto pr-2">
          {bullets.length === 0 ? (
            <div className="text-center py-12">
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
            bullets.map((bullet) => (
              <DraggableBullet
                key={bullet.id}
                bullet={bullet}
                onDuplicate={() => onDuplicate(bullet)}
              />
            ))
          )}
        </div>

        {bullets.length > 0 && (
          <p className="text-sm text-[#737373] mt-6 leading-relaxed">
            Drag each item to a category on the right. Use the copy button to
            place an item in multiple categories.
          </p>
        )}
      </div>
    </div>
  );
}
