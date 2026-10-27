import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("help", "routes/help.tsx"),
  route("recipes", "routes/recipes.jsx"),
  route("recipes/:recipeId", "routes/recipe-detail.jsx"),
  route("recipes/:recipeId/grow", "routes/recipe-grow.jsx"),
  route("profile", "routes/profile.jsx"),
] satisfies RouteConfig;
