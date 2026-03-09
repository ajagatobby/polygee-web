/**
 * Exact-replica skeleton of PredictionCard.
 * Matches the real card's layout, sizes, and spacing pixel-for-pixel.
 */
export function PredictionCardSkeleton() {
  return (
    <div className="pb-2 w-full">
      <div className="w-full bg-white rounded-xl border border-[#e8e8e8] overflow-hidden">
        <div className="flex flex-col w-full p-3">
          {/* Top row: time + confidence + AI pick badge + Game View button */}
          <div className="flex flex-1 justify-between items-center h-[32px] min-h-[32px] gap-2 mb-3">
            <div className="flex flex-1 items-center gap-2.5 min-w-0">
              {/* Time */}
              <div className="skeleton h-4 w-10 rounded" />
              {/* Confidence */}
              <div className="skeleton h-4 w-8 rounded" />
              {/* AI Pick badge */}
              <div className="skeleton h-[22px] w-[72px] rounded-full" />
              {/* League name */}
              <div className="skeleton h-3 w-16 rounded hidden sm:block" />
            </div>
            {/* Game View button */}
            <div className="skeleton h-[32px] w-[90px] rounded-lg shrink-0" />
          </div>

          {/* Main content: teams + 3 outcome buttons */}
          <div className="flex w-full gap-3 flex-row">
            {/* Teams (left side) */}
            <div className="flex justify-between lg:min-w-0 lg:flex-1 lg:shrink-0">
              <div className="flex flex-col gap-4 w-full">
                {/* Home team row */}
                <div className="flex items-center gap-3 h-[40px]">
                  <div className="skeleton w-6 h-6 rounded-full shrink-0" />
                  <div className="skeleton h-4 w-28 rounded" />
                </div>
                {/* Away team row */}
                <div className="flex items-center gap-3 h-[40px]">
                  <div className="skeleton w-6 h-6 rounded-full shrink-0" />
                  <div className="skeleton h-4 w-24 rounded" />
                </div>
              </div>
            </div>

            {/* 3 outcome buttons */}
            <div className="flex flex-col gap-2 shrink-0 w-[130px]">
              <div className="skeleton h-[33px] w-full rounded-[8px]" />
              <div className="skeleton h-[33px] w-full rounded-[8px]" />
              <div className="skeleton h-[33px] w-full rounded-[8px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
