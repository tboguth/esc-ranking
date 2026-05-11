import { useNavigate } from "react-router-dom";
import { COUNTRIES } from "../types";
import { getAllRatings, calcAverage } from "../storage";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const navigate = useNavigate();
  const ratings = getAllRatings();
  const ratedCount = Object.keys(ratings).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoStar}>★</span>
            <div>
              <h1 className={styles.title}>Eurovision</h1>
              <p className={styles.subtitle}>Song Contest Ranking 2025</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.progress}>
              {ratedCount}/{COUNTRIES.length} bewertet
            </span>
            <button
              className={styles.resultsBtn}
              onClick={() => navigate("/results")}
              disabled={ratedCount === 0}
            >
              📊 Auswertung
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {COUNTRIES.map((country) => {
            const rating = ratings[country.code];
            const avg = rating ? calcAverage(rating) : null;
            const isRated = rating != null;

            return (
              <button
                key={country.code}
                className={`${styles.card} ${isRated ? styles.rated : styles.unrated}`}
                onClick={() => navigate(`/rate/${country.code}`)}
              >
                <div className={styles.flagWrap}>
                  <img
                    src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                    alt={`Flagge ${country.name}`}
                    className={styles.flag}
                    width={80}
                    height={53}
                  />
                  {isRated && <span className={styles.checkmark}>✓</span>}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.countryName}>{country.name}</span>
                  {isRated && avg !== null ? (
                    <span className={styles.avgScore}>
                      <span className={styles.avgStar}>★</span>
                      {avg.toFixed(1)}
                    </span>
                  ) : (
                    <span className={styles.notRated}>Noch nicht bewertet</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
