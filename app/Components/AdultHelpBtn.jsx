import styles from "./AdultHelpBtn.module.css";

export default function AdultHelpBtn() {
  return (
    <aside className={styles.banner} aria-label="Adult help reminder">
      <svg
        className={styles.icon}
        width="36"
        height="40"
        viewBox="0 0 36 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 4c4 3 8 5 12 5v12c0 8-6 13-12 16C12 34 6 29 6 21V9c4 0 8-2 12-5Z" />
        <path d="m12 20 4 4 8-9" />
      </svg>
      <p className={styles.message}>Ask an adult to work with you.</p>
    </aside>
  );
}
