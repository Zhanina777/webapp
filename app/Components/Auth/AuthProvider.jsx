import { createContext, useContext, useEffect, useState } from "react";
import { supabase, requireSupabase } from "../../supabase-connection/supabase";
import { importGuestCompletion } from "../../supabase-connection/projectProgress";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!supabase) { setError("Supabase is not configured."); setLoading(false); return; }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;
    setProfile(null);
    setError("");
    if (!user) return;
    async function load() {
      try {
        const client = requireSupabase();
        let { data, error: readError } = await client.from("profiles").select("id,display_name").eq("id", user.id).maybeSingle();
        if (readError) throw readError;
        if (!data) {
          const name = String(user.user_metadata?.display_name || "Crystal explorer").trim().slice(0, 40) || "Crystal explorer";
          const result = await client.from("profiles").upsert({ id: user.id, display_name: name }, { onConflict: "id", ignoreDuplicates: true });
          if (result.error) throw result.error;
          const resultProfile = await client.from("profiles").select("id,display_name").eq("id", user.id).single();
          if (resultProfile.error) throw resultProfile.error;
          data = resultProfile.data;
        }
        if (active) setProfile(data);
        await importGuestCompletion(user);
      } catch (problem) { if (active) setError(`Your account is signed in, but profile or guest-project syncing needs a retry: ${problem.message}`); }
    }
    load();
    return () => { active = false; };
  }, [user?.id, retry]);

  async function signOut() {
    const { error: signOutError } = await requireSupabase().auth.signOut();
    if (signOutError) throw signOutError;
    setUser(null);
    setProfile(null);
  }

  return <AuthContext.Provider value={{ user, profile, loading, signOut }}>
    {error && <aside className="auth-sync-notice" role="alert">{error} <button type="button" onClick={() => setRetry(value => value + 1)}>Retry sync</button></aside>}
    {children}
  </AuthContext.Provider>;
}
