import { Link } from "react-router";
import styles from "./crystalProjectCard.module.css";

/** Shared presentation for crystal projects in a scrolling row or a grid. */
export default function CrystalProjectCard({ title, description = "Coming soon", to }) {
  return (
    <article className={styles.card}>
      <Link to={to} className={styles.link}>
      <div className={styles.placeholder} aria-hidden="true">
        <img src="/images/flask.png" alt="" width="32" height="32" />
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      </Link>
    </article>
  );
}
