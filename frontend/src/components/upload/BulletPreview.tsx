import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { BulletPoint } from '../../types/BulletPoint';
import Button from '../common/Button';

interface Props {
  bullets: BulletPoint[];
  onConfirm: (editedBullets: BulletPoint[]) => void;
  onBack: () => void;
}

export default function BulletPreview({ bullets, onConfirm, onBack }: Props) {
  const [editedBullets, setEditedBullets] = useState<BulletPoint[]>(bullets);

  const handleTextChange = (id: string, newText: string) => {
    setEditedBullets((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              text: newText,
              formatting: {
                bold: Array(newText.length).fill(false),
                italic: Array(newText.length).fill(false),
              },
            }
          : b
      )
    );
  };

  const handleDelete = (id: string) => {
    setEditedBullets((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAdd = () => {
    const newBullet: BulletPoint = {
      id: `new-${Date.now()}`,
      text: '',
      formatting: { bold: [], italic: [] },
      original_index: editedBullets.length,
    };
    setEditedBullets((prev) => [...prev, newBullet]);
  };

  const validBullets = editedBullets.filter((b) => b.text.trim());

  return (
    <div className="max-w-3xl mx-auto">
      {/* Card container */}
      <div className="bg-white border border-[#E5E5E5] rounded-md shadow-sm">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#E5E5E5]">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-[#262626]">
              Review Your Experiences
            </h2>
            <span className="text-sm text-[#737373]">
              {validBullets.length} item{validBullets.length !== 1 ? 's' : ''} found
            </span>
          </div>
          <p className="text-[#525252] mt-2 leading-relaxed">
            Review the bullet points extracted from your resume. You can edit,
            remove, or add new items before categorizing them.
          </p>
        </div>

        {/* Bullet list */}
        <div className="px-8 py-6">
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {editedBullets.map((bullet, index) => (
              <div
                key={bullet.id}
                className="flex items-start gap-4 p-4 bg-[#F5F5F5] rounded border border-transparent hover:border-[#D4D4D4] transition-colors"
              >
                <span className="text-[#A3A3A3] text-sm font-medium min-w-[24px] pt-2">
                  {index + 1}.
                </span>
                <textarea
                  value={bullet.text}
                  onChange={(e) => handleTextChange(bullet.id, e.target.value)}
                  className="flex-1 p-3 bg-white border border-[#D4D4D4] rounded text-[#262626] text-base leading-relaxed resize-none focus:outline-none focus:border-[#00693E] focus:ring-1 focus:ring-[#00693E]/10"
                  rows={2}
                  placeholder="Describe an experience or accomplishment..."
                />
                <button
                  onClick={() => handleDelete(bullet.id)}
                  className="p-2 text-[#A3A3A3] hover:text-[#9D162E] hover:bg-[#FFEBEE] rounded transition-colors"
                  title="Remove this item"
                  aria-label="Remove this item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Add button */}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 mt-4 text-[#00693E] hover:text-[#003D1C] font-medium transition-colors"
          >
            <Plus size={18} />
            Add another experience
          </button>
        </div>

        {/* Footer actions */}
        <div className="px-8 py-6 bg-[#F5F5F5] border-t border-[#E5E5E5] flex justify-between items-center rounded-b-md">
          <Button variant="text" onClick={onBack}>
            Go Back
          </Button>
          <Button
            onClick={() => onConfirm(validBullets)}
            disabled={validBullets.length === 0}
          >
            Continue to Categorization
          </Button>
        </div>
      </div>

      {/* Helper text */}
      {validBullets.length === 0 && (
        <p className="text-center text-[#737373] text-sm mt-6">
          Add at least one experience to continue.
        </p>
      )}
    </div>
  );
}
