import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Components/Auth/AuthProvider";
import styles from "./profile.module.css";

export function meta() { return [{ title: "Profile | CRYST" }]; }
export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function handleSignOut() {
    setBusy(true);
    setError("");
    try { await signOut(); navigate("/"); }
    catch (problem) { setError(problem.message); setBusy(false); }
  }
  return <main className="page-content"><h1>Profile</h1><p>Your profile page is coming soon.</p>
    {user && <button className={styles.signOut} type="button" disabled={busy} onClick={handleSignOut}>{busy ? "Signing out…" : "Sign out"}</button>}
    {error && <p role="alert">{error}</p>}
  </main>;
}
