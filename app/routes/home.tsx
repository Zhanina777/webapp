import MonthlyRecipe from "../Components/MonthlyRecipe";

export function meta() {
  return [
    { title: "CRYST" },
    { name: "description", content: "Welcome to CRYST." },
  ];
}

export default function Home() {
  return (
    <main id="main-content" className="container" aria-label="CRYST home">
      <MonthlyRecipe />
    </main>
  );
}
