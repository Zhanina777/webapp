
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../Components/Auth/AuthProvider";
import styles from "./profile.module.css";
import { projectSections } from "../data/crystalProjects";
import CrystalProjectCard from "../Components/CrystalProjectCard";
import { saveCompletion } from "../supabase-connection/projectProgress";

export function meta() {
  return [{ title: "Profile | Cryst" }];
}

const allRecipes = projectSections.flatMap(
  (section) => section.recipes
);

export default function Profile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    setBusy(true);
    setError("");
    try { await signOut(); navigate("/"); }
    catch (problem) { setError(problem.message); setBusy(false); }
  }
  const [activeTab, setActiveTab] = useState("collection");

  const [savedIds, setSavedIds] = useState([]);
  const [finishedIds, setFinishedIds] = useState([]);
  const [progressId, setProgressId] = useState(null);

  // Load the user's saved profile data from the browser.
  useEffect(() => {
    setSavedIds(
      JSON.parse(localStorage.getItem("cryst-saved") || "[]")
    );
    setFinishedIds(
      JSON.parse(localStorage.getItem("cryst-finished") || "[]")
    );
    setProgressId(
      localStorage.getItem("cryst-progress")
    );
  }, []);

  // Remove a recipe from Saved.
  function removeSaved(id) {
    const updated = savedIds.filter((savedId) => savedId !== id);

    try {
      localStorage.setItem("cryst-saved", JSON.stringify(updated));
      setSavedIds(updated);
    } catch { setError("Could not remove this saved recipe. Please allow browser storage and try again."); }
  }

  // Mark the current recipe as finished.
  async function finishGrowing(id) {
    try {
      await saveCompletion(user, id, allRecipes.find(recipe => recipe.id === id)?.steps?.length || 1);
      const updated = [...new Set([...finishedIds, id])];
      localStorage.setItem("cryst-finished", JSON.stringify(updated));
      localStorage.removeItem("cryst-progress");
      setFinishedIds(updated);
      setProgressId(null);
    } catch (problem) { setError(problem.message); }
  }

  // Find the recipe currently in progress.
  const currentRecipe = allRecipes.find(
    (recipe) => recipe.id === progressId
  );

  // Find completed and saved recipes.
  const finishedRecipes = allRecipes.filter(
    (recipe) => finishedIds.includes(recipe.id)
  );

  const savedRecipes = allRecipes.filter(
    (recipe) => savedIds.includes(recipe.id)
  );

  // Reusable recipe card.
  function RecipeCard({ recipe, children }) {
    return (
      <article className="crystal-card">
        <Link to={`/recipes/${recipe.id}`}>
          <img
            src={recipe.image}
            alt={recipe.imageAlt}
            className="crystal-image"
          />
          <h3>{recipe.name}</h3>
        </Link>

        <p>{recipe.difficulty} · {recipe.time}</p>

        {children}
      </article>
    );
  }

  return (
    <main className="page-content profile-page">
      <header className="profile-heading">
        <h1>My Profile</h1>
        <p>Your crystal-growing journey</p>
      </header>

      <section className="profile-user">
        <div className="profile-avatar">🧪</div>

        <div>
          <h2>{profile?.display_name || "Crystal Explorer"}</h2>
          <p>Growing crystals, one experiment at a time</p>
        </div>
      </section>

      {user && <button className={styles.signOut} type="button" disabled={busy} onClick={handleSignOut}>{busy ? "Signing out…" : "Sign out"}</button>}
      {error && <p role="alert">{error}</p>}

      <section className="profile-tabs">
        <button
          className={activeTab === "collection" ? "active" : ""}
          onClick={() => setActiveTab("collection")}
        >
          My collection
        </button>

        <button
          className={activeTab === "saved" ? "active" : ""}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
      </section>

      {activeTab === "collection" && (
        <>
          <section className="profile-section">
            <h2>In progress</h2>

            {currentRecipe ? (
              <article className="progress-card">
                <Link to={`/recipes/${currentRecipe.id}`}>
                  <img
                    src={currentRecipe.image}
                    alt={currentRecipe.imageAlt}
                    className="crystal-image"
                  />
                </Link>

                <h3>{currentRecipe.name}</h3>
                <p>{currentRecipe.time}</p>
                <p>Currently growing</p>

                <Link to={`/recipes/${currentRecipe.id}`}>
                  Continue recipe
                </Link>

                <button
                  onClick={() => finishGrowing(currentRecipe.id)}
                >
                  Mark as finished
                </button>
              </article>
            ) : (
              <p>
                No crystal growing right now. Choose a recipe
                from Saved to get started!
              </p>
            )}
          </section>

          <section className="profile-section">
            <h2>Finished</h2>

            {finishedRecipes.length > 0 ? (
              <div className="crystal-grid">
                {finishedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <p>Your finished crystals will appear here.</p>
            )}
          </section>
        </>
      )}

      {activeTab === "saved" && (
        <section className="profile-section">
          <h2>Saved recipes</h2>

          {savedRecipes.length > 0 ? (
            <div className={styles.savedCards}>
              {savedRecipes.map((recipe) => (
                <CrystalProjectCard key={recipe.id} title={recipe.name} image={recipe.image} imageAlt={recipe.imageAlt} description={recipe.isPlaceholder ? "Coming soon" : `${recipe.time} · ${recipe.price}`} to={`/recipes/${recipe.id}`} saved onToggleSave={() => removeSaved(recipe.id)} />
              ))}
            </div>
          ) : (
            <p>
              You haven't saved any recipes yet.
              Visit the Recipes page to find one!
            </p>
          )}
        </section>
      )}
    </main>
  );
}
