interface Props {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressIndicator({ current, total, label }: Props) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-[#525252] mb-2 font-sans">
          <span className="font-medium">{label}</span>
          <span>
            {current} of {total} ({percentage}%)
          </span>
        </div>
      )}
      <div className="w-full bg-[#E5E5E5] rounded-full h-2">
        <div
          className="bg-[#00693E] h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
