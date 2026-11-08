// Store guest favourites locally and signed-in favourites in the account's database records.
import { requireSupabase } from "./supabase.js";

const guestKey = "cryst-saved";

function readGuestIds() {
  try {
    const value = JSON.parse(localStorage.getItem(guestKey) || "[]");
    return Array.isArray(value)
      ? [...new Set(value.filter(id => typeof id === "string" && id.length > 0 && id.length <= 100))]
      : [];
  } catch {
    // Guest storage must not prevent a signed-in account from using cloud saves.
    return [];
  }
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
  // Complete the guest import before loading the account's saved collection.
  await importGuestSavedProjects(user, client);
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
  await importGuestSavedProjects(user, supabase);
  const query = supabase.from("recipe_saves");
  // The user/recipe pair prevents duplicate saves when a request is retried.
  const result = currentlySaved
    ? await query.delete().eq("user_id", user.id).eq("recipe_id", recipeId)
    : await query.upsert({ user_id: user.id, recipe_id: recipeId }, {
      onConflict: "user_id,recipe_id", ignoreDuplicates: true,
    });
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
  // Clear guest data only after Supabase confirms a successful import.
  try { localStorage.removeItem(guestKey); }
  catch { /* Cloud saves remain available if the browser blocks guest cleanup. */ }
}
