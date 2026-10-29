import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { saveCompletion, importGuestCompletion, guestCompleted, guestAccountDestination } from "../app/supabase-connection/projectProgress.js";

beforeEach(() => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
});

test("guest navigation allows browsing before and after the free project", () => {
  for (const complete of [false, true]) {
    for (const path of ["/", "/recipes", "/recipes/rock-candy-sticks", "/create-profile"]) {
      assert.equal(guestAccountDestination(path, "", complete), null);
    }
    assert.equal(guestAccountDestination("/profile", "", complete), "/create-profile");
  }
});

test("guest instruction links lock after completion, including direct steps and trailing slashes", () => {
  const path = "/recipes/rock-candy-sticks/grow";
  assert.equal(guestAccountDestination(path, "?step=2", false), null);
  assert.equal(guestAccountDestination(path, "?step=2", true), "/create-profile?reason=project-limit");
  assert.equal(guestAccountDestination(`${path}/`, "", true), "/create-profile?reason=project-limit");
  assert.equal(guestAccountDestination(path, "?step=complete", true), null);
});

test("guest completion is retained and other guest projects are rejected", async () => {
  await saveCompletion(null, "salt-string-magic", 4);
  assert.equal(guestCompleted(), true);
  await assert.rejects(saveCompletion(null, "blue-crystal-lab", 4), /Sign in/);
});

test("guests may choose a different first project, but cannot finish a second", async () => {
  await saveCompletion(null, "rock-candy-sticks", 4);
  assert.equal(guestCompleted(), true);
  await assert.rejects(saveCompletion(null, "salt-string-magic", 4), /Sign in/);
});

test("the chosen guest project transfers with its recipe step count", async () => {
  await saveCompletion(null, "rock-candy-sticks", 4);
  const writes = [];
  const client = { from: () => ({ upsert: async row => { writes.push(row); return { error: null }; } }) };
  await importGuestCompletion({ id: "account-one" }, client);
  assert.equal(writes[0].recipe_id, "rock-candy-sticks");
  assert.ok(writes[0].current_step > 0);
  assert.equal(guestCompleted(), false);
});

test("guest completion transfers to the signed-in owner and clears only after success", async () => {
  await saveCompletion(null, "salt-string-magic", 4);
  const writes = [];
  const client = { from: table => ({ upsert: async (row, options) => { writes.push({ table, row, options }); return { error: null }; } }) };
  await importGuestCompletion({ id: "account-one" }, client);
  assert.equal(writes[0].row.user_id, "account-one");
  assert.equal(writes[0].row.completed, true);
  assert.equal(writes[0].row.recipe_id, "salt-string-magic");
  assert.equal(guestCompleted(), false);
  await importGuestCompletion({ id: "account-two" }, client);
  assert.equal(writes.length, 1);
});

test("failed transfer keeps guest completion for a retry", async () => {
  await saveCompletion(null, "salt-string-magic", 4);
  const client = { from: () => ({ upsert: async () => ({ error: new Error("offline") }) }) };
  await assert.rejects(importGuestCompletion({ id: "account-one" }, client), /offline/);
  assert.equal(guestCompleted(), true);
});

test("malformed local progress cannot crash account initialization", () => {
  for (const value of ["null", "{}", "broken"]) {
    localStorage.setItem("cryst-guest-completed", value);
    assert.equal(guestCompleted(), false);
  }
});
