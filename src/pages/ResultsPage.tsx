import { useNavigate } from "react-router-dom";
import { COUNTRIES, CATEGORIES } from "../types";
import type { CategoryRatings } from "../types";
import { getAllRatings, calcAverage } from "../storage";
import styles from "./ResultsPage.module.css";

interface RankedCountry {
  name: string;
  code: string;
  ratings: CategoryRatings;
  avg: number;
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const allRatings = getAllRatings();

  const ranked: RankedCountry[] = COUNTRIES
    .filter((c) => allRatings[c.code])
    .map((c) => ({
      name: c.name,
      code: c.code,
      ratings: allRatings[c.code],
      avg: calcAverage(allRatings[c.code]),
    }))
    .sort((a, b) => b.avg - a.avg);

  if (ranked.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🌟</div>
        <h2>Noch keine Bewertungen</h2>
        <p>Bewerte zuerst einige Länder, um die Auswertung zu sehen.</p>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← Zur Startseite
        </button>
      </div>
    );
  }

  const [gold, silver, bronze] = ranked;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.backLink} onClick={() => navigate("/")}>
          ← Zurück
        </button>

        <h1 className={styles.pageTitle}>
          <span className={styles.pageTitleStar}>★</span>
          Meine Auswertung
        </h1>

        {/* Podium */}
        {ranked.length >= 1 && (
          <section className={styles.podiumSection}>
            <h2 className={styles.sectionTitle}>🏆 Podium</h2>
            <div className={styles.podium}>
              {silver && (
                <div className={`${styles.podiumSlot} ${styles.silver}`}>
                  <span className={styles.podiumMedal}>🥈</span>
                  <img
                    src={`https://flagcdn.com/w80/${silver.code.toLowerCase()}.png`}
                    alt={silver.name}
                    className={styles.podiumFlag}
                  />
                  <div className={styles.podiumName}>{silver.name}</div>
                  <div className={styles.podiumScore}>★ {silver.avg.toFixed(2)}</div>
                  <div className={styles.podiumBar} style={{ height: 80 }} />
                </div>
              )}
              {gold && (
                <div className={`${styles.podiumSlot} ${styles.gold}`}>
                  <span className={styles.podiumMedal}>🥇</span>
                  <img
                    src={`https://flagcdn.com/w80/${gold.code.toLowerCase()}.png`}
                    alt={gold.name}
                    className={styles.podiumFlag}
                  />
                  <div className={styles.podiumName}>{gold.name}</div>
                  <div className={styles.podiumScore}>★ {gold.avg.toFixed(2)}</div>
                  <div className={styles.podiumBar} style={{ height: 120 }} />
                </div>
              )}
              {bronze && (
                <div className={`${styles.podiumSlot} ${styles.bronze}`}>
                  <span className={styles.podiumMedal}>🥉</span>
                  <img
                    src={`https://flagcdn.com/w80/${bronze.code.toLowerCase()}.png`}
                    alt={bronze.name}
                    className={styles.podiumFlag}
                  />
                  <div className={styles.podiumName}>{bronze.name}</div>
                  <div className={styles.podiumScore}>★ {bronze.avg.toFixed(2)}</div>
                  <div className={styles.podiumBar} style={{ height: 60 }} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Overall ranking */}
        <section className={styles.rankingSection}>
          <h2 className={styles.sectionTitle}>📋 Gesamtranking</h2>
          <div className={styles.rankList}>
            {ranked.map((country, idx) => (
              <div
                key={country.code}
                className={`${styles.rankRow} ${idx === 0 ? styles.rankFirst : idx === 1 ? styles.rankSecond : idx === 2 ? styles.rankThird : ""}`}
              >
                <span className={styles.rankNum}>
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                </span>
                <img
                  src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                  alt={country.name}
                  className={styles.rankFlag}
                />
                <span className={styles.rankName}>{country.name}</span>
                <div className={styles.rankBar}>
                  <div
                    className={styles.rankBarFill}
                    style={{ width: `${(country.avg / 5) * 100}%` }}
                  />
                </div>
                <span className={styles.rankScore}>★ {country.avg.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Category rankings */}
        <section className={styles.catSection}>
          <h2 className={styles.sectionTitle}>🏅 Kategorie-Rankings</h2>
          <div className={styles.catGrid}>
            {CATEGORIES.map((cat) => {
              const sorted = [...ranked].sort(
                (a, b) => b.ratings[cat.key] - a.ratings[cat.key]
              );
              const top3 = sorted.slice(0, 3);

              return (
                <div key={cat.key} className={styles.catCard}>
                  <div className={styles.catCardTitle}>
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </div>
                  <ol className={styles.catList}>
                    {top3.map((c, i) => (
                      <li key={c.code} className={styles.catItem}>
                        <span className={styles.catRank}>
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                        </span>
                        <img
                          src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                          alt={c.name}
                          className={styles.catFlag}
                        />
                        <span className={styles.catName}>{c.name}</span>
                        <span className={styles.catScore}>
                          {"★".repeat(c.ratings[cat.key])}
                          <span className={styles.catScoreEmpty}>
                            {"★".repeat(5 - c.ratings[cat.key])}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
