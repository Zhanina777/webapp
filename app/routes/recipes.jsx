// Browse the recipe catalogue; URL filters and browser-saved favourites are managed here.
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import styles from "./recipes.module.css";
import { projectSections as sections } from "../data/crystalProjects";
import RecipeFilters from "../Components/RecipeFilters";
import CrystalProjectCard from "../Components/CrystalProjectCard";
import { matchesRecipe, materialOptions } from "../data/recipeFiltering";
import { getSavedRecipes, toggleSavedRecipe } from "../utils/recipeStorage";

// Build the material choices once from the same recipe data used by the cards.
const availableMaterials = materialOptions(sections.flatMap(section => section.recipes));

export function meta() {
  return [{ title: "Recipes | CRYST" }];
}

export default function Recipes() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [savedIds, setSavedIds] = useState([]);
  const [saveError, setSaveError] = useState("");
  useEffect(() => {
    try {
      setSavedIds(getSavedRecipes());
    } catch { setSaveError("Saved recipes could not be loaded on this browser."); }
  }, []);
  const [searchParams, setSearchParams] = useSearchParams();

  // Applied filters live in the URL so refresh, sharing and browser history preserve them.
  const query = searchParams.get("q") || "";
  const level = searchParams.get("level");
  const selectedMaterials = searchParams.getAll("material");
  const minPrice = searchParams.get("min") || "";
  const maxPrice = searchParams.get("max") || "";
  const isGrid = level !== null || selectedMaterials.length > 0 || minPrice !== "" || maxPrice !== "";

  const difficulty = sections.find(
    section => section.name.toLowerCase() === level
  );

  // Keep difficulty groups, apply every selected filter, then hide empty groups.
  const visibleSections = sections
    .filter(section => !difficulty || section.name === difficulty.name)
    .map(section => ({
      ...section,
      recipes: section.recipes.filter(recipe => matchesRecipe(recipe, { query, materials: selectedMaterials, min: minPrice, max: maxPrice }))
    }))
    .filter(section => section.recipes.length);

  function updateSearch(value) {
    setSearchParams(current => {
      const next = new URLSearchParams(current);

      if (value) next.set("q", value);
      else next.delete("q");

      return next;
    }, { replace: true, preventScrollReset: true });
  }

  function gridUrl(value) {
    // Opening a difficulty group must preserve the other applied filters.
    const params = new URLSearchParams(searchParams);
    params.set("level", value);

    return `/recipes?${params}`;
  }

  function saveForLater(recipeId) {
    try {
      setSavedIds(toggleSavedRecipe(recipeId));
      setSaveError("");
    } catch { setSaveError("This recipe could not be saved. Please allow browser storage and try again."); }
  }

  return (
    <main
      id="main-content"
      className={styles.page}
      aria-label="Crystal recipes"
    >
      <div className={styles.searchRow}>
        <label className={styles.search}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="7.5" />
            <path d="m16 16 5 5" />
          </svg>

          <input
            type="search"
            placeholder="Search recipes"
            aria-label="Search recipes"
            value={query}
            onChange={event => updateSearch(event.target.value)}
          />
        </label>

        <button
          className={styles.filterButton}
          type="button"
          aria-label="Filter recipes"
          aria-expanded={filtersOpen}
          aria-controls="recipe-filters"
          onClick={() => setFiltersOpen(open => !open)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M3 5h7m4 0h7M3 12h13m4 0h1M3 19h3m4 0h11M10 2v6m6 1v6M6 16v6" />
          </svg>
        </button>
      </div>

      {filtersOpen && (
        <RecipeFilters
          levels={sections.map(section => section.name)}
          selectedLevel={difficulty ? level : "all"}
          materials={availableMaterials}
          selectedMaterials={selectedMaterials}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onCancel={() => setFiltersOpen(false)}
          onApply={filters => {
            // Replace filter values while retaining the current search text.
            const params = new URLSearchParams(searchParams);
            params.set("level", filters.level);
            params.delete("material");
            filters.materials.forEach(material => params.append("material", material));
            for (const key of ["min", "max"]) {
              if (filters[key] !== "") params.set(key, filters[key]);
              else params.delete(key);
            }
            setSearchParams(params);

            setFiltersOpen(false);
          }}
        />
      )}

      {isGrid && (
        <div className={styles.gridControls}>
          <Link to="/recipes" className={styles.backLink}>
            ← All recipes
          </Link>
        </div>
      )}

      <div className={styles.sections}>
        {saveError && <p role="alert">{saveError}</p>}
        {visibleSections.map(section => (
          <section
            key={section.name}
            aria-labelledby={`heading-${section.name}`}
          >
            <div className={styles.sectionHeading}>
              <h1 id={`heading-${section.name}`}>
                {section.name}
              </h1>

              {!isGrid && (
                <Link
                  className={styles.seeMore}
                  to={gridUrl(section.name.toLowerCase())}
                >
                  See more <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>

            <div
              className={`${styles.cards} ${isGrid ? styles.grid : ""}`}
              tabIndex={isGrid ? undefined : 0}
              role="region"
              aria-label={`${section.name} recipes`}
            >
              {section.recipes.map(recipe => (
                <div key={recipe.id} className={styles.recipeCard}>
                  <CrystalProjectCard
                    title={recipe.name}
                    image={recipe.image}
                    imageAlt={recipe.imageAlt}
                    to={`/recipes/${recipe.id}`}
                    saved={savedIds.includes(recipe.id)}
                    onToggleSave={() => saveForLater(recipe.id)}
                    description={
                      recipe.isPlaceholder
                        ? "Coming soon"
                        : `${recipe.time} · ${recipe.price}`
                    }
                  />

                </div>
              ))}
            </div>
          </section>
        ))}

        {!visibleSections.length && (
          <p className={styles.empty} role="status">
            No recipes found. Try another search or difficulty.
          </p>
        )}
      </div>
    </main>
  );
}
