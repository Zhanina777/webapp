// Show the upcoming step number; the parent supplies the action that changes steps.
import styles from "./StepButtons.module.css";

export default function NextStepBtn({ nextStep = 2, onClick, disabled = false }) {
  return (
    <button
      className={styles.button}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      Ready for Step {nextStep}
      <span aria-hidden="true">&rarr;</span>
    </button>
  );
}
