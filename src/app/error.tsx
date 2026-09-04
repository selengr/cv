"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4efe6] px-5 text-center text-[#14110e]">
      <h1 className="font-display text-3xl font-semibold">یک مشکل پیش آمد</h1>
      <p className="mt-2 max-w-sm text-sm text-[#5c564d]">
        {error.message || "صفحه را دوباره بارگذاری کن."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-[#1f4a45] px-4 py-2 text-sm text-white"
      >
        تلاش دوباره
      </button>
    </div>
  );
}
