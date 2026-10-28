import { Link } from "react-router";
import styles from "./crystalProjectCard.module.css";

/** Shared presentation for crystal projects in a scrolling row or a grid. */
export default function CrystalProjectCard({ title, description = "Coming soon", to, image, imageAlt }) {
  return (
    <article className={styles.card}>
      <Link to={to} className={styles.link}>
      <div className={image ? styles.picture : styles.placeholder}>
        <img src={image || "/images/flask.png"} alt={imageAlt || ""} loading="lazy" width={image ? 303 : 32} height={image ? 252 : 32} />
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      </Link>
    </article>
  );
}
