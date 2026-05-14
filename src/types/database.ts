export interface DbUser {
  id: string;
  username: string;
  created_at: string;
}

export interface DbRating {
  id: string;
  user_id: string;
  country_code: string;
  semi_final: number;
  musik: number | null;
  performance: number | null;
  kostuem: number | null;
  show: number | null;
  wow_faktor: number | null;
  esc_feeling: number | null;
  updated_at: string;
}
