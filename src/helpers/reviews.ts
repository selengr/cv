import type Review from "@/models/review";

export function clampRating(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(5, Math.max(1, Math.round(value)));
}

export function averageRating(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((total, item) => total + item.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function formatStars(rating: number) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(Math.max(0, 5 - full));
}
