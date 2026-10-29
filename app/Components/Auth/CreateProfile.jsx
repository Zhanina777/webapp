import React, { useState } from "react";
import styles from "./createProfile.module.css";
import AdultHelpBtn from "../AdultHelpBtn";
import Header from "../Header";
import { AuthDivider, SocialSignInButton } from "./WelcomePage";

export function ProfileField({ label, children }) {
  return <label className={styles.field}><span>{label}</span>{children}</label>;
}

export function PrivacyNote() {
  return <aside className={styles.privacy}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/></svg><div><strong>Your age stays private</strong><p>It won't appear on your profile.</p></div></aside>;
}

export default function CreateProfile({ onBack, onCreate, onContinueAsGuest, onSocialSignIn, login = false, busy, message, authError, onSwitchMode }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [socialNotice, setSocialNotice] = useState("");
  const [showForm, setShowForm] = useState(login);
  function submit(event) {
    event.preventDefault();
    if (!login && !name.trim()) { setError("Please enter your name or a nickname."); return; }
    setError("");
    onCreate({ name: name.trim(), email: email.trim(), password });
  }
  return <><Header /><main className={styles.page}>
    <div className={styles.content}>
      <nav className={styles.top} aria-label="Profile setup"><button type="button" onClick={showForm ? () => setShowForm(false) : onBack} aria-label={showForm ? "Back to sign-up options" : "Back to recipes"}>&larr;</button></nav>
      <div className={styles.art} aria-hidden="true"><img src="/images/sign-in-crystals.png" alt="" width="110" height="110"/></div>
      <header className={styles.heading}><h1>{login ? "Welcome back" : "Create your profile"}</h1><div>Your next crystal discovery starts here.</div></header>
      {message && <p className={styles.socialNotice} role="status">{message}</p>}
      {authError && <p className={styles.error} role="alert">{authError}</p>}
      {showForm ? <form className={styles.form} onSubmit={submit}>
        <fieldset disabled={busy} className={styles.credentials}>
        {!login && <>
        <ProfileField label="What should we call you?"><input name="name" autoComplete="nickname" placeholder="Your name or nickname" maxLength="40" value={name} onChange={event => setName(event.target.value)} required aria-describedby="name-hint" /></ProfileField>
        <p id="name-hint" className={styles.hint}>A nickname works perfectly. Make it yours!</p>
        <ProfileField label="How old are you?"><select name="age" value={age} onChange={event => setAge(event.target.value)} required><option value="" disabled>Choose your age</option>{Array.from({ length: 15 }, (_, i) => i + 4).map(value => <option key={value} value={value}>{value === 18 ? "18 or older" : `${value} years old`}</option>)}<option value="under-4">Under 4</option></select></ProfileField>
        <PrivacyNote />
        </>}
        <ProfileField label="Email"><input type="email" name="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></ProfileField>
        <ProfileField label="Password"><input type="password" name="password" autoComplete={login ? "current-password" : "new-password"} minLength={login ? undefined : 8} value={password} onChange={event => setPassword(event.target.value)} required /></ProfileField>
        {!login && <AdultHelpBtn message="Use at least 8 characters. Ask a trusted adult for help with your email and password." />}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.submit} type="submit">{busy ? "Please wait…" : login ? "Sign in" : "Create profile"} <span aria-hidden="true">→</span></button>
        </fieldset>
      </form> : <>
      <button className={styles.submit} type="button" onClick={() => { setSocialNotice(""); setShowForm(true); }}>Create a profile <span aria-hidden="true">→</span></button>
      <AuthDivider />
      <div className={styles.providers} aria-label="Social sign-up options">
        {["Google", "Facebook", "Apple"].map(provider => <SocialSignInButton key={provider} provider={provider} onClick={onSocialSignIn || (name => setSocialNotice(`${name} sign-in is not available.`))} />)}
      </div>
      <p className={styles.socialNotice} role="status">{socialNotice}</p>
      <button className={styles.guestButton} type="button" onClick={onContinueAsGuest}>Continue as guest <span aria-hidden="true">→</span></button>
      <p className={styles.guestHint}>Explore home and try Salt String Magic. Create a profile to unlock more recipes.</p>
      </>}
      <button className={styles.modeButton} type="button" disabled={busy} onClick={onSwitchMode}>{login ? "New here? Create a profile" : "Already have an account? Sign in"}</button>
      {(!showForm || login) && <div className={styles.help}><AdultHelpBtn message="Ask a trusted adult to help you set up your profile." /></div>}
      <p className={styles.footnote}>Your adventure starts with a little sparkle.</p>
    </div>
  </main></>;
}
