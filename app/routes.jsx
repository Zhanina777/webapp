import { index, route } from "@react-router/dev/routes";

export default [
  route("sign-in", "routes/sign-in.jsx"),
  route("create-profile", "routes/create-profile.jsx"),
  index("routes/home.jsx"),
  route("help", "routes/help.jsx"),
  route("recipes", "routes/recipes.jsx"),
  route("recipes/:recipeId", "routes/recipe-detail.jsx"),
  route("recipes/:recipeId/grow", "routes/recipe-grow.jsx"),
  route("profile", "routes/profile.jsx"),
  route("payment", "routes/payment.jsx"),
];
