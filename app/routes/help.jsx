import { Link } from "react-router";
import styles from "./help.module.css";

export const handle = { hideNavigation: true };

export function meta() {
  return [{ title: "404 · Page not found | CRYST" }];
}

export default function Help() {
  return (
    <main id="main-content" className={styles.page} aria-labelledby="not-found-title">
      <h1 id="not-found-title" className={styles.code}>OOPS</h1>
      <img className={styles.flask} src="/images/404-flask.png" alt="" width="230" height="230" />
      <p className={styles.message}>We can’t find this page. Let’s head home and keep the crystals growing!</p>
      <Link className={styles.primary} to="/"><span>BACK TO HOME</span></Link>
    </main>
  );
}
