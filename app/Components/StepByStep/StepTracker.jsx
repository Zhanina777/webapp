import styles from "./StepTracker.module.css";

export default function StepTracker({ recipeName, currentStep, totalSteps }) {
  return (
    <div className={styles.tracker}>
      <div
        className={styles.segments}
        role="progressbar"
        aria-label={`${recipeName} recipe progress`}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
        aria-valuetext={`Step ${currentStep} of ${totalSteps}`}
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <span
            key={index}
            className={`${styles.segment} ${index < currentStep ? styles.reached : ""}`}
          />
        ))}
      </div>
      <div className={styles.labels}>
        <span className={styles.name}>Tracker · {recipeName}</span>
        <span aria-live="polite" aria-atomic="true">{currentStep} of {totalSteps}</span>
      </div>
    </div>
  );
}
