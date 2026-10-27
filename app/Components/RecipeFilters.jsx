import { useState } from "react";
import styles from "./recipeFilters.module.css";

/** Materials and prices stay inactive until real recipe data is available. */
export default function RecipeFilters({ levels, selectedLevel, onApply, onCancel }) {
  const [difficulty, setDifficulty] = useState(selectedLevel || "all");

  function handleSubmit(event) {
    event.preventDefault();
    onApply(difficulty);
  }

  return (
    <form id="recipe-filters" className={styles.panel} onSubmit={handleSubmit} aria-label="Recipe filters">
      <h2>Filter recipes</h2>
      <fieldset className={styles.difficulty}>
        <legend>Difficulty</legend>
        <div>
          {levels.map(level => {
            const value = level.toLowerCase();
            return (
              <button
                key={level}
                type="button"
                aria-pressed={difficulty === value}
                onClick={() => setDifficulty(current => current === value ? "all" : value)}
              >
                {level}
              </button>
            );
          })}
        </div>
      </fieldset>
      <label className={styles.field}>
        Materials
        <select disabled aria-describedby="pending-filters">
          <option>Available with full recipes</option>
        </select>
      </label>
      <fieldset className={styles.price} disabled aria-describedby="pending-filters">
        <legend>Price range (kr)</legend>
        <div>
          <label className={styles.field}>Minimum<input type="number" min="0" placeholder="Min" /></label>
          <label className={styles.field}>Maximum<input type="number" min="0" placeholder="Max" /></label>
        </div>
      </fieldset>
      <p id="pending-filters" className={styles.note}>Materials and price filters will be available when the full recipes are added.</p>
      <div className={styles.actions}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Show recipes</button>
      </div>
    </form>
  );
}
