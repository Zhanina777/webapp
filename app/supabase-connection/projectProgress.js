// Store account steps and completions in Supabase, transferring guest work on sign-in.
import { requireSupabase } from "./supabase.js";
import { findCrystalProject } from "../data/crystalProjects.js";
import { getCurrentProgress, getFinishedRecipes, saveRecipeProgress } from "../guests/recipeStorage.js";

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
  if (!user || !guestCompleted()) return;
  const ids = JSON.parse(localStorage.getItem(guestKey) || "[]");
  for (const id of ids) {
    const recipe = findCrystalProject(id);
    if (recipe) await saveCompletion(user, id, recipe.steps.length, client);
  }
  localStorage.removeItem(guestKey);
}

// Preserve existing account progress when importing a browser's guest project.
export async function importGuestProgress(user, client) {
  if (!user) return;
  let progress;
  try {
    progress = getCurrentProgress();
    if (getFinishedRecipes().includes(progress.recipeId)) return;
  } catch { return; }
  const recipe = findCrystalProject(progress.recipeId);
  if (!recipe?.steps?.length) return;
  const { error } = await (client || requireSupabase()).from("recipe_progress").upsert({
    user_id: user.id, recipe_id: recipe.id,
    current_step: Math.min(progress.step, recipe.steps.length), completed: false,
  }, { onConflict: "user_id,recipe_id", ignoreDuplicates: true });
  if (error) throw error;
  try {
    if (localStorage.getItem("cryst-progress") === recipe.id) localStorage.removeItem("cryst-progress");
  } catch { /* A duplicate import is safe if browser storage cannot be cleared. */ }
}

export async function getProjectProgress(user, client) {
  // Use the same record structure for local guest data and account database results.
  if (!user) {
    const progress = getCurrentProgress();
    return [
      ...getFinishedRecipes().map(recipe_id => ({ recipe_id, completed: true, current_step: 1 })),
      ...(progress.recipeId && !getFinishedRecipes().includes(progress.recipeId)
        ? [{ recipe_id: progress.recipeId, current_step: progress.step, completed: false }] : []),
    ];
  }
  await importGuestCompletion(user, client);
  await importGuestProgress(user, client);
  // Load only this account's projects, with the most recently updated first.
  const { data, error } = await (client || requireSupabase()).from("recipe_progress")
    .select("recipe_id,current_step,completed,updated_at").eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveProjectStep(user, recipeId, step, client) {
  const recipe = findCrystalProject(recipeId);
  if (!recipe?.steps?.length || !Number.isInteger(step) || step < 1 || step > recipe.steps.length) {
    throw new Error("Invalid recipe step.");
  }
  if (!user) return saveRecipeProgress(recipeId, step);
  const db = client || requireSupabase();
  // Create missing records and update only unfinished projects so reviewing
  // completed instructions cannot reset the project's completion status.
  const { error: insertError } = await db.from("recipe_progress").upsert({
    user_id: user.id, recipe_id: recipeId, current_step: step, completed: false,
  }, { onConflict: "user_id,recipe_id", ignoreDuplicates: true });
  if (insertError) throw insertError;
  const { error } = await db.from("recipe_progress").update({ current_step: step })
    .eq("user_id", user.id).eq("recipe_id", recipeId).eq("completed", false);
  if (error) throw error;
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
