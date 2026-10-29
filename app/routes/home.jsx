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
  const { profile } = useAuth();
  const name = profile?.display_name;
  return (
    <main id="main-content" className="container home-content" aria-label="CRYST home">
      {name && <div className={styles.welcome}><h1>Welcome, {name}!</h1><p>Ready to grow something amazing?</p></div>}
      <MonthlyRecipe />
      <ScienceBite />
      <FriendsFeed />
    </main>
  );
}
