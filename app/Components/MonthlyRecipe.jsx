import { Link } from "react-router";
import styles from "./monthlyRecipe.module.css";

export default function MonthlyRecipe() {
  return (
    <section className={styles.card} aria-labelledby="monthly-recipe-title">
      <div>
        <p className={styles.label}>Monthly recipe</p>
        <h1 id="monthly-recipe-title" className={styles.title}>
          Little crystal, big sparkle.
        </h1>
        <Link className={styles.button} to="/recipes">
          Grow alum crystals <span aria-hidden="true">→</span>
        </Link>
      </div>
      <img
        className={styles.image}
        src="/images/monthly-alum-crystal.png"
        alt="A sparkling alum crystal on a pale purple background"
        width="245"
        height="260"
      />
    </section>
  );
}
