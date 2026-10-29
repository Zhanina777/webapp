// Storage errors are handled by callers so each screen can show its own message.
function readIds(key) {
  const value = JSON.parse(localStorage.getItem(key) || "[]");
  return Array.isArray(value) ? value : [];
}

export function getSavedRecipes() {
  return readIds("cryst-saved");
}

export function toggleSavedRecipe(recipeId) {
  const saved = getSavedRecipes();
  const updated = saved.includes(recipeId) ? saved.filter(id => id !== recipeId) : [...saved, recipeId];
  localStorage.setItem("cryst-saved", JSON.stringify(updated));
  return updated;
}

export function getFinishedRecipes() {
  return readIds("cryst-finished");
}

export function getCurrentProgress() {
  const recipeId = localStorage.getItem("cryst-progress");
  const storedStep = Number(localStorage.getItem(`cryst-step:${recipeId}`) || 1);
  return { recipeId, step: Number.isInteger(storedStep) && storedStep > 0 ? storedStep : 1 };
}

export function saveRecipeProgress(recipeId, step) {
  if (getFinishedRecipes().includes(recipeId)) return;
  localStorage.setItem("cryst-progress", recipeId);
  if (step !== undefined) localStorage.setItem(`cryst-step:${recipeId}`, String(step));
}

export function markRecipeFinished(recipeId) {
  localStorage.setItem("cryst-finished", JSON.stringify([...new Set([...getFinishedRecipes(), recipeId])]));
  if (localStorage.getItem("cryst-progress") === recipeId) localStorage.removeItem("cryst-progress");
}
