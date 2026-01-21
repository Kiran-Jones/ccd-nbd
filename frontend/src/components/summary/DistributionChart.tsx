import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Analytics } from '../../types/Analytics';
import { Bin } from '../../types/Bin';
import { BINS } from '../../config/bins';

interface Props {
  analytics: Analytics;
  bins: Bin[];
}

export default function DistributionChart({ analytics, bins }: Props) {
  const data = analytics.distribution.map((dist) => {
    const bin = bins.find((b) => b.id === dist.bin_id);
    const config = BINS.find((c) => c.id === dist.bin_id);
    return {
      name: bin?.label || dist.bin_id,
      count: dist.count,
      percentage: dist.percentage,
      color: config?.color || '#737373',
    };
  });

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-md">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[#E5E5E5]">
        <h3 className="font-serif text-2xl text-[#262626]">
          Your Profile Distribution
        </h3>
        <p className="text-[#525252] mt-2">
          See how your experiences are distributed across categories
        </p>
      </div>

      {/* Chart */}
      <div className="p-8">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: '#737373', fontSize: 12 }}
                axisLine={{ stroke: '#E5E5E5' }}
                tickLine={{ stroke: '#E5E5E5' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#404040', fontSize: 14, fontFamily: 'Georgia, serif' }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-white border border-[#E5E5E5] rounded-md p-3 shadow-md">
                        <p className="font-serif text-[#262626] font-medium">
                          {item.name}
                        </p>
                        <p className="text-sm text-[#525252] mt-1">
                          {item.count} experience{item.count !== 1 ? 's' : ''} ({item.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={28}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
          <div className="flex flex-wrap gap-6 justify-center">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-[#525252]">
                  {item.name}: {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
