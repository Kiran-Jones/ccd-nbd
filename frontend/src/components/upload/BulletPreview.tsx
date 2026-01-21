import { useState } from 'react';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { BulletPoint } from '../../types/BulletPoint';
import Button from '../common/Button';
import ResumeViewer from './ResumeViewer';

interface Props {
  bullets: BulletPoint[];
  file: File | null;
  onConfirm: (editedBullets: BulletPoint[]) => void;
  onBack: () => void;
}

export default function BulletPreview({ bullets, file, onConfirm, onBack }: Props) {
  const [editedBullets, setEditedBullets] = useState<BulletPoint[]>(bullets);
  const [showResume, setShowResume] = useState(true);

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
    <div className="w-full">
      {/* Two-column layout on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Resume Viewer */}
        <div className="bg-white border border-[#E5E5E5] rounded-md shadow-sm overflow-hidden">
          {/* Collapsible header on mobile */}
          <button
            onClick={() => setShowResume(!showResume)}
            className="lg:hidden w-full px-6 py-4 flex items-center justify-between border-b border-[#E5E5E5] bg-[#F5F5F5]"
          >
            <h3 className="font-serif text-lg text-[#262626]">Original Resume</h3>
            {showResume ? (
              <ChevronUp size={20} className="text-[#737373]" />
            ) : (
              <ChevronDown size={20} className="text-[#737373]" />
            )}
          </button>

          {/* Desktop header */}
          <div className="hidden lg:block px-6 py-4 border-b border-[#E5E5E5]">
            <h3 className="font-serif text-lg text-[#262626]">Original Resume</h3>
            <p className="text-sm text-[#737373] mt-1">
              Compare with extracted experiences
            </p>
          </div>

          {/* Resume content */}
          <div
            className={`${
              showResume ? 'block' : 'hidden'
            } lg:block h-[500px] lg:h-[600px]`}
          >
            <ResumeViewer file={file} />
          </div>
        </div>

        {/* Right column: Bullet List */}
        <div className="bg-white border border-[#E5E5E5] rounded-md shadow-sm flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E5E5E5]">
            <div className="flex items-baseline justify-between">
              <h3 className="font-serif text-lg text-[#262626]">
                Extracted Experiences
              </h3>
              <span className="text-sm text-[#737373]">
                {validBullets.length} item{validBullets.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-sm text-[#737373] mt-1">
              Edit, remove, or add items
            </p>
          </div>

          {/* Bullet list */}
          <div className="flex-1 px-6 py-4 overflow-hidden">
            <div className="space-y-3 h-[400px] lg:h-[480px] overflow-y-auto pr-2">
              {editedBullets.map((bullet, index) => (
                <div
                  key={bullet.id}
                  className="flex items-start gap-3 p-3 bg-[#F5F5F5] rounded border border-transparent hover:border-[#D4D4D4] transition-colors"
                >
                  <span className="text-[#A3A3A3] text-sm font-medium min-w-[20px] pt-2">
                    {index + 1}.
                  </span>
                  <textarea
                    value={bullet.text}
                    onChange={(e) => handleTextChange(bullet.id, e.target.value)}
                    className="flex-1 p-2 bg-white border border-[#D4D4D4] rounded text-[#262626] text-sm leading-relaxed resize-none focus:outline-none focus:border-[#00693E] focus:ring-1 focus:ring-[#00693E]/10"
                    rows={2}
                    placeholder="Describe an experience..."
                  />
                  <button
                    onClick={() => handleDelete(bullet.id)}
                    className="p-1.5 text-[#A3A3A3] hover:text-[#9D162E] hover:bg-[#FFEBEE] rounded transition-colors"
                    title="Remove"
                    aria-label="Remove this item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add button */}
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 mt-4 text-[#00693E] hover:text-[#003D1C] font-medium text-sm transition-colors"
            >
              <Plus size={16} />
              Add another experience
            </button>
          </div>

          {/* Footer actions */}
          <div className="px-6 py-4 bg-[#F5F5F5] border-t border-[#E5E5E5] flex justify-between items-center">
            <Button variant="text" onClick={onBack}>
              Go Back
            </Button>
            <Button
              onClick={() => onConfirm(validBullets)}
              disabled={validBullets.length === 0}
            >
              Continue to Categorize
            </Button>
          </div>
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
