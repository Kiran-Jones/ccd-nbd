import { Analytics } from '../../types/Analytics';

interface Props {
  analytics: Analytics;
}

export default function InsightsPanel({ analytics }: Props) {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-md">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[#E5E5E5]">
        <h3 className="font-serif text-2xl text-[#262626]">
          Insights & Reflections
        </h3>
        <p className="text-[#525252] mt-2">
          Observations based on your categorization choices
        </p>
      </div>

      <div className="p-8">
        {/* Top Category Highlight */}
        <div className="bg-[#00693E] text-white rounded-md p-6 mb-8">
          <p className="text-sm uppercase tracking-wide opacity-80 mb-2">
            Strongest Emphasis
          </p>
          <p className="font-serif text-2xl">
            {analytics.top_category}
          </p>
          <p className="text-sm opacity-90 mt-2 leading-relaxed">
            Your resume shows the most experiences in this category,
            suggesting it may be central to your professional identity.
          </p>
        </div>

        {/* Suggestions */}
        <div>
          <h4 className="font-serif text-lg text-[#262626] mb-4">
            Things to Consider
          </h4>

          {analytics.suggestions.length === 0 ? (
            <p className="text-[#737373]">
              Complete your categorization to receive personalized insights.
            </p>
          ) : (
            <ul className="space-y-4">
              {analytics.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 p-4 bg-[#F5F5F5] rounded-md"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-[#00693E] text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-[#404040] leading-relaxed">{suggestion}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reflection Prompt */}
        <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
          <p className="text-sm text-[#737373] italic leading-relaxed">
            "Your resume tells a story. Consider how these categories
            reflect not just what you've done, but who you're becoming
            as a professional."
          </p>
        </div>
      </div>
    </div>
  );
}
