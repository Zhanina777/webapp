import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("help", "routes/help.jsx"),
  route("recipes", "routes/recipes.jsx"),
  route("recipes/:recipeId", "routes/recipe-detail.jsx"),
  route("recipes/:recipeId/grow", "routes/recipe-grow.jsx"),
  route("profile", "routes/profile.jsx"),
  route("payment", "routes/payment.jsx"),
];
