import MonthlyRecipe from "../Components/MonthlyRecipe";
import FriendsFeed from "../Components/FriendsFeed";
import ScienceBite from "../Components/ScienceBite";
import { useAuth } from "../Components/Auth/AuthProvider";
import styles from "./home.module.css";

export function meta() {
  return [
    { title: "CRYST" },
    { name: "description", content: "Welcome to CRYST." },
  ];
}

export default function Home() {
  const { user, profile } = useAuth();
  const name = user ? profile?.display_name?.trim() : null;
  return (
    <main id="main-content" className={`container home-content ${styles.home}`} aria-label="CRYST home">
      <div className={styles.welcome}><h1>{name ? `Welcome, ${name}!` : "Welcome!"}</h1><p>Ready to grow something amazing?</p></div>
      <MonthlyRecipe />
      <ScienceBite />
      <FriendsFeed />
    </main>
  );
}
