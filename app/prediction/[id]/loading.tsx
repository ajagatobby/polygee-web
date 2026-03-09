/**
 * Loading skeleton for prediction detail page.
 */
export default function PredictionLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="h-[60px] border-b border-[#f0f0f0] flex items-center px-6 gap-6">
        <div className="skeleton w-[100px] h-6 rounded-md" />
        <div className="skeleton flex-1 max-w-[400px] h-[36px] rounded-[8px]" />
        <div className="ml-auto flex items-center gap-3">
          <div className="skeleton w-8 h-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        {/* Back link */}
        <div className="skeleton w-32 h-4 rounded mb-6" />

        {/* Match header skeleton */}
        <div className="skeleton h-[200px] rounded-[16px] mb-6" />

        {/* Probability bars */}
        <div className="skeleton h-[120px] rounded-[12px] mb-6" />

        {/* Content sections */}
        <div className="skeleton h-[180px] rounded-[12px] mb-6" />
        <div className="skeleton h-[160px] rounded-[12px] mb-6" />
      </div>
    </div>
  );
}
