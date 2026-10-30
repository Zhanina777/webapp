// Save account completions in Supabase and transfer the one-project guest record after sign-in.
import { requireSupabase } from "./supabase.js";
import { findCrystalProject } from "../data/crystalProjects.js";

const guestKey = "cryst-guest-completed";

export function guestAccountDestination(pathname, search, completed) {
  // Guests can browse all recipes, but only complete one project before signing up.
  // Its celebration screen stays accessible after the completion marker is saved.
  if (pathname.replace(/\/$/, "") === "/profile") return "/create-profile";
  const isGrow = /^\/recipes\/[^/]+\/grow\/?$/.test(pathname);
  const isCelebration = new URLSearchParams(search).get("step") === "complete";
  return isGrow && completed && !isCelebration ? "/create-profile?reason=project-limit" : null;
}

export function guestCompleted() {
  try { const data = JSON.parse(localStorage.getItem(guestKey) || "[]"); return Array.isArray(data) && data.some(id => Boolean(findCrystalProject(id))); }
  catch { return false; }
}

export async function saveCompletion(user, recipeId, steps, client) {
  if (!user) {
    if (guestCompleted()) throw new Error("Sign in to complete more projects. Your free guest project is already saved.");
    if (!findCrystalProject(recipeId)) throw new Error("Recipe not found.");
    localStorage.setItem(guestKey, JSON.stringify([recipeId]));
    return;
  }
  // Upsert makes retries update the same user/recipe record rather than duplicate it.
  const { error } = await (client || requireSupabase()).from("recipe_progress").upsert({
    user_id: user.id, recipe_id: recipeId, current_step: steps, completed: true,
  }, { onConflict: "user_id,recipe_id" });
  if (error) throw error;
}

export async function importGuestCompletion(user, client) {
  // Keep the local marker until every cloud write succeeds, so a failed import
  // can be retried. The first account signing in on this browser receives it.
  if (!guestCompleted()) return;
  const ids = JSON.parse(localStorage.getItem(guestKey) || "[]");
  for (const id of ids) {
    const recipe = findCrystalProject(id);
    if (recipe) await saveCompletion(user, id, recipe.steps.length, client);
  }
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
