export interface Country {
  name: string;
  code: string;
}

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

export const COUNTRIES: Country[] = [
  { name: "Armenien", code: "AM" },
  { name: "Aserbaidschan", code: "AZ" },
  { name: "Österreich", code: "AT" },
  { name: "Belgien", code: "BE" },
  { name: "Kroatien", code: "HR" },
  { name: "Zypern", code: "CY" },
  { name: "Tschechien", code: "CZ" },
  { name: "Dänemark", code: "DK" },
  { name: "Estland", code: "EE" },
  { name: "Finnland", code: "FI" },
  { name: "Frankreich", code: "FR" },
  { name: "Deutschland", code: "DE" },
  { name: "Georgien", code: "GE" },
  { name: "Griechenland", code: "GR" },
  { name: "Island", code: "IS" },
  { name: "Irland", code: "IE" },
  { name: "Israel", code: "IL" },
  { name: "Italien", code: "IT" },
  { name: "Lettland", code: "LV" },
  { name: "Litauen", code: "LT" },
  { name: "Luxemburg", code: "LU" },
  { name: "Malta", code: "MT" },
  { name: "Moldau", code: "MD" },
  { name: "Niederlande", code: "NL" },
  { name: "Norwegen", code: "NO" },
  { name: "Polen", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "San Marino", code: "SM" },
  { name: "Serbien", code: "RS" },
  { name: "Slowenien", code: "SI" },
  { name: "Spanien", code: "ES" },
  { name: "Schweden", code: "SE" },
  { name: "Schweiz", code: "CH" },
  { name: "Ukraine", code: "UA" },
  { name: "Vereinigtes Königreich", code: "GB" },
];
