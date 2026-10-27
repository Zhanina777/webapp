import styles from "./AdultHelpBtn.module.css";

export default function AdultHelpBtn({ message = "Ask an adult to work with you." }) {
  return (
    <aside className={styles.banner} aria-label="Adult help reminder">
      <img
        className={styles.icon}
        src="/images/peace.png"
        alt=""
        width="36"
        height="36"
      />
      <p className={styles.message}>{message}</p>
    </aside>
  );
}
