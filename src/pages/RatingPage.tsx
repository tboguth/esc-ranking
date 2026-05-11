import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { COUNTRIES, CATEGORIES } from "../types";
import type { CategoryRatings } from "../types";
import { getRating, saveRating, deleteRating } from "../storage";
import StarRating from "../components/StarRating";
import styles from "./RatingPage.module.css";

const EMPTY: CategoryRatings = {
  musik: 0,
  performance: 0,
  kostuem: 0,
  show: 0,
  wowFaktor: 0,
  escFeeling: 0,
};

export default function RatingPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const country = COUNTRIES.find((c) => c.code === code);

  const [ratings, setRatings] = useState<CategoryRatings>(EMPTY);

  useEffect(() => {
    if (!code) return;
    const saved = getRating(code);
    if (saved) setRatings(saved);
  }, [code]);

  if (!country) {
    return (
      <div className={styles.error}>
        <p>Land nicht gefunden.</p>
        <button onClick={() => navigate("/")}>Zurück</button>
      </div>
    );
  }

  const allRated = Object.values(ratings).every((v) => v > 0);
  const avg = allRated
    ? Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length
    : null;

  function handleSave() {
    if (!code) return;
    saveRating({ countryCode: code, ratings });
    navigate("/");
  }

  function handleDelete() {
    if (!code) return;
    deleteRating(code);
    navigate("/");
  }

  function setCategory(key: keyof CategoryRatings, val: number) {
    setRatings((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← Zurück
        </button>

        <div className={styles.hero}>
          <div className={styles.flagWrap}>
            <img
              src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`}
              alt={`Flagge ${country.name}`}
              className={styles.flag}
            />
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.countryName}>{country.name}</h1>
            <p className={styles.escLabel}>Eurovision Song Contest 2025</p>
            {avg !== null && (
              <div className={styles.avgBadge}>
                <span className={styles.avgStar}>★</span>
                <span>{avg.toFixed(2)}</span>
                <span className={styles.avgMax}>/ 5.00</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.categories}>
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className={styles.category}>
              <div className={styles.catHeader}>
                <span className={styles.catEmoji}>{cat.emoji}</span>
                <div>
                  <div className={styles.catLabel}>{cat.label}</div>
                  <div className={styles.catDesc}>{cat.description}</div>
                </div>
                <div className={styles.catValue}>
                  {ratings[cat.key] > 0 ? (
                    <span className={styles.catScore}>{ratings[cat.key]}/5</span>
                  ) : (
                    <span className={styles.catEmpty}>—</span>
                  )}
                </div>
              </div>
              <StarRating
                value={ratings[cat.key]}
                onChange={(val) => setCategory(cat.key, val)}
                size={36}
              />
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          {getRating(country.code) && (
            <button className={styles.deleteBtn} onClick={handleDelete}>
              Bewertung löschen
            </button>
          )}
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!allRated}
          >
            {allRated ? "💾 Bewertung speichern" : `Noch ${Object.values(ratings).filter((v) => v === 0).length} Kategorien ausstehend`}
          </button>
        </div>
      </div>
    </div>
  );
}
