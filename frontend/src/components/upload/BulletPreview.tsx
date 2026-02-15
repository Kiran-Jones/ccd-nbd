import { useState } from 'react';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { BulletPoint } from '../../types/BulletPoint';
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
    <div className="h-[100dvh] bg-[#469B57] flex flex-col px-6 md:px-10 py-6 md:py-8">
      {/* Step number */}
      <div className="mb-4 md:mb-6 shrink-0">
        <p className="text-5xl md:text-7xl font-bold text-[#003D1C]">05</p>
      </div>

      {/* Heading */}
      <div className="text-center mb-4 md:mb-6 shrink-0">
        <h2 className="text-2xl md:text-3xl font-medium tracking-[0.12em] text-white mb-2 uppercase">
          Review Your Experiences
        </h2>
        <p className="text-white text-sm md:text-base">
          Compare your original resume with the extracted experiences. Edit or add items as needed.
        </p>
      </div>

      {/* Two-column grid — fills remaining space */}
      <div className="flex-1 min-h-0 max-w-6xl mx-auto w-full">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: Resume Viewer */}
          <div className="bg-white/80 rounded-xl overflow-hidden flex flex-col min-h-0">
            {/* Collapsible header on mobile */}
            <button
              onClick={() => setShowResume(!showResume)}
              className="lg:hidden w-full px-6 py-3 flex items-center justify-between border-b border-black/10 shrink-0"
            >
              <h3 className="text-lg font-medium text-[#262626]">Original Resume</h3>
              {showResume ? (
                <ChevronUp size={20} className="text-[#525252]" />
              ) : (
                <ChevronDown size={20} className="text-[#525252]" />
              )}
            </button>

            {/* Desktop header */}
            <div className="hidden lg:block px-6 py-3 border-b border-black/10 shrink-0">
              <h3 className="text-lg font-medium text-[#262626]">Original Resume</h3>
              <p className="text-sm text-[#525252] mt-1">
                Compare with extracted experiences
              </p>
            </div>

            {/* Resume content — fills remaining column height */}
            <div
              className={`${
                showResume ? 'block' : 'hidden'
              } lg:block flex-1 min-h-0 overflow-auto`}
            >
              <ResumeViewer file={file} />
            </div>
          </div>

          {/* Right column: Bullet List */}
          <div className="bg-white/80 rounded-xl flex flex-col min-h-0">
            {/* Header */}
            <div className="px-6 py-3 border-b border-black/10 shrink-0">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-medium text-[#262626]">
                  Extracted Experiences
                </h3>
                <span className="text-sm text-[#525252]">
                  {validBullets.length} item{validBullets.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-[#525252] mt-1">
                Edit, remove, or add items
              </p>
            </div>

            {/* Bullet list — scrolls within remaining space */}
            <div className="flex-1 min-h-0 px-6 py-4 overflow-y-auto">
              <div className="space-y-3">
                {editedBullets.map((bullet, index) => (
                  <div
                    key={bullet.id}
                    className="flex items-start gap-3 p-3 bg-white/60 rounded-xl transition-colors"
                  >
                    <span className="text-[#525252]/60 text-sm font-medium min-w-[20px] pt-2">
                      {index + 1}.
                    </span>
                    <textarea
                      value={bullet.text}
                      onChange={(e) => handleTextChange(bullet.id, e.target.value)}
                      className="flex-1 p-2 bg-white rounded-xl text-[#262626] text-sm leading-relaxed resize-none border-0 focus:outline-none focus:ring-2 focus:ring-[#469B57]/30"
                      rows={2}
                      placeholder="Describe an experience..."
                    />
                    <button
                      onClick={() => handleDelete(bullet.id)}
                      className="p-1.5 text-[#525252]/60 hover:text-[#9D162E] rounded transition-colors"
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
                className="flex items-center gap-2 mt-4 text-[#003D1C] hover:text-[#003D1C]/80 font-medium text-sm transition-colors"
              >
                <Plus size={16} />
                Add another experience
              </button>
            </div>

            {/* Footer with continue button */}
            <div className="px-6 py-3 border-t border-black/10 flex justify-end shrink-0">
              <button
                onClick={() => onConfirm(validBullets)}
                disabled={validBullets.length === 0}
                className="px-10 py-3 bg-[#366946] text-white uppercase tracking-[0.16em] text-sm md:text-base font-medium rounded-xl hover:bg-[#2E5A3C] active:bg-[#264D33] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {validBullets.length === 0 && (
          <p className="text-center text-white/70 text-sm mt-4">
            Add at least one experience to continue.
          </p>
        )}
      </div>

      {/* Back button — always visible at bottom */}
      <div className="shrink-0 pt-4">
        <button
          onClick={onBack}
          className="text-[#003D1C]/70 hover:text-[#003D1C] text-sm font-medium transition-colors"
        >
          &larr; Back
        </button>
      </div>
    </div>
  );
}
