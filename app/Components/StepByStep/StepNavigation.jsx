import { useState } from "react";
import NextStepBtn from "./NextStepBtn";
import PreviousStepBtn from "./PreviousStepBtn";
import StepTracker from "./StepTracker";
import StepContent from "./StepContent";
import styles from "./StepNavigation.module.css";

export default function StepNavigation({
  recipeName = "Alum sparkle",
  steps,
  totalSteps = steps ? steps.length : 4,
}) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className={styles.navigation}>
      <StepTracker
        recipeName={recipeName}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
      {steps && (
        <StepContent stepNumber={currentStep} step={steps[currentStep - 1]} />
      )}
      <div className={styles.buttons}>
        <PreviousStepBtn
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(currentStep - 1)}
        />
        {currentStep < totalSteps && (
          <NextStepBtn
            nextStep={currentStep + 1}
            onClick={() => setCurrentStep(currentStep + 1)}
          />
        )}
      </div>
    </div>
  );
}
