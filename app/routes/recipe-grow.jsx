// Find the selected recipe and pass its steps to the shared tutorial controller.
import { Link, useParams } from "react-router";
import StepNavigation from "../Components/StepByStep/StepNavigation";
import { findCrystalProject } from "../data/crystalProjects";
import styles from "./recipe-grow.module.css";

export function meta({ params }) {
  const recipe = findCrystalProject(params.recipeId);
  return [{ title: `Grow ${recipe?.name || "crystals"} | CRYST` }];
}

export default function RecipeGrow() {
  const { recipeId } = useParams();
  const recipe = findCrystalProject(recipeId);

  if (!recipe?.steps?.length) return <main className="page-content"><h1>Growing instructions coming soon</h1><Link to="/recipes">← All recipes</Link></main>;

  return (
    <main id="main-content" className={styles.page} aria-label={`${recipe.name} project steps`}>
      {/* A different recipe key resets tutorial state when switching projects. */}
      <StepNavigation key={recipe.id} recipeId={recipe.id} recipeName={recipe.name} steps={recipe.steps} completionMessage={recipe.completionMessage} />
    </main>
  );
}
