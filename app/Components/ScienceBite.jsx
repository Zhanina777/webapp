// A short science fact opened in a native dialog, which handles keyboard focus and Escape.
import { useRef } from "react";
import styles from "./scienceBite.module.css";

export default function ScienceBite() {
  const dialogRef = useRef(null);

  return (
    <>
      <button
        className={styles.card}
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        <span className={styles.caption}>Science Bites</span>
          <span className={`${styles.title} font-heading`}>Why do crystals have flat faces?</span>
        <span className={styles.button}>Find out!</span>
      </button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="science-bite-title"
        aria-describedby="science-bite-fact"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
      >
        <div className={styles.content}>
          <button
            className={styles.close}
            type="button"
            aria-label="Close science bite"
            onClick={() => dialogRef.current?.close()}
            autoFocus
          >
            ×
          </button>
          <p className={styles.label}>A little science sparkle</p>
          <h2 id="science-bite-title" className={styles.heading}>
            Why do crystals have flat faces?
          </h2>
          <p id="science-bite-fact" className={styles.fact}>
            Crystals have flat faces because their tiny building blocks line up in a repeating pattern, like a perfectly stacked wall of LEGO bricks!
          </p>
        </div>
      </dialog>
    </>
  );
}
