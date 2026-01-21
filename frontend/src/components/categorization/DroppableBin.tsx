import { useDroppable } from '@dnd-kit/core';
import { X } from 'lucide-react';
import { Bin } from '../../types/Bin';
import { BinConfig } from '../../config/bins';

interface Props {
  bin: Bin;
  config: BinConfig;
  onRemoveBullet: (bulletId: string) => void;
}

export default function DroppableBin({ bin, config, onRemoveBullet }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: bin.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-md min-h-[180px] transition-all duration-200
        border-2
        ${isOver ? 'ring-2 ring-offset-2' : ''}
      `}
      style={{
        backgroundColor: isOver ? `${config.color}10` : '#FAFAFA',
        borderColor: isOver ? config.color : '#E5E5E5',
        // @ts-expect-error CSS custom property
        '--ring-color': config.color,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={{
          backgroundColor: `${config.color}08`,
          borderColor: '#E5E5E5',
        }}
      >
        <div className="flex items-center justify-between">
          <h4
            className="font-serif text-lg"
            style={{ color: config.color }}
          >
            {config.label}
          </h4>
          <span
            className="text-xs font-medium px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: config.color }}
          >
            {bin.bullets.length}
          </span>
        </div>
        <p className="text-xs text-[#737373] mt-1">{config.description}</p>
      </div>

      {/* Bullets */}
      <div className="p-3 space-y-2">
        {bin.bullets.length === 0 ? (
          <div
            className="py-8 text-center border-2 border-dashed rounded"
            style={{ borderColor: '#D4D4D4' }}
          >
            <p className="text-sm text-[#A3A3A3]">Drop items here</p>
          </div>
        ) : (
          bin.bullets.map((bullet) => (
            <div
              key={bullet.id}
              className="flex items-start gap-2 p-2.5 bg-white rounded border border-[#E5E5E5] group"
            >
              <p className="flex-1 text-sm text-[#404040] leading-relaxed">
                {bullet.text}
              </p>
              <button
                onClick={() => onRemoveBullet(bullet.id)}
                className="p-1 text-[#A3A3A3] hover:text-[#9D162E] hover:bg-[#FFEBEE] rounded opacity-0 group-hover:opacity-100 transition-all"
                title="Remove from this category"
                aria-label="Remove from this category"
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
