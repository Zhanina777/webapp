// Coordinate tutorial steps, saved progress and the completion dialog in one place.
import { useEffect, useRef, useState } from "react";
import { useAccount } from "../Account/AccountProvider";
import { getProjectProgress, saveProjectStep, saveCompletion } from "../../supabase-connection/projectProgress";
import { useNavigate, useSearchParams } from "react-router";
import NextStepBtn from "./NextStepBtn";
import PreviousStepBtn from "./PreviousStepBtn";
import StepTracker from "./StepTracker";
import StepContent from "./StepContent";
import buttonStyles from "./StepButtons.module.css";
import styles from "./StepNavigation.module.css";
import { markRecipeFinished } from "../../guests/recipeStorage";

export default function StepNavigation({ recipeName, recipeId, steps, completionMessage }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const contentRef = useRef(null);
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading } = useAccount();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [readyAccount, setReadyAccount] = useState(null);
  const [resumeStep, setResumeStep] = useState(1);
  const [retry, setRetry] = useState(0);
  const writes = useRef(Promise.resolve());
  const accountKey = user?.id || "guest";
  const stepParam = searchParams.get("step");
  const isComplete = stepParam === "complete";
  const completionDestination = user ? "/recipes" : "/create-profile?reason=project-limit";
  // Keep progress in the URL so refresh and the browser back button work.
  const parsedStep = Number(stepParam || resumeStep);
  const currentStep = Number.isInteger(parsedStep) ? Math.min(steps.length, Math.max(1, parsedStep)) : 1;

  // Restore saved progress before enabling writes to avoid overwriting it with step 1.
  useEffect(() => {
    if (loading) return;
    let active = true;
    setReadyAccount(null);
    setSaveError("");
    async function restore() {
      try {
        const records = await getProjectProgress(user);
        if (!active) return;
        const saved = records.find(row => row.recipe_id === recipeId);
        setResumeStep(saved ? Math.min(saved.current_step, steps.length) : 1);
        if (!stepParam && saved) {
          setSearchParams({ step: String(Math.min(saved.current_step, steps.length)) }, { replace: true });
        }
        setReadyAccount(accountKey);
      } catch (problem) {
        if (active) setSaveError(`Your progress could not be loaded. ${problem.message}`);
      }
    }
    restore();
    return () => { active = false; };
    // URL changes navigate the tutorial; only account changes restore cloud state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, accountKey, recipeId, retry]);

  useEffect(() => {
    if (loading || readyAccount !== accountKey || isComplete) return;
    let active = true;
    setSaving(true);
    // Save steps in navigation order so an older request cannot overwrite a newer step.
    const pending = writes.current.catch(() => {}).then(() => saveProjectStep(user, recipeId, currentStep));
    writes.current = pending;
    pending.then(() => { if (active) setSaveError(""); })
      .catch(problem => { if (active) setSaveError(`Your progress could not be saved. ${problem.message}`); })
      .finally(() => { if (active) setSaving(false); });
    return () => { active = false; };
  }, [currentStep, isComplete, recipeId, readyAccount, accountKey, loading]);

  // Announce the new step from its heading and return the viewport to the top.
  useEffect(() => {
    contentRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [stepParam]);

  // Celebration stays open until the user chooses an action; there is no timer.
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
    if (saving || loading || readyAccount !== accountKey) return;
    if (step === "complete") {
      setSaving(true);
      setSaveError("");
      // Wait for pending step saves and confirmed completion before showing success.
      try { await writes.current; await saveCompletion(user, recipeId, steps.length); }
      catch (problem) {
        setSaveError(`Your project could not be saved. Please try Finish project again. ${problem.message}`);
        setSaving(false);
        return;
      }
      try {
        if (!user) markRecipeFinished(recipeId);
      } catch { /* Cloud completion was already saved; local profile display can refresh later. */ }
      setSaving(false);
    }
    setSearchParams({ step: String(step) });
  }

  if (!isComplete && (loading || readyAccount !== accountKey)) {
    return <div className={styles.navigation}>
      {saveError ? <p role="alert">{saveError} <button type="button" onClick={() => setRetry(value => value + 1)}>Retry sync</button></p>
        : <p role="status">Loading your saved progress…</p>}
    </div>;
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
          {saveError && <p role="alert">{saveError} <button type="button" onClick={() => setRetry(value => value + 1)}>Retry sync</button></p>}
          {saving && <p role="status">Saving progress…</p>}
          {currentStep < steps.length ? <NextStepBtn disabled={saving || loading || readyAccount !== accountKey} nextStep={currentStep + 1} onClick={() => goToStep(currentStep + 1)} /> :
            <button className={buttonStyles.button} type="button" disabled={saving || loading || readyAccount !== accountKey} onClick={() => goToStep("complete")}>{saving ? "Saving project…" : "Finish project"} <span aria-hidden="true">&rarr;</span></button>}
          {currentStep > 1 && <PreviousStepBtn disabled={saving || loading || readyAccount !== accountKey} onClick={() => goToStep(currentStep - 1)} />}
        </div>
      </>}
    </div>
  );
}
