import { Link, useParams } from "react-router";
import { findCrystalProject } from "../data/crystalProjects";
import styles from "./recipe-detail.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../Components/Auth/AuthProvider";
import { guestCompleted } from "../supabase-connection/projectProgress";
import AdultHelpBtn from "../Components/AdultHelpBtn";
import { saveRecipeProgress } from "../utils/recipeStorage";

export function meta({ params }) {
  const recipe = findCrystalProject(params.recipeId);
  return [{ title: `${recipe?.name || "Recipe not found"} | CRYST` }];
}

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const recipe = findCrystalProject(recipeId);
  const { user, loading } = useAuth();
  const [trialUsed, setTrialUsed] = useState(false);

  useEffect(() => {
    const completed = guestCompleted();
    setTrialUsed(completed);
    if (loading || (!user && completed)) return;
    if (!recipe || recipe.isPlaceholder) return;
    try {
      saveRecipeProgress(recipe.id);
    } catch { /* Recipe instructions remain available if browser storage is blocked. */ }
  }, [recipe, user, loading]);

  if (!recipe) return <main className="page-content"><h1>Recipe not found</h1><Link to="/recipes">← All recipes</Link></main>;

  return (
    <main id="main-content" className={styles.page}>
      <Link className={styles.back} to={`/recipes?level=${recipe.difficulty.toLowerCase()}`}>← {recipe.difficulty} recipes</Link>
      <div className={styles.hero}>
        <img src={recipe.image} alt={recipe.imageAlt} width="1672" height="941" decoding="async" fetchPriority="high" />
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
          <h2 id="science-heading">
            <svg className={styles.sparkle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />
            </svg>
            {recipe.scienceTitle}
          </h2>
          <p>{recipe.science}</p>
          <p><strong>{recipe.observation}</strong></p>
        </section>
        <div className={styles.safety}>
          <AdultHelpBtn message={recipe.safety} />
        </div>
        {!user && trialUsed && <p>You’ve completed your free guest project. Create a profile or sign in to start another. You can keep browsing every recipe.</p>}
        <Link className={styles.start} to={!user && trialUsed ? "/create-profile?reason=project-limit" : `/recipes/${recipe.id}/grow`}>{!user && trialUsed ? "Create a profile to start growing" : "Start growing"} &rarr;</Link>
      </>}
    </main>
  );
}
