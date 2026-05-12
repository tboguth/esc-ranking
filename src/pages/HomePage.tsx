import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CONTESTANTS } from "../data/contestants";
import type { Contestant } from "../data/contestants";
import { getAllRatings, calcAverage } from "../storage";
import styles from "./HomePage.module.css";

function getArtistImageUrl(c: Contestant): string | null {
  if (c.pressImageUrl) return c.pressImageUrl;
  const cached = localStorage.getItem(`wiki_img_${c.countryCode}`);
  return cached && cached !== "NONE" ? cached : null;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [activeSF, setActiveSF] = useState<1 | 2>(1);
  const ratings = getAllRatings();

  const visible = CONTESTANTS.filter((c) => c.semiFinal === activeSF);
  const visibleCompetitors = visible.filter((c) => !c.isGuest);
  const ratedCount = visibleCompetitors.filter((c) => ratings[c.countryCode]).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoStar}>★</span>
            <div>
              <h1 className={styles.title}>Eurovision</h1>
              <p className={styles.subtitle}>
                Song Contest 2026 · Halbfinale {activeSF}
              </p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.progress}>
              {ratedCount}/{visibleCompetitors.length} bewertet
            </span>
            <button
              className={styles.resultsBtn}
              onClick={() => navigate("/results")}
              disabled={Object.keys(ratings).length === 0}
            >
              📊 Auswertung
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* SF toggle */}
        <div className={styles.sfToggle}>
          <button
            className={`${styles.sfBtn} ${activeSF === 1 ? styles.sfBtnActive : ""}`}
            onClick={() => setActiveSF(1)}
          >
            1. Halbfinale
            <span className={styles.sfDate}>12. Mai</span>
          </button>
          <button
            className={`${styles.sfBtn} ${activeSF === 2 ? styles.sfBtnActive : ""}`}
            onClick={() => setActiveSF(2)}
          >
            2. Halbfinale
            <span className={styles.sfDate}>14. Mai</span>
          </button>
        </div>

        <div className={styles.grid}>
          {visible.map((c) => {
            const rating = ratings[c.countryCode];
            const avg = rating ? calcAverage(rating) : null;
            const isRated = rating != null;
            const artistImageUrl = getArtistImageUrl(c);

            return (
              <button
                key={c.countryCode}
                className={`${styles.cardOuter} ${
                  c.isGuest
                    ? styles.guestOuter
                    : isRated
                    ? styles.ratedOuter
                    : styles.unratedOuter
                }`}
                onClick={() => navigate(`/rate/${c.countryCode}`)}
              >
                <div className={styles.cardInner}>
                  {/* Front face */}
                  <div className={styles.cardFront}>
                    <div className={styles.flagWrap}>
                      <img
                        src={`https://flagcdn.com/w320/${c.countryCode.toLowerCase()}.png`}
                        alt={`Flagge ${c.country}`}
                        className={styles.flag}
                      />
                      <span className={styles.runOrder}>{c.runningOrder}</span>
                      {isRated && !c.isGuest && (
                        <span className={styles.checkmark}>✓</span>
                      )}
                      {c.isGuest && (
                        <span className={styles.guestBadge}>Gast</span>
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      <span className={styles.countryName}>{c.country}</span>
                      <span className={styles.artistName}>{c.artist}</span>
                      {!c.isGuest &&
                        (isRated && avg !== null ? (
                          <span className={styles.avgScore}>
                            <span className={styles.avgStar}>★</span>
                            {avg.toFixed(1)}
                          </span>
                        ) : (
                          <span className={styles.notRated}>
                            Noch nicht bewertet
                          </span>
                        ))}
                      {c.isGuest && (
                        <span className={styles.guestLabel}>Gastauftritt</span>
                      )}
                    </div>
                  </div>

                  {/* Back face */}
                  <div className={styles.cardBack}>
                    {artistImageUrl ? (
                      <img
                        src={artistImageUrl}
                        alt={c.artist}
                        className={styles.backImg}
                      />
                    ) : (
                      <div className={styles.backFallback}>
                        <span className={styles.backMic}>🎤</span>
                        <span className={styles.backArtistName}>{c.artist}</span>
                      </div>
                    )}
                    <div className={styles.backOverlay}>
                      <span className={styles.backCountry}>{c.country}</span>
                      {isRated && avg !== null && !c.isGuest && (
                        <span className={styles.backScore}>★ {avg.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
