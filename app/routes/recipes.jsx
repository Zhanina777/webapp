import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import styles from "./recipes.module.css";
import { projectSections as sections } from "../data/crystalProjects";
import RecipeFilters from "../Components/RecipeFilters";
import CrystalProjectCard from "../Components/CrystalProjectCard";

export function meta() {
  return [{ title: "Recipes | CRYST" }];
}

export default function Recipes() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const level = searchParams.get("level");
  const isGrid = level !== null;

  const difficulty = sections.find(
    section => section.name.toLowerCase() === level
  );

  const visibleSections = sections
    .filter(section => !difficulty || section.name === difficulty.name)
    .map(section => ({
      ...section,
      recipes: section.recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query.toLowerCase().trim())
      )
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
    const params = new URLSearchParams({ level: value });

    if (query) params.set("q", query);

    return `/recipes?${params}`;
  }

  function saveForLater(recipeId) {
    const savedRecipes = JSON.parse(
      localStorage.getItem("cryst-saved") || "[]"
    );

    if (!savedRecipes.includes(recipeId)) {
      savedRecipes.push(recipeId);

      localStorage.setItem(
        "cryst-saved",
        JSON.stringify(savedRecipes)
      );
    }
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
          onCancel={() => setFiltersOpen(false)}
          onApply={value => {
            setSearchParams({
              level: value,
              ...(query ? { q: query } : {})
            });

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
                <div key={recipe.id}>
                  <CrystalProjectCard
                    title={recipe.name}
                    image={recipe.image}
                    imageAlt={recipe.imageAlt}
                    to={`/recipes/${recipe.id}`}
                    description={
                      recipe.isPlaceholder
                        ? "Coming soon"
                        : `${recipe.time} · ${recipe.price}`
                    }
                  />

                  <div style={{ padding: "10px" }}>
                    <button
                      type="button"
                      onClick={() => saveForLater(recipe.id)}
                    >
                      Save for later
                    </button>
                  </div>
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