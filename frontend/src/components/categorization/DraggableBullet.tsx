import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Copy, GripVertical } from 'lucide-react';
import { BulletPoint } from '../../types/BulletPoint';

interface Props {
  bullet: BulletPoint;
  onDuplicate?: () => void;
}

export default function DraggableBullet({ bullet, onDuplicate }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: bullet.id,
      data: bullet,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const renderFormattedText = () => {
    if (!bullet.formatting.bold.length && !bullet.formatting.italic.length) {
      return bullet.text;
    }

    return bullet.text.split('').map((char, idx) => {
      const isBold = bullet.formatting.bold[idx];
      const isItalic = bullet.formatting.italic[idx];

      let className = '';
      if (isBold && isItalic) className = 'font-semibold italic';
      else if (isBold) className = 'font-semibold';
      else if (isItalic) className = 'italic';

      return (
        <span key={idx} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white border border-[#E5E5E5] rounded p-3
        transition-all duration-200
        ${isDragging ? 'opacity-50 shadow-lg z-50' : 'hover:border-[#D4D4D4] hover:shadow-sm'}
      `}
    >
      <div className="flex items-start gap-3">
        <button
          {...listeners}
          {...attributes}
          className="text-[#A3A3A3] hover:text-[#737373] cursor-grab active:cursor-grabbing mt-0.5 transition-colors"
          aria-label="Drag to categorize"
        >
          <GripVertical size={16} />
        </button>
        <p className="flex-1 text-sm text-[#404040] leading-relaxed">
          {renderFormattedText()}
        </p>

        {onDuplicate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1.5 text-[#A3A3A3] hover:text-[#00693E] hover:bg-[#F5F5F5] rounded transition-colors"
            title="Create a copy"
            aria-label="Create a copy of this item"
          >
            <Copy size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
