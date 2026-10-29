import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { projectSections } from "../app/data/crystalProjects.js";
import { tutorialImages } from "../app/data/tutorialImages.js";

for (const recipe of projectSections.flatMap(section => section.recipes)) {
  test(`${recipe.id} illustrates each step with a distinct photo`, () => {
    assert.equal(tutorialImages[recipe.id].length, recipe.steps.length);
    const hashes = new Set();
    for (const [index, step] of recipe.steps.entries()) {
      const context = `${recipe.id}, step ${index + 1}`;
      assert.ok(step.imageAlt?.trim(), `${context}: missing alt text`);
      assert.ok(step.imageCaption?.trim(), `${context}: missing visual guidance`);
      const file = new URL(`../public${decodeURIComponent(step.image)}`, import.meta.url);
      assert.ok(existsSync(file), `${context}: image file is missing`);
      const hash = createHash("sha256").update(readFileSync(file)).digest("hex");
      assert.ok(!hashes.has(hash), `${context}: a previous step uses the same photo`);
      hashes.add(hash);
    }
  });
}
