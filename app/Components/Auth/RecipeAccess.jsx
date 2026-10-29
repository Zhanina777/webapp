import { useAuth } from "./AuthProvider";
import { Link, useLocation } from "react-router";
import styles from "./recipeAccess.module.css";

// Navigation gate; database access is independently enforced by Supabase RLS.
export default function RecipeAccess({ children }) {
  const { pathname } = useLocation();
  const { user, loading } = useAuth();
  const restricted = pathname.startsWith("/recipes") &&
    pathname !== "/recipes/salt-string-magic" &&
    pathname !== "/recipes/salt-string-magic/grow";

  if (!restricted) return children;
  if (loading) return <main className="page-content"><p role="status">Checking recipe access…</p></main>;
  if (user) return children;
  return <main id="main-content" className={styles.page}>
    <section className={styles.invitation} aria-labelledby="guest-recipes-heading">
      <div className={styles.art} aria-hidden="true"><img src="/images/monthly-alum-crystal.png" alt="" width="160" height="160" /></div>
      <p className={styles.eyebrow}>YOUR NEXT DISCOVERY</p>
      <h1 id="guest-recipes-heading">More crystals are waiting!</h1>
      <p className={styles.intro}>A little curiosity can grow into something amazing. Create an account to unlock more crystal recipes.</p>
      <Link className={styles.primary} to="/create-profile">Create your profile <span aria-hidden="true">→</span></Link>
      <p className={styles.signIn}>Already have an account? <Link to="/create-profile?mode=login">Sign in</Link></p>
    </section>
    <section className={styles.guest} aria-labelledby="guest-try-heading">
      <span className={styles.badge}>FREE TO TRY</span>
      <h2 id="guest-try-heading">Start with a little salt magic</h2>
      <p>You can still grow Salt String Magic and explore home as a guest.</p>
      <Link className={styles.secondary} to="/recipes/salt-string-magic">Try Salt String Magic <span aria-hidden="true">→</span></Link>
    </section>
  </main>;
}
