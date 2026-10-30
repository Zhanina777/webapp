// Welcome screen and reusable sign-in controls; callbacks decide what each action does.
import React, { useState } from "react";
import styles from "./welcome.module.css";

export function WelcomeHero({ image = `${import.meta.env.BASE_URL}images/recipes/crystal_03-landscape.png` }) {
  return <header className={styles.hero}>
    <img className={styles.photo} src={image} alt="Sparkling clear crystals catching the light against a soft blue background" width="1672" height="941" />
    <h1>Welcome to CRYST</h1>
    <p>Explore the magic of science by growing your own sparkling crystals at home!</p>
  </header>;
}

export function AuthDivider() {
  return <div className={styles.divider}><span />or<span /></div>;
}

function ProviderIcon({ provider }) {
  if (provider === "Google") return <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285f4" d="M44 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11.2a9.6 9.6 0 0 1-4.2 6.3v5.2h6.8C41.8 36.1 44 30.8 44 24.5Z"/><path fill="#34a853" d="M24 45c5.6 0 10.3-1.9 13.8-5.3L31 34.5a12.6 12.6 0 0 1-18.7-6.6H5.2v5.4A21 21 0 0 0 24 45Z"/><path fill="#fbbc05" d="M12.3 27.9a12.7 12.7 0 0 1 0-7.8v-5.4H5.2a21 21 0 0 0 0 18.6Z"/><path fill="#ea4335" d="M24 11.3c3.1 0 5.9 1.1 8.1 3.2l6.1-6.1A20.4 20.4 0 0 0 24 3 21 21 0 0 0 5.2 14.7l7.1 5.4A12.6 12.6 0 0 1 24 11.3Z"/></svg>;
  if (provider === "Facebook") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#1877f2"/><path fill="white" d="M18 32V19h4.4l.7-5H18v-3.2c0-1.4.4-2.4 2.5-2.4h2.7V4a34 34 0 0 0-3.9-.2c-3.9 0-6.5 2.4-6.5 6.7V14H8.4v5h4.4v13Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.1 1c.2 1.5-.5 3-1.4 4-.9 1-2.4 1.7-3.8 1.6-.2-1.5.5-3 1.4-4C14.3 1.5 15.9.8 17.1 1ZM20.8 17.3c-.5 1.2-.8 1.8-1.5 2.9-1 1.4-2.4 3.2-4.1 3.2-1.5 0-1.9-1-4-1s-2.5 1-4 1c-1.7 0-3.1-1.6-4.1-3C.3 16.4-.2 11 1.5 8.4c1.2-1.9 3.2-3 5.1-3 1.8 0 2.9 1 4.4 1s2.4-1 4.4-1c1.6 0 3.4.9 4.6 2.4-4 2.2-3.4 7.8.8 9.5Z"/></svg>;
}

export function SocialSignInButton({ provider, onClick }) {
  return <button className={styles.social} type="button" onClick={() => onClick(provider)}><ProviderIcon provider={provider} /><span>Continue with {provider}</span></button>;
}

/** Supply callbacks to connect this presentation to your authentication service. */
export default function WelcomePage({ onGetStarted, onSignIn, onSocialSignIn, onContinueAsGuest, heroImage }) {
  const [notice, setNotice] = useState("");
  const unavailable = action => setNotice(`${action} is not connected yet. This preview does not create or sign in to an account.`);
  return <main className={styles.page}>
    <div className={styles.content}>
      <WelcomeHero image={heroImage} />
      <button className={styles.start} type="button" onClick={onGetStarted || (() => unavailable("Registration"))}>Get Started <span aria-hidden="true">›</span></button>
      <AuthDivider />
      <div className={styles.providers} aria-label="Social sign-in options">
        {["Google", "Facebook", "Apple"].map(provider => <SocialSignInButton key={provider} provider={provider} onClick={onSocialSignIn || (name => unavailable(`${name} sign-in`))} />)}
      </div>
      <p className={styles.footer}>Already have an account? <button type="button" onClick={onSignIn || (() => unavailable("Sign-in"))}>Sign in</button></p>
      <div className={styles.guest}>
        <p>Browse all crystal recipes and try one full project as a guest. Create an account to start more projects and keep your progress.</p>
        <button type="button" onClick={onContinueAsGuest || (() => unavailable("Guest browsing"))}>Continue as guest <span aria-hidden="true">→</span></button>
      </div>
      <p className={styles.notice} role="status">{notice}</p>
    </div>
  </main>;
}
