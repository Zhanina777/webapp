import { NavLink } from "react-router";
import styles from "./bottomNavigation.module.css";

const items = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/recipes", label: "Recipes", icon: "flask" },
  { to: "/profile", label: "Profile", icon: "user" },
];

export default function BottomNavigation() {
  return (
    <nav className={styles.navigation} aria-label="Main navigation">
      {items.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={styles.link}
        >
          <span
            className={styles.icon}
            style={{ maskImage: `url(/images/${icon}.png)` }}
            aria-hidden="true"
          />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
