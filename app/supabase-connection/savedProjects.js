import { requireSupabase } from "./supabase";

const guestKey = "cryst-saved";

function readGuestIds() {
  const value = JSON.parse(localStorage.getItem(guestKey) || "[]");
  return Array.isArray(value) ? value : [];
}

export function getGuestSavedProjects() {
  return readGuestIds();
}

export function toggleGuestSavedProject(recipeId) {
  const saved = readGuestIds();
  const updated = saved.includes(recipeId)
    ? saved.filter(id => id !== recipeId)
    : [...saved, recipeId];
  localStorage.setItem(guestKey, JSON.stringify(updated));
  return updated;
}

export async function getSavedProjectIds(user, client) {
  if (!user) return readGuestIds();
  const { data, error } = await (client || requireSupabase())
    .from("recipe_saves")
    .select("recipe_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(row => row.recipe_id);
}

export async function toggleSavedProject(user, recipeId, currentlySaved, client) {
  if (!user) return toggleGuestSavedProject(recipeId);
  const supabase = client || requireSupabase();
  const query = supabase.from("recipe_saves");
  const result = currentlySaved
    ? await query.delete().eq("user_id", user.id).eq("recipe_id", recipeId)
    : await query.insert({ user_id: user.id, recipe_id: recipeId });
  if (result.error) throw result.error;
  return getSavedProjectIds(user, supabase);
}

export async function importGuestSavedProjects(user, client) {
  const ids = readGuestIds();
  if (!user || ids.length === 0) return;
  const supabase = client || requireSupabase();
  const { error } = await supabase.from("recipe_saves").upsert(
    ids.map(recipe_id => ({ user_id: user.id, recipe_id })),
    { onConflict: "user_id,recipe_id", ignoreDuplicates: true },
  );
  if (error) throw error;
  localStorage.removeItem(guestKey);
}
