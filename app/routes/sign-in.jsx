// Connect welcome-screen actions to account routes, guest browsing and social sign-in.
import WelcomePage from "../Components/Account/WelcomePage";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAccount } from "../Components/Account/AccountProvider";
import { requireSupabase } from "../supabase-connection/supabase";

export const handle = { hideNavigation: true };

export function meta() {
  return [{ title: "Welcome | CRYST" }, { name: "description", content: "Start growing sparkling crystals with CRYST." }];
}

export default function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { signOut } = useAccount();
  async function continueAsGuest() {
    try {
      await signOut();
      navigate("/");
    } catch {
      setError("Could not sign out. Please try again.");
    }
  }
  async function social(provider) {
    setError("");
    try {
      const { error: problem } = await requireSupabase().auth.signInWithOAuth({ provider: provider.toLowerCase(), options: { redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}create-profile` } });
      if (problem) throw problem;
    } catch (problem) { setError(`${provider} sign-in could not start: ${problem.message}`); }
  }
  return <><WelcomePage onGetStarted={() => navigate("/create-profile")} onSignIn={() => navigate("/create-profile?mode=login")} onSocialSignIn={social} onContinueAsGuest={continueAsGuest} />{error && <p role="alert">{error}</p>}</>;
}
