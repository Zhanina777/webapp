import { useEffect, useRef, useState } from "react";
import styles from "./recipeFilters.module.css";

export default function RecipeFilters({ levels, selectedLevel, materials, selectedMaterials = [], minPrice = "", maxPrice = "", onApply, onCancel }) {
  // These are draft selections. Only Show recipes applies them to the parent URL.
  const dialogRef = useRef(null);
  const [difficulty, setDifficulty] = useState(selectedLevel || "all");
  const [chosenMaterials, setChosenMaterials] = useState(selectedMaterials);
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);
  const [error, setError] = useState("");

  // Native dialog supplies focus trapping and restores focus when it closes.
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (min !== "" && max !== "" && Number(min) > Number(max)) {
      setError("Minimum price must be less than or equal to maximum price.");
      return;
    }
    onApply({ level: difficulty, materials: chosenMaterials, min, max });
  }

  return (
    <dialog id="recipe-filters" ref={dialogRef} className={styles.dialog} aria-labelledby="filter-title" onCancel={event => { event.preventDefault(); onCancel(); }} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onCancel(); } }}>
      <form className={styles.panel} onSubmit={handleSubmit}>
        <h2 id="filter-title">Filter recipes</h2>
        <fieldset className={styles.difficulty}>
          <legend>Difficulty</legend>
          <div>{levels.map(level => {
            const value = level.toLowerCase();
            return <button key={value} type="button" aria-pressed={difficulty === value} onClick={() => setDifficulty(current => current === value ? "all" : value)}>{level}</button>;
          })}</div>
        </fieldset>
        <div className={styles.field}>
          <span id="materials-label">Materials</span>
          <details className={styles.materials}>
            <summary aria-labelledby="materials-label materials-selection"><span id="materials-selection">{chosenMaterials.length ? `${chosenMaterials.length} selected` : "Select materials"}</span><span className={styles.chevron} aria-hidden="true" /></summary>
            <div className={styles.materialOptions} role="group" aria-labelledby="materials-label">
              {materials.map(({ value, label }) => <label key={value}><input type="checkbox" checked={chosenMaterials.includes(value)} onChange={() => setChosenMaterials(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value])} />{label}</label>)}
            </div>
          </details>
        </div>
        <fieldset className={styles.price}>
          <legend>Price (DKK)</legend>
          <div>
            <input aria-label="Minimum price in DKK" type="number" min="0" step="any" placeholder="Min" value={min} onChange={event => { setMin(event.target.value); setError(""); }} />
            <input aria-label="Maximum price in DKK" type="number" min="0" step="any" placeholder="Max" value={max} onChange={event => { setMax(event.target.value); setError(""); }} />
          </div>
        </fieldset>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.clear} type="button" onClick={() => {
          setDifficulty("all");
          setChosenMaterials([]);
          setMin("");
          setMax("");
          setError("");
        }}>Clear filters</button>
        <div className={styles.actions}><button type="button" onClick={onCancel}>Cancel</button><button type="submit">Show recipes</button></div>
      </form>
    </dialog>
  );
}
