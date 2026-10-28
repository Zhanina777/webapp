import { Link, useParams } from "react-router";
import { findCrystalProject } from "../data/crystalProjects";
import styles from "./recipe-detail.module.css";

export function meta({ params }) {
  const recipe = findCrystalProject(params.recipeId);
  return [{ title: `${recipe?.name || "Recipe not found"} | CRYST` }];
}

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const recipe = findCrystalProject(recipeId);

  if (!recipe) return <main className="page-content"><h1>Recipe not found</h1><Link to="/recipes">← All recipes</Link></main>;

  return (
    <main id="main-content" className={styles.page}>
      <Link className={styles.back} to={`/recipes?level=${recipe.difficulty.toLowerCase()}`}>← {recipe.difficulty} recipes</Link>
      <div className={styles.hero}>
        <img src={recipe.image} alt={recipe.imageAlt} />
      </div>
      <h1>{recipe.name}</h1>
      <dl className={styles.facts}>
        <div><dt>Difficulty</dt><dd>{recipe.difficulty}</dd></div>
        <div><dt>Growing time</dt><dd>{recipe.time || "Coming soon"}</dd></div>
        <div><dt>Price range</dt><dd>{recipe.price || "Coming soon"}</dd></div>
      </dl>
      {recipe.isPlaceholder ? <p>This crystal project is coming soon.</p> : <>
        <p>{recipe.introduction}</p>
        <section className={styles.materials} aria-labelledby="materials-heading">
          <h2 id="materials-heading">Materials</h2>
          <div className={styles.checklist}>
            {recipe.materials.map(material => <label key={`${recipe.id}-${material}`}><input key={`${recipe.id}-${material}`} type="checkbox" />{material}</label>)}
          </div>
          <div className={styles.supplies}><p>Need supplies?<br /><strong>Check with an adult first.</strong></p><button type="button" disabled>Buy · Coming soon</button></div>
        </section>
        <section className={styles.science} aria-labelledby="science-heading">
          <h2 id="science-heading">✧ {recipe.scienceTitle}</h2>
          <p>{recipe.science}</p>
          <p><strong>{recipe.observation}</strong></p>
        </section>
        <section className={styles.safety} aria-labelledby="safety-heading">
          <h2 id="safety-heading">{recipe.safetyTitle || "Grow with an adult"}</h2>
          <p>{recipe.safety}</p>
        </section>
        <Link className={styles.start} to={`/recipes/${recipe.id}/grow`}>Start growing →</Link>
      </>}
    </main>
  );
}
