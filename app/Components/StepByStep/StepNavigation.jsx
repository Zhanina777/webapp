import { useEffect, useRef, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";
import { saveCompletion } from "../../supabase-connection/projectProgress";
import { useNavigate, useSearchParams } from "react-router";
import NextStepBtn from "./NextStepBtn";
import PreviousStepBtn from "./PreviousStepBtn";
import StepTracker from "./StepTracker";
import StepContent from "./StepContent";
import buttonStyles from "./StepButtons.module.css";
import styles from "./StepNavigation.module.css";

export default function StepNavigation({ recipeName, recipeId, steps, completionMessage }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const contentRef = useRef(null);
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const stepParam = searchParams.get("step");
  const isComplete = stepParam === "complete";
  const completionDestination = user ? "/recipes" : "/create-profile?reason=project-limit";
  // Keep progress in the URL so refresh and the browser back button work.
  const parsedStep = Number(stepParam || 1);
  const currentStep = Number.isInteger(parsedStep) ? Math.min(steps.length, Math.max(1, parsedStep)) : 1;

  useEffect(() => {
    if (isComplete) return;
    try {
      const finished = JSON.parse(localStorage.getItem("cryst-finished") || "[]");
      if (Array.isArray(finished) && finished.includes(recipeId)) return;
      localStorage.setItem("cryst-progress", recipeId);
      localStorage.setItem(`cryst-step:${recipeId}`, String(currentStep));
    } catch { /* Tutorial navigation remains available without browser storage. */ }
  }, [currentStep, isComplete, recipeId]);

  useEffect(() => {
    contentRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [stepParam]);

  useEffect(() => {
    if (!isComplete) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, [isComplete, recipeId]);

  function closeCompletion() {
    navigate("/recipes", { replace: true });
  }

  async function goToStep(step) {
    if (saving) return;
    if (step === "complete") {
      setSaving(true);
      setSaveError("");
      try { await saveCompletion(user, recipeId, steps.length); }
      catch (problem) {
        setSaveError(`Your project could not be saved. Please try Finish project again. ${problem.message}`);
        setSaving(false);
        return;
      }
      try {
        const stored = JSON.parse(localStorage.getItem("cryst-finished") || "[]");
        const finished = Array.isArray(stored) ? stored : [];
        localStorage.setItem("cryst-finished", JSON.stringify([...new Set([...finished, recipeId])]));
        if (localStorage.getItem("cryst-progress") === recipeId) localStorage.removeItem("cryst-progress");
      } catch { /* Cloud completion was already saved; local profile display can refresh later. */ }
      setSaving(false);
    }
    setSearchParams({ step: String(step) });
  }

  return (
    <div className={styles.navigation} ref={contentRef} tabIndex={-1}>
      <StepTracker recipeName={recipeName} currentStep={isComplete ? steps.length : currentStep} totalSteps={steps.length} />
      {isComplete ? <dialog ref={dialogRef} className={styles.completion} aria-labelledby="completion-title" aria-describedby="completion-message" onCancel={event => { event.preventDefault(); closeCompletion(); }}>
        <button className={styles.close} type="button" aria-label={user ? "Close celebration and view all projects" : "Continue as a guest"} onClick={closeCompletion}>&times;</button>
        <div className={styles.sparkle} aria-hidden="true">&#10023;</div>
        <h1 id="completion-title">You did it!</h1>
        <p id="completion-message">{completionMessage || `You completed ${recipeName}. Review your observations and photos to see what you discovered.`}</p>
        <button className={styles.continue} type="button" onClick={() => navigate(completionDestination, { replace: true })}>{user ? "All projects" : "Create a profile"} <span aria-hidden="true">&rarr;</span></button>
        {!user && <p className={styles.hint}>Create a profile to start more projects, or close this message to continue browsing as a guest.</p>}
      </dialog> : <>
        <StepContent stepNumber={currentStep} step={steps[currentStep - 1]} />
        <div className={styles.buttons}>
          {saveError && <p role="alert">{saveError}</p>}
          {currentStep < steps.length ? <NextStepBtn nextStep={currentStep + 1} onClick={() => goToStep(currentStep + 1)} /> :
            <button className={buttonStyles.button} type="button" disabled={saving || loading} onClick={() => goToStep("complete")}>{saving ? "Saving project…" : "Finish project"} <span aria-hidden="true">&rarr;</span></button>}
          {currentStep > 1 && <PreviousStepBtn onClick={() => goToStep(currentStep - 1)} />}
        </div>
      </>}
    </div>
  );
}
