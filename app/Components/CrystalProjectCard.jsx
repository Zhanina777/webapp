// The parent owns saved state; this card reports save clicks through onToggleSave.
import { Link } from "react-router";
import styles from "./crystalProjectCard.module.css";

/** Shared presentation for crystal projects in a scrolling row or a grid. */
export default function CrystalProjectCard({ title, description = "Coming soon", to, image, imageAlt, saved = false, onToggleSave }) {
  return (
    <article className={styles.card}>
      <Link to={to} className={styles.link}>
      <div className={image ? styles.picture : styles.placeholder}>
        <img src={image || `${import.meta.env.BASE_URL}images/flask.png`} alt={imageAlt || ""} loading="lazy" width={image ? 303 : 32} height={image ? 252 : 32} />
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      </Link>
      {onToggleSave && <button className={styles.saveButton} type="button" aria-label={saved ? `Remove ${title} from saved recipes` : `Save ${title} for later`} aria-pressed={saved} onClick={onToggleSave}>
        <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>
      </button>}
    </article>
  );
}
