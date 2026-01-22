import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Copy, Trash2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { BulletPoint } from '../../types/BulletPoint';

interface Props {
  bullet: BulletPoint;
  onDuplicate?: () => void;
  onDelete?: () => void;
  fixedHeight?: boolean;
}

export default function DraggableBullet({ bullet, onDuplicate, onDelete, fixedHeight }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: bullet.id,
      data: bullet,
    });

  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Check if text is overflowing
  useEffect(() => {
    if (textRef.current && fixedHeight) {
      setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [bullet.text, fixedHeight]);

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
      {...listeners}
      {...attributes}
      className={`
        bg-white border border-[#E5E5E5] rounded-md p-3 shadow-sm
        transition-all duration-200 cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 shadow-lg z-50' : 'hover:border-[#D4D4D4] hover:shadow-md'}
        ${fixedHeight ? 'h-[120px] overflow-hidden' : ''}
      `}
    >
      <div className={`flex items-start gap-3 ${fixedHeight ? 'h-full' : ''}`}>
        <div className={`flex-1 min-h-0 overflow-hidden relative ${fixedHeight ? 'h-full' : ''}`}>
          <p
            ref={textRef}
            className={`text-sm text-[#404040] leading-relaxed ${fixedHeight ? 'overflow-y-auto h-full pr-1' : ''}`}
          >
            {renderFormattedText()}
          </p>
          {/* Fade gradient for overflow indication */}
          {fixedHeight && isOverflowing && (
            <div
              className="absolute bottom-0 left-0 right-2 h-6 pointer-events-none"
              style={{
                background: 'linear-gradient(transparent, white)',
              }}
            />
          )}
        </div>

        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-2 text-[#737373] hover:text-[#9D162E] hover:bg-[#FFEBEE] rounded-md transition-all hover:scale-110"
              title="Delete duplicate"
              aria-label="Delete this duplicate"
            >
              <Trash2 size={18} />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDuplicate();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-2 text-[#737373] hover:text-[#00693E] hover:bg-[#E8F5E9] rounded-md transition-all hover:scale-110 border border-transparent hover:border-[#00693E]/20"
              title="Create a copy"
              aria-label="Create a copy of this item"
            >
              <Copy size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
