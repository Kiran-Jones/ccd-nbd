import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Bin } from '../../types/Bin';
import { BINS } from '../../config/bins';

interface Props {
  bins: Bin[];
}

export default function BinList({ bins }: Props) {
  const [expandedBins, setExpandedBins] = useState<Set<string>>(
    new Set(bins.filter((b) => b.bullets.length > 0).map((b) => b.id))
  );

  const toggleBin = (binId: string) => {
    setExpandedBins((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(binId)) {
        newSet.delete(binId);
      } else {
        newSet.add(binId);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-md">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[#E5E5E5]">
        <h3 className="font-serif text-2xl text-[#262626]">
          Your Categorized Experiences
        </h3>
        <p className="text-[#525252] mt-2">
          Review the experiences you placed in each category
        </p>
      </div>

      {/* Categories */}
      <div className="divide-y divide-[#E5E5E5]">
        {bins.map((bin) => {
          const config = BINS.find((c) => c.id === bin.id);
          const isExpanded = expandedBins.has(bin.id);
          const hasItems = bin.bullets.length > 0;

          return (
            <div key={bin.id}>
              {/* Category Header */}
              <button
                onClick={() => hasItems && toggleBin(bin.id)}
                className={`
                  w-full flex items-center gap-4 px-8 py-5 text-left transition-colors
                  ${hasItems ? 'hover:bg-[#F5F5F5] cursor-pointer' : 'cursor-default'}
                `}
                disabled={!hasItems}
              >
                <div
                  className="w-1 h-10 rounded-full"
                  style={{ backgroundColor: config?.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4
                      className="font-serif text-lg"
                      style={{ color: hasItems ? config?.color : '#A3A3A3' }}
                    >
                      {config?.label}
                    </h4>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: hasItems ? config?.color : '#E5E5E5',
                        color: hasItems ? 'white' : '#A3A3A3',
                      }}
                    >
                      {bin.bullets.length}
                    </span>
                  </div>
                  <p className="text-sm text-[#737373] mt-0.5">
                    {config?.description}
                  </p>
                </div>
                {hasItems && (
                  <div className="text-[#737373]">
                    {isExpanded ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </div>
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && hasItems && (
                <div className="px-8 pb-6">
                  <ul className="space-y-3 pl-5">
                    {bin.bullets.map((bullet) => (
                      <li
                        key={bullet.id}
                        className="flex items-start gap-3 text-[#404040]"
                      >
                        <span
                          className="mt-2 w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: config?.color }}
                        />
                        <span className="leading-relaxed">{bullet.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
