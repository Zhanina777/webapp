import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthProvider";
import { guestCompleted, guestAccountDestination } from "../../supabase-connection/projectProgress";

// Recipe browsing stays public. Only project instructions and profiles are gated.
export default function RecipeAccess({ children }) {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [guestState, setGuestState] = useState(null);
  useEffect(() => {
    const update = () => setGuestState({ key: location.key, completed: guestCompleted() });
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, [location.key]);

  const isProfile = location.pathname.replace(/\/$/, "") === "/profile";
  const isGrow = /^\/recipes\/[^/]+\/grow\/?$/.test(location.pathname);
  if (!isProfile && !isGrow) return children;
  if (loading || guestState?.key !== location.key) return <main className="page-content"><p role="status">Loading your account...</p></main>;
  if (user) return children;
  const destination = guestAccountDestination(location.pathname, location.search, guestState.completed);
  if (destination) return <Navigate to={destination} replace />;
  return children;
}
