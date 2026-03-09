/**
 * Exact-replica skeleton of FixtureCard.
 * Matches the real card's layout, sizes, and spacing pixel-for-pixel.
 */
export function FixtureCardSkeleton() {
  return (
    <div className="w-full bg-white rounded-[14px] border border-[#eaeaea] overflow-hidden">
      {/* Top bar — league + time */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <div className="flex items-center gap-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-[18px] w-14 rounded" />
        </div>
        <div className="skeleton h-3 w-10 rounded" />
      </div>

      {/* Teams */}
      <div className="px-4 pb-4">
        <div className="space-y-2.5">
          {/* Home team */}
          <div className="flex items-center gap-2.5">
            <div className="skeleton w-8 h-8 rounded-full shrink-0" />
            <div className="skeleton h-4 w-28 rounded" />
          </div>
          {/* Away team */}
          <div className="flex items-center gap-2.5">
            <div className="skeleton w-8 h-8 rounded-full shrink-0" />
            <div className="skeleton h-4 w-24 rounded" />
          </div>
        </div>

        {/* Outcome buttons */}
        <div className="flex items-center gap-2 mt-3.5 pt-3.5 border-t border-[#f0f0f0]">
          <div className="skeleton flex-1 h-[36px] rounded-[8px]" />
          <div className="skeleton flex-1 h-[36px] rounded-[8px]" />
          <div className="skeleton flex-1 h-[36px] rounded-[8px]" />
        </div>
      </div>
    </div>
  );
}
