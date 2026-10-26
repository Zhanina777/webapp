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
          className={({ isActive }) =>
            `${styles.link}${isActive ? ` ${styles.active}` : ""}`
          }
        >
          <span className={styles.icon} aria-hidden="true">
            <img className={styles.darkIcon} src={`/images/${icon}.png`} alt="" width="56" height="56" />
            <img className={styles.lightIcon} src={`/images/${icon}-light.png`} alt="" width="56" height="56" />
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
