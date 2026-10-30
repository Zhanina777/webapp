// Shared app entry: document tags, account state, navigation and route errors live here.
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "react-router";

import "./app.css";
import Header from "./Components/Header";
import BottomNavigation from "./Components/BottomNavigation";
import RecipeAccess from "./Components/Account/RecipeAccess";
import AccountProvider from "./Components/Account/AccountProvider";

export const links = () => [
  { rel: "icon", type: "image/png", sizes: "50x50", href: "/images/cryst-tab-icon.png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;600;700&family=Lilita+One&display=swap",
  },
];

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <AccountProvider><AppContent /></AccountProvider>;
}

function AppContent() {
  // Routes such as sign-in and OOPS opt out of the shared header and navigation.
  const hideNavigation = useMatches().some(match => match.handle?.hideNavigation);
  if (hideNavigation) return <Outlet />;
  // RecipeAccess controls access to page content; navigation remains available.
  return <div className="app-shell">
    <Header />
    <div className="route-content"><RecipeAccess><Outlet /></RecipeAccess></div>
    <BottomNavigation />
  </div>;
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
