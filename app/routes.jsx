import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("help", "routes/help.jsx"),
  route("recipes", "routes/recipes.jsx"),
  route("profile", "routes/profile.jsx"),
];
