/**
 * Exact-replica skeleton of FixtureCard.
 * Matches the real card's layout: top bar + Club A vs Club B.
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

      {/* Club A vs Club B */}
      <div className="px-4 pb-4">
        <div className="flex items-center">
          {/* Home team */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="skeleton w-8 h-8 rounded-full shrink-0" />
            <div className="skeleton h-4 w-24 rounded" />
          </div>

          {/* VS */}
          <div className="shrink-0 mx-3">
            <div className="skeleton h-4 w-6 rounded mx-auto" />
          </div>

          {/* Away team */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton w-8 h-8 rounded-full shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
