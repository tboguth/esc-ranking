export interface CategoryRatings {
  musik: number;
  performance: number;
  kostuem: number;
  show: number;
  wowFaktor: number;
  escFeeling: number;
}

export interface CountryRating {
  countryCode: string;
  ratings: CategoryRatings;
}

export const CATEGORIES: { key: keyof CategoryRatings; label: string; emoji: string; description: string }[] = [
  { key: "musik", label: "Musik & Song", emoji: "🎵", description: "Melodie, Songwriting, Lyrics" },
  { key: "performance", label: "Performance", emoji: "🎤", description: "Gesang, Bühnenpräsenz, Energie" },
  { key: "kostuem", label: "Kostüm & Styling", emoji: "👗", description: "Outfit, Visuals, Look" },
  { key: "show", label: "Show & Staging", emoji: "🎭", description: "Bühnenshow, Lichtshow, Choreografie" },
  { key: "wowFaktor", label: "Wow-Faktor", emoji: "🌟", description: "Originalität, Einzigartigkeit, Erinnerungswert" },
  { key: "escFeeling", label: "ESC-Feeling", emoji: "🇪🇺", description: "Passt es zum Eurovision-Spirit?" },
];

