import { useState } from "react";
import styles from "./StarRating.module.css";

interface Props {
  value: number;
  onChange: (val: number) => void;
  size?: number;
}

export default function StarRating({ value, onChange, size = 32 }: Props) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className={styles.stars} role="group" aria-label="Sternebewertung">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            className={`${styles.star} ${filled ? styles.filled : styles.empty}`}
            style={{ fontSize: size }}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`${star} von 5 Sternen`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
