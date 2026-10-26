import { useEffect, useState } from "react";
import { Link } from "react-router";
import styles from "./header.module.css";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.dataset.theme === "dark");
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("cryst-theme", next ? "dark" : "light");
    } catch {
      // Theme switching still works when browser storage is unavailable.
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
      <button
        className={styles.button}
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        aria-pressed={isDark}
      >
        <img src="/images/night-mode.png" alt="" width="76" height="76" />
      </button>
      <Link to="/" className={styles.wordmark} aria-label="CRYST home">CRYST</Link>
      <Link to="/help" className={styles.button} aria-label="Help">
        <img src="/images/question.png" alt="" width="76" height="76" />
      </Link>
      </div>
    </header>
  );
}
