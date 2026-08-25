import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span
        className={`font-display flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
          light ? "bg-white/15 text-white" : "bg-[#1f4a45] text-[#f4efe6]"
        }`}
      >
        ش
      </span>
      <span
        className={`text-[1.15rem] font-semibold tracking-tight ${
          light ? "text-white" : "text-[#14110e]"
        }`}
      >
        Shopy
      </span>
    </Link>
  );
}
