import { requireSupabase } from "./supabase.js";

const guestKey = "cryst-guest-completed";

export function guestCompleted() {
  try { const data = JSON.parse(localStorage.getItem(guestKey) || "[]"); return Array.isArray(data) && data.includes("salt-string-magic"); }
  catch { return false; }
}

export async function saveCompletion(user, recipeId, steps, client) {
  if (!user) {
    if (recipeId !== "salt-string-magic") throw new Error("Sign in to save this project.");
    localStorage.setItem(guestKey, JSON.stringify([recipeId]));
    return;
  }
  const { error } = await (client || requireSupabase()).from("recipe_progress").upsert({
    user_id: user.id, recipe_id: recipeId, current_step: steps, completed: true,
  }, { onConflict: "user_id,recipe_id" });
  if (error) throw error;
}

export async function importGuestCompletion(user, client) {
  if (!guestCompleted()) return;
  await saveCompletion(user, "salt-string-magic", 4, client);
  localStorage.removeItem(guestKey);
}

export async function getCompletedProjects() {
  const client = requireSupabase();
  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError) throw authError;
  if (!user) return [];
  const { data, error } = await client.from("recipe_progress").select("recipe_id,current_step,completed,updated_at").eq("user_id", user.id).eq("completed", true).order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}
