import MonthlyRecipe from "../Components/MonthlyRecipe";
import FriendsFeed from "../Components/FriendsFeed";

export function meta() {
  return [
    { title: "CRYST" },
    { name: "description", content: "Welcome to CRYST." },
  ];
}

export default function Home() {
  return (
    <main id="main-content" className="container home-content" aria-label="CRYST home">
      <MonthlyRecipe />
      <FriendsFeed />
    </main>
  );
}
