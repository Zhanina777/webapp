import AdultHelpBtn from "../AdultHelpBtn";
import styles from "./StepContent.module.css";

export default function StepContent({ stepNumber, step }) {
  return (
    <section className={styles.content} aria-label={`Step ${stepNumber}: ${step.title}`}>
      <header aria-live="polite" aria-atomic="true">
        <h2 className={styles.number}>Step {stepNumber}</h2>
        <h3 className={styles.title}>{step.title}</h3>
      </header>

      {step.image && (
        <img className={styles.image} src={step.image} alt={step.imageAlt} />
      )}

      {step.needsAdult && <AdultHelpBtn />}

      <ol className={styles.instructions}>
        {step.instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
    </section>
  );
}
