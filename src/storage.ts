import type { CountryRating, CategoryRatings } from "./types";

const STORAGE_KEY = "esc-ratings";

export function getAllRatings(): Record<string, CategoryRatings> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getRating(countryCode: string): CategoryRatings | null {
  const all = getAllRatings();
  return all[countryCode] ?? null;
}

export function saveRating(rating: CountryRating): void {
  const all = getAllRatings();
  all[rating.countryCode] = rating.ratings;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteRating(countryCode: string): void {
  const all = getAllRatings();
  delete all[countryCode];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function calcAverage(ratings: CategoryRatings): number {
  const vals = Object.values(ratings);
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}
