export function materialKey(value) {
  return value.replace(/\([^)]*\)/g, "").trim().replace(/\s+/g, " ").toLowerCase();
}

export function priceRange(price) {
  const values = price.match(/\d+(?:\.\d+)?/g)?.map(Number);
  return values?.length ? [values[0], values[1] ?? values[0]] : null;
}

export function matchesRecipe(recipe, { query = "", materials = [], min = "", max = "" }) {
  if (!recipe.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
  const available = recipe.materials.map(materialKey);
  if (!materials.every(material => available.includes(material))) return false;
  const lower = min !== "" && Number.isFinite(Number(min)) && Number(min) >= 0 ? Number(min) : null;
  const upper = max !== "" && Number.isFinite(Number(max)) && Number(max) >= 0 ? Number(max) : null;
  if (lower === null && upper === null) return true;
  const range = priceRange(recipe.price);
  return Boolean(range && (lower === null || range[0] >= lower) && (upper === null || range[1] <= upper));
}

export function materialOptions(recipes) {
  const options = new Map();
  for (const recipe of recipes) {
    for (const material of recipe.materials) {
      options.set(materialKey(material), material.replace(/\([^)]*\)/g, "").trim());
    }
  }
  return [...options].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label));
}
