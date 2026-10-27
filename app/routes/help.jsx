import { Link } from "react-router";

export function meta() {
  return [{ title: "Help | CRYST" }];
}

export default function Help() {
  return (
    <main className="page-content">
      <h1>Help</h1>
      <p>Use the sun and moon button to switch between light and dark themes. Your choice is remembered on this browser.</p>
      <p>Select CRYST in the header to return home.</p>
      <Link to="/">Back to home</Link>
    </main>
  );
}
