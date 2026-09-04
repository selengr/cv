import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4efe6] px-5 text-center text-[#14110e]">
      <p className="text-sm text-[#1f4a45]">۴۰۴</p>
      <h1 className="font-display mt-2 text-3xl font-semibold">این صفحه پیدا نشد</h1>
      <p className="mt-2 max-w-sm text-sm text-[#5c564d]">
        لینک ممکن است قدیمی باشد یا آدرس اشتباه نوشته شده باشد.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link
          href="/"
          className="rounded-full bg-[#1f4a45] px-4 py-2 text-sm text-white"
        >
          صفحه اصلی
        </Link>
        <Link
          href="/shop"
          className="rounded-full px-4 py-2 text-sm ring-1 ring-[#14110e]/15"
        >
          فروشگاه
        </Link>
      </div>
    </div>
  );
}
