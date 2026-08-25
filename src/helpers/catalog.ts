export const CATEGORIES = [
  { value: "1", label: "پوشاک" },
  { value: "2", label: "کیف و کفش" },
  { value: "3", label: "اکسسوری" },
  { value: "4", label: "خانه" },
];

export function categoryLabel(id?: string) {
  return CATEGORIES.find((item) => item.value === id)?.label ?? "بدون دسته";
}

export function formatToman(price: number) {
  return `${Number(price || 0).toLocaleString("fa-IR")} تومان`;
}

export const categorySelectOptions = [
  { label: "لطفا یکی از دسته‌ها را انتخاب کنید", value: "" },
  ...CATEGORIES.map((item) => ({ label: item.label, value: item.value })),
];

export const PRODUCT_EMOJIS = [
  "👟",
  "👜",
  "👕",
  "👖",
  "🧢",
  "⌚",
  "🎒",
  "☕",
  "👗",
  "🧣",
  "💍",
  "🧴",
  "🏠",
  "📦",
];
