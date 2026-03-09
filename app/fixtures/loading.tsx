/**
 * Loading skeleton for fixtures page.
 */
export default function FixturesLoading() {
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header skeleton */}
      <div className="h-[60px] border-b border-[#f0f0f0] flex items-center px-6 gap-6">
        <div className="skeleton w-[100px] h-6 rounded-md" />
        <div className="skeleton flex-1 max-w-[400px] h-[36px] rounded-[8px]" />
        <div className="ml-auto flex items-center gap-3">
          <div className="skeleton w-20 h-8 rounded-[8px]" />
          <div className="skeleton w-8 h-8 rounded-full" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block w-[240px] border-r border-[#f0f0f0] p-6">
          <div className="skeleton w-20 h-3 rounded mb-4" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2.5">
              <div className="skeleton w-5 h-5 rounded" />
              <div className="skeleton flex-1 h-4 rounded" />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-10">
          <div className="flex items-center justify-between mb-6">
            <div className="skeleton w-32 h-8 rounded-md" />
            <div className="skeleton w-28 h-8 rounded-[8px]" />
          </div>
          {/* Tab bar skeleton */}
          <div className="flex gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton w-20 h-8 rounded-md" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="skeleton h-[120px] rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
