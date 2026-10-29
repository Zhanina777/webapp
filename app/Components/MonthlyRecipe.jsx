import { Link } from "react-router";
import styles from "./monthlyRecipe.module.css";

export default function MonthlyRecipe() {
  return (
    <section className={styles.card} aria-labelledby="monthly-recipe-title">
      <div className={styles.content}>
        <p className={styles.label}>Monthly Recipe</p>
        <h2 id="monthly-recipe-title" className={styles.title}>
          Salt String<br />Magic
        </h2>
      </div>
      <img
        className={styles.image}
        src="/images/recipes/Crystal photograph (4)-landscape.png"
        alt="Crystals growing on a string suspended over a glass jar"
        width="245"
        height="260"
      />
      <Link className={styles.button} to="/recipes/salt-string-magic">GROW NOW!</Link>
    </section>
  );
}
