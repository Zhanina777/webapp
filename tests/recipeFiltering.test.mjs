import { test } from "node:test";
import assert from "node:assert/strict";
import { matchesRecipe, materialKey, materialOptions, priceRange } from "../app/data/recipeFiltering.js";

const recipe = { name: "Salt string magic", materials: ["Table salt", "Water (250 ml)", "Cotton string"], price: "0–25 kr" };

test("materials ignore quantities and require all selected materials", () => {
  assert.equal(materialKey("Water (250 ml)"), "water");
  assert.equal(matchesRecipe(recipe, { materials: ["water", "cotton string"] }), true);
  assert.equal(matchesRecipe(recipe, { materials: ["water", "sugar"] }), false);
  assert.equal(materialOptions([recipe, { ...recipe, materials: ["Water (500 ml)"] }]).filter(option => option.value === "water").length, 1);
});

test("budget bounds include the entire estimated price range and accept zero", () => {
  assert.deepEqual(priceRange("10–35 kr"), [10, 35]);
  assert.equal(matchesRecipe(recipe, { min: "0", max: "25" }), true);
  assert.equal(matchesRecipe(recipe, { max: "24" }), false);
  assert.equal(matchesRecipe(recipe, { min: "1" }), false);
  assert.equal(matchesRecipe(recipe, { max: "0" }), false);
});

test("search, materials and budget combine; unpriced laboratory recipes are excluded only with price bounds", () => {
  assert.equal(matchesRecipe(recipe, { query: " SALT ", materials: ["water"], max: "25" }), true);
  assert.equal(matchesRecipe(recipe, { query: "candy", max: "25" }), false);
  const laboratory = { ...recipe, price: "School laboratory" };
  assert.equal(matchesRecipe(laboratory, {}), true);
  assert.equal(matchesRecipe(laboratory, { max: "50" }), false);
});
