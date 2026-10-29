import { Link } from "react-router";
import styles from "./continueGrowingBtn.module.css";

export default function ContinueGrowingBtn({ recipeId, step = 1 }) {
  return (
    <Link className={styles.button} to={`/recipes/${recipeId}/grow?step=${step}`}>
      Continue growing
    </Link>
  );
}
