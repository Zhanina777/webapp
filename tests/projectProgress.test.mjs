import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { saveCompletion, importGuestCompletion, guestCompleted } from "../app/supabase-connection/projectProgress.js";

beforeEach(() => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
});

test("guest completion is retained and other guest projects are rejected", async () => {
  await saveCompletion(null, "salt-string-magic", 4);
  assert.equal(guestCompleted(), true);
  await assert.rejects(saveCompletion(null, "blue-crystal-lab", 4), /Sign in/);
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
