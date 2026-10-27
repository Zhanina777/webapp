import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import NextStepBtn from "./NextStepBtn";
import PreviousStepBtn from "./PreviousStepBtn";
import StepTracker from "./StepTracker";
import StepContent from "./StepContent";
import buttonStyles from "./StepButtons.module.css";
import styles from "./StepNavigation.module.css";

export default function StepNavigation({ recipeName, recipeId, steps, completionMessage }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const contentRef = useRef(null);
  const stepParam = searchParams.get("step");
  const isComplete = stepParam === "complete";
  // Keep progress in the URL so refresh and the browser back button work.
  const parsedStep = Number(stepParam || 1);
  const currentStep = Number.isInteger(parsedStep) ? Math.min(steps.length, Math.max(1, parsedStep)) : 1;

  useEffect(() => {
    contentRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [stepParam]);

  function goToStep(step) {
    setSearchParams({ step: String(step) });
  }

  return (
    <div className={styles.navigation} ref={contentRef} tabIndex={-1}>
      <StepTracker recipeName={recipeName} currentStep={isComplete ? steps.length : currentStep} totalSteps={steps.length} />
      {isComplete ? <section className={styles.completion}>
        <h1>You did it!</h1>
        <p>{completionMessage || `You completed ${recipeName}. Review your observations and photos to see what you discovered.`}</p>
        <Link to={`/recipes/${recipeId}`}>Back to recipe →</Link>
      </section> : <>
        <StepContent stepNumber={currentStep} step={steps[currentStep - 1]} />
        <div className={styles.buttons}>
          {currentStep < steps.length ? <NextStepBtn nextStep={currentStep + 1} onClick={() => goToStep(currentStep + 1)} /> :
            <button className={buttonStyles.button} type="button" onClick={() => goToStep("complete")}>Finish project <span aria-hidden="true">→</span></button>}
          {currentStep > 1 && <PreviousStepBtn onClick={() => goToStep(currentStep - 1)} />}
        </div>
      </>}
    </div>
  );
}
