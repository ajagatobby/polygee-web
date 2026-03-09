/**
 * Exact-replica skeleton of the sidebar league list.
 * Matches the real sidebar's layout: section label, "All Leagues" row,
 * "Football" parent row, and ~12 league child rows with logo + name.
 */
export function SidebarLeaguesSkeleton() {
  return (
    <>
      {/* Football parent row */}
      <div className="flex flex-row items-center justify-between rounded-md px-3 py-3 w-full">
        <div className="flex items-center gap-x-2.5 min-w-0">
          <div className="skeleton shrink-0 w-5 h-5 rounded" />
          <div className="skeleton h-4 w-16 rounded" />
        </div>
        <div className="skeleton w-3 h-3 rounded shrink-0" />
      </div>

      {/* League child rows */}
      <div className="pl-5 flex flex-col pt-0.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-md py-3 px-3">
            <div className="flex items-center gap-x-2.5 min-w-0">
              <div className="skeleton shrink-0 w-5 h-5 rounded-full" />
              <div
                className="skeleton h-3.5 rounded"
                style={{ width: `${60 + (i * 13) % 50}px` }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
