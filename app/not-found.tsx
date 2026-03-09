import Link from "next/link";

/**
 * Custom 404 page matching the app's design language.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-[72px] font-bold text-[#f0f0f0] leading-none mb-4">
          404
        </div>

        <h1 className="text-[24px] font-bold text-[#1a1a2e] tracking-[-0.02em] mb-2">
          Page not found
        </h1>

        <p className="text-[14px] text-[#808080] leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 h-[40px] px-5 text-[13px] font-bold text-white bg-[#1552f0] rounded-[8px] hover:bg-[#1247d6] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
