/**
 * Exact-replica skeleton of the PredictionDetailPage.
 * Matches the real page's layout, sizes, spacing, and structure
 * so the loading state feels like the content is "painting in".
 */
export function PredictionDetailSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 md:px-6 py-5">
      {/* Back link */}
      <div className="flex items-center gap-1.5 mb-5">
        <div className="skeleton w-3.5 h-3.5 rounded" />
        <div className="skeleton h-3.5 w-32 rounded" />
      </div>

      {/* Match header */}
      <div className="mb-6">
        {/* League row */}
        <div className="flex items-center gap-2 mb-2">
          <div className="skeleton w-5 h-5 rounded-full" />
          <div className="skeleton h-3.5 w-24 rounded" />
          <div className="skeleton h-[20px] w-16 rounded" />
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between mb-4">
          <div className="skeleton h-7 w-72 md:w-96 rounded" />
          <div className="skeleton w-[18px] h-[18px] rounded" />
        </div>

        {/* Teams display card */}
        <div className="flex items-center gap-8 py-5 px-6 bg-white rounded-[12px] border border-[#f0f0f0]">
          {/* Home team */}
          <div className="flex items-center gap-3 flex-1">
            <div className="skeleton w-10 h-10 rounded-full shrink-0" />
            <div>
              <div className="skeleton h-4 w-28 rounded mb-1.5" />
              <div className="skeleton h-3 w-10 rounded" />
            </div>
          </div>

          {/* VS / Score */}
          <div className="text-center px-4">
            <div className="skeleton h-6 w-10 rounded mx-auto mb-1" />
            <div className="skeleton h-3 w-12 rounded mx-auto" />
          </div>

          {/* Away team */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="text-right">
              <div className="skeleton h-4 w-28 rounded mb-1.5 ml-auto" />
              <div className="skeleton h-3 w-10 rounded ml-auto" />
            </div>
            <div className="skeleton w-10 h-10 rounded-full shrink-0" />
          </div>
        </div>
      </div>

      {/* AI Prediction — 3-column grid */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="skeleton w-4 h-4 rounded" />
          <div className="skeleton h-4 w-28 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Match Result card */}
          <div className="p-4 bg-white border border-[#f0f0f0] rounded-[12px]">
            <div className="skeleton h-3 w-24 rounded mb-3" />
            <div className="space-y-2">
              <div className="skeleton h-[40px] w-full rounded-[8px]" />
              <div className="skeleton h-[40px] w-full rounded-[8px]" />
              <div className="skeleton h-[40px] w-full rounded-[8px]" />
            </div>
          </div>

          {/* Expected Goals card */}
          <div className="p-4 bg-white border border-[#f0f0f0] rounded-[12px]">
            <div className="skeleton h-3 w-28 rounded mb-3" />
            <div className="flex items-center justify-center gap-6 py-4">
              <div className="text-center min-w-[80px]">
                <div className="skeleton h-3 w-10 rounded mx-auto mb-2" />
                <div className="skeleton w-8 h-8 rounded-full mx-auto mb-2" />
                <div className="skeleton h-7 w-6 rounded mx-auto mb-1" />
                <div className="skeleton h-2.5 w-8 rounded mx-auto" />
              </div>
              <div className="skeleton h-5 w-3 rounded" />
              <div className="text-center min-w-[80px]">
                <div className="skeleton h-3 w-10 rounded mx-auto mb-2" />
                <div className="skeleton w-8 h-8 rounded-full mx-auto mb-2" />
                <div className="skeleton h-7 w-6 rounded mx-auto mb-1" />
                <div className="skeleton h-2.5 w-8 rounded mx-auto" />
              </div>
            </div>
          </div>

          {/* Value Bets card */}
          <div className="p-4 bg-white border border-[#f0f0f0] rounded-[12px]">
            <div className="skeleton h-3 w-20 rounded mb-3" />
            <div className="space-y-2.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="skeleton h-3 w-24 rounded" />
                  <div className="flex items-center gap-2">
                    <div className="skeleton h-3 w-8 rounded" />
                    <div className="skeleton h-3 w-10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Confidence + Match Info — 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* AI Confidence */}
        <div className="p-5 bg-white border border-[#f0f0f0] rounded-[12px]">
          <div className="flex items-center gap-2 mb-4">
            <div className="skeleton w-4 h-4 rounded" />
            <div className="skeleton h-4 w-24 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="skeleton w-[80px] h-[80px] rounded-full shrink-0" />
            <div className="flex-1">
              <div className="skeleton h-3.5 w-36 rounded mb-2" />
              <div className="skeleton h-3 w-full rounded mb-1" />
              <div className="skeleton h-3 w-3/4 rounded" />
            </div>
          </div>
        </div>

        {/* Match Info */}
        <div className="p-5 bg-white border border-[#f0f0f0] rounded-[12px]">
          <div className="skeleton h-4 w-20 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="skeleton w-3.5 h-3.5 rounded" />
                    <div className="skeleton h-3 w-12 rounded" />
                  </div>
                  <div className="skeleton h-3.5 w-28 rounded" />
                </div>
                {i < 2 && <div className="h-px bg-[#f0f0f0] mt-3" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Factors + Risk Factors — 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Key Factors */}
        <div className="p-5 bg-white border border-[#f0f0f0] rounded-[12px]">
          <div className="flex items-center gap-2 mb-3">
            <div className="skeleton w-4 h-4 rounded" />
            <div className="skeleton h-4 w-24 rounded" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="skeleton w-3.5 h-3.5 rounded shrink-0 mt-0.5" />
                <div className="skeleton h-3 rounded" style={{ width: `${70 + (i * 17) % 30}%` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="p-5 bg-white border border-[#f0f0f0] rounded-[12px]">
          <div className="flex items-center gap-2 mb-3">
            <div className="skeleton w-4 h-4 rounded" />
            <div className="skeleton h-4 w-24 rounded" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="skeleton w-3.5 h-3.5 rounded shrink-0 mt-0.5" />
                <div className="skeleton h-3 rounded" style={{ width: `${65 + (i * 23) % 35}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Injuries table skeleton */}
      <div className="bg-white border border-[#f0f0f0] rounded-[12px] mb-6 overflow-hidden">
        <div className="flex items-center gap-2 px-5 pt-5 pb-3">
          <div className="skeleton w-4 h-4 rounded" />
          <div className="skeleton h-4 w-40 rounded" />
          <div className="skeleton h-[18px] w-16 rounded-full ml-auto" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-t border-b border-[#f0f0f0] bg-[#fafafa]">
                <th className="px-5 py-2.5"><div className="skeleton h-2.5 w-12 rounded" /></th>
                <th className="px-3 py-2.5"><div className="skeleton h-2.5 w-10 rounded" /></th>
                <th className="px-3 py-2.5"><div className="skeleton h-2.5 w-20 rounded" /></th>
                <th className="px-3 py-2.5"><div className="skeleton h-2.5 w-12 rounded" /></th>
                <th className="px-3 py-2.5 text-center"><div className="skeleton h-2.5 w-12 rounded mx-auto" /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-[#f5f5f5] last:border-b-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="skeleton w-7 h-7 rounded-full shrink-0" />
                      <div className="skeleton h-3 rounded" style={{ width: `${60 + (i * 19) % 40}px` }} />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="skeleton w-4 h-4 rounded-full" />
                      <div className="skeleton h-3 w-8 rounded" />
                    </div>
                  </td>
                  <td className="px-3 py-3"><div className="skeleton h-3 w-20 rounded" /></td>
                  <td className="px-3 py-3"><div className="skeleton h-[18px] w-16 rounded-full" /></td>
                  <td className="px-3 py-3 text-center"><div className="skeleton h-3 w-10 rounded mx-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Research section skeleton */}
      <div className="p-5 bg-white border border-[#f0f0f0] rounded-[12px] mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="skeleton w-4 h-4 rounded" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>
        <div className="space-y-2.5">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-[95%] rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-[88%] rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-[92%] rounded" />
          <div className="skeleton h-3 w-[75%] rounded" />
        </div>
        {/* Citation source pills */}
        <div className="mt-4 pt-3 border-t border-[#f0f0f0]">
          <div className="skeleton h-2.5 w-14 rounded mb-2" />
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-[26px] rounded-md" style={{ width: `${70 + (i * 23) % 50}px` }} />
            ))}
          </div>
        </div>
      </div>

      {/* AI Analysis section skeleton */}
      <div className="p-5 bg-white border border-[#f0f0f0] rounded-[12px] mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="skeleton w-4 h-4 rounded" />
          <div className="skeleton h-4 w-24 rounded" />
        </div>
        <div className="space-y-2.5">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-[90%] rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-[85%] rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-[93%] rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-[70%] rounded" />
        </div>
      </div>
    </main>
  );
}
