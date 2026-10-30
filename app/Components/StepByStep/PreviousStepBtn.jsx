// Reuse tutorial button styling while letting the parent handle backward navigation.
import styles from "./StepButtons.module.css";

export default function PreviousStepBtn({ onClick, disabled = false }) {
  return (
    <button
      className={`${styles.button} ${styles.previous}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      <span aria-hidden="true">←</span>
      Previous step
    </button>
  );
}
