type Thumb = {
  image?: string;
  emoji?: string;
  title: string;
};

export default function ProductThumb({
  item,
  className = "h-28",
}: {
  item: Thumb;
  className?: string;
}) {
  if (item.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.image}
        alt={item.title}
        className={`w-full rounded-2xl object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex w-full items-center justify-center rounded-2xl bg-[#1f4a45]/8 text-5xl ${className}`}
    >
      {item.emoji ?? "📦"}
    </div>
  );
}
