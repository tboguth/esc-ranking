-- Nutzer-Tabelle
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bewertungs-Tabelle
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  semi_final INTEGER NOT NULL,
  musik INTEGER CHECK (musik BETWEEN 1 AND 5),
  performance INTEGER CHECK (performance BETWEEN 1 AND 5),
  kostuem INTEGER CHECK (kostuem BETWEEN 1 AND 5),
  show INTEGER CHECK (show BETWEEN 1 AND 5),
  wow_faktor INTEGER CHECK (wow_faktor BETWEEN 1 AND 5),
  esc_feeling INTEGER CHECK (esc_feeling BETWEEN 1 AND 5),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, country_code)
);

-- Row Level Security aktivieren
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Policies: jeder darf Nutzer anlegen, nur eigene Daten lesen/schreiben
CREATE POLICY "Users are publicly insertable" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (true);
CREATE POLICY "Ratings are insertable" ON ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Ratings are updatable" ON ratings FOR UPDATE USING (true);
CREATE POLICY "Ratings are readable" ON ratings FOR SELECT USING (true);
