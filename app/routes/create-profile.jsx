// Connect the account form to Supabase; the mode query parameter selects sign-in or sign-up.
import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import CreateProfile from "../Components/Account/CreateProfile";
import { requireSupabase } from "../supabase-connection/supabase";
import { useAccount } from "../Components/Account/AccountProvider";

export const handle = { hideNavigation: true };
export function meta() { return [{ title: "Your account | CRYST" }]; }

export default function CreateProfileRoute() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const login = params.get("mode") === "login";
  const { user, loading, signOut } = useAccount();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  // The auth listener triggers navigation: login returns to recipes; signup opens payment.
  const afterAuth = useRef("/recipes");
  useEffect(() => { if (!loading && user) navigate(afterAuth.current, { replace: true }); }, [user, loading, navigate]);

  async function create(profile) {
    if (busy) return;
    setBusy(true); setError(""); setMessage("");
    afterAuth.current = login ? "/recipes" : "/payment";
    try {
      const client = requireSupabase();
      const result = login
        ? await client.auth.signInWithPassword({ email: profile.email, password: profile.password })
        : await client.auth.signUp({ email: profile.email, password: profile.password, options: { data: { display_name: profile.name } } });
      if (result.error) throw result.error;
      if (!result.data.session) setMessage("Sign-up could not sign you in yet. The project owner needs to turn off Confirm email in Supabase Authentication > Sign In / Providers > Email. Then try signing in. Your guest project is still saved on this browser.");
    } catch (problem) { setError(problem.message); }
    finally { setBusy(false); }
  }
  async function continueAsGuest() {
    try { await signOut(); navigate("/recipes"); } catch (problem) { setError(problem.message); }
  }
  async function social(provider) {
    setError("");
    try {
      const { error: problem } = await requireSupabase().auth.signInWithOAuth({ provider: provider.toLowerCase(), options: { redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}create-profile` } });
      if (problem) throw problem;
    } catch (problem) { setError(`${provider} sign-in could not start: ${problem.message}`); }
  }
  return <CreateProfile key={login ? "login" : "signup"} login={login} busy={busy} message={message || (params.get("reason") === "project-limit" ? "Your free project is complete! Create a profile or sign in to start more projects. You can still browse all recipes as a guest." : "")} authError={error} onBack={() => navigate("/recipes")} onCreate={create} onContinueAsGuest={continueAsGuest} onSocialSignIn={social} onSwitchMode={() => { setError(""); setMessage(""); setParams(login ? {} : { mode: "login" }); }} />;
}
