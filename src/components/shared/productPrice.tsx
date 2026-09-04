import { formatToman, hasSale, salePercent } from "@/helpers/catalog";

export default function ProductPrice({
  price,
  compareAtPrice,
  className = "",
  size = "sm",
}: {
  price: number;
  compareAtPrice?: number;
  className?: string;
  size?: "sm" | "lg";
}) {
  const onSale = hasSale({ price, compareAtPrice });
  const priceClass = size === "lg" ? "text-xl font-semibold" : "text-sm font-medium";
  const wasClass = size === "lg" ? "text-sm" : "text-xs";

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-2 ${className}`}>
      <span className={priceClass}>{formatToman(price)}</span>
      {onSale && (
        <>
          <span className={`${wasClass} text-[#6b6459] line-through`}>
            {formatToman(Number(compareAtPrice))}
          </span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-900">
            {salePercent({ price, compareAtPrice }).toLocaleString("fa-IR")}٪ تخفیف
          </span>
        </>
      )}
    </span>
  );
}
