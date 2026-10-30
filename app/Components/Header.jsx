// Shared header links back to the home page and opens the help route.
import { Link } from "react-router";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
      <Link to="/" className={`${styles.wordmark} font-heading`} aria-label="CRYST home">
        <span className={styles.logoIcon} aria-hidden="true" />
        <span>CRYST</span>
      </Link>
      <Link to="/help" className={styles.button} aria-label="Help">
        <img src={`${import.meta.env.BASE_URL}images/question.png`} alt="" width="76" height="76" />
      </Link>
      </div>
    </header>
  );
}
