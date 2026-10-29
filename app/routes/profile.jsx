
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../Components/Auth/AuthProvider";
import styles from "./profile.module.css";
import { projectSections } from "../data/crystalProjects";
import CrystalProjectCard from "../Components/CrystalProjectCard";
import { saveCompletion } from "../supabase-connection/projectProgress";

export function meta() {
  return [{ title: "Profile | Cryst" }];
}

const allRecipes = projectSections.flatMap(
  (section) => section.recipes
);

const PROFILE_COLORS = [
  { name: "Purple", value: "#B377E4" },
  { name: "Mint", value: "#85D5C8" },
  { name: "Yellow", value: "#FFEE46" },
  { name: "Black", value: "#1A1A1A" },
];

const SCIENCE_EMOJIS = [
  "🧪",
  "🔬",
  "🧬",
  "💎",
  "🧫",
  "⚗️",
  "🪨",
  "🌱",
  "🌙",
  "🪐",
  "⭐",
  "🦠",
];

export default function Profile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const photoInputRef = useRef(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("collection");

  const [savedIds, setSavedIds] = useState([]);
  const [finishedIds, setFinishedIds] = useState([]);
  const [progressId, setProgressId] = useState(null);

  const [bannerColor, setBannerColor] = useState("#B377E4");
  const [avatarEmoji, setAvatarEmoji] = useState("🧪");
  const [avatarPhoto, setAvatarPhoto] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Load the user's saved profile and recipe data.
  useEffect(() => {
    try {
      setSavedIds(
        JSON.parse(localStorage.getItem("cryst-saved") || "[]")
      );

      setFinishedIds(
        JSON.parse(localStorage.getItem("cryst-finished") || "[]")
      );

      setProgressId(
        localStorage.getItem("cryst-progress")
      );

      setBannerColor(
        localStorage.getItem("cryst-profile-color") || "#B377E4"
      );

      setAvatarEmoji(
        localStorage.getItem("cryst-profile-emoji") || "🧪"
      );

      setAvatarPhoto(
        localStorage.getItem("cryst-profile-photo") || ""
      );
    } catch {
      setError("Could not load your saved profile.");
    }
  }, []);

  // Save the selected banner color.
  function handleColorChange(color) {
    setBannerColor(color);

    try {
      localStorage.setItem("cryst-profile-color", color);
    } catch {
      setError("Could not save your selected color.");
    }
  }

  // Upload a profile picture.
  function handlePhotoUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    // Keep the image small enough for browser storage.
    if (file.size > 2 * 1024 * 1024) {
      setError("Please choose an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      try {
        localStorage.setItem("cryst-profile-photo", imageData);
        localStorage.removeItem("cryst-profile-emoji");

        setAvatarPhoto(imageData);
        setAvatarEmoji("");
        setShowEmojiPicker(false);
      } catch {
        setError(
          "Could not save this photo. Try a smaller image."
        );
      }
    };

    reader.onerror = () => {
      setError("Could not read this photo. Please try again.");
    };

    reader.readAsDataURL(file);

    // Allows selecting the same photo again.
    event.target.value = "";
  }

  // Choose a science emoji as the profile avatar.
  function handleEmojiChange(emoji) {
    try {
      localStorage.setItem("cryst-profile-emoji", emoji);
      localStorage.removeItem("cryst-profile-photo");

      setAvatarEmoji(emoji);
      setAvatarPhoto("");
      setShowEmojiPicker(false);
      setError("");
    } catch {
      setError("Could not save your selected emoji.");
    }
  }

  // Remove a saved recipe.
  function removeSaved(id) {
    const updated = savedIds.filter(
      (savedId) => savedId !== id
    );

    try {
      localStorage.setItem(
        "cryst-saved",
        JSON.stringify(updated)
      );

      setSavedIds(updated);
    } catch {
      setError(
        "Could not remove this saved recipe. Please allow browser storage and try again."
      );
    }
  }

  // Mark the current recipe as finished.
  async function finishGrowing(id) {
    try {
      await saveCompletion(
        user,
        id,
        allRecipes.find((recipe) => recipe.id === id)?.steps?.length || 1
      );

      const updated = [
        ...new Set([...finishedIds, id]),
      ];

      localStorage.setItem(
        "cryst-finished",
        JSON.stringify(updated)
      );

      localStorage.removeItem("cryst-progress");

      setFinishedIds(updated);
      setProgressId(null);
    } catch (problem) {
      setError(problem.message);
    }
  }

  // Sign out.
  async function handleSignOut() {
    setBusy(true);
    setError("");

    try {
      await signOut();
      navigate("/");
    } catch (problem) {
      setError(problem.message);
      setBusy(false);
    }
  }

  // Find the recipe currently in progress.
  const currentRecipe = allRecipes.find(
    (recipe) => recipe.id === progressId
  );

  // Find completed and saved recipes.
  const finishedRecipes = allRecipes.filter(
    (recipe) => finishedIds.includes(recipe.id)
  );

  const savedRecipes = allRecipes.filter(
    (recipe) => savedIds.includes(recipe.id)
  );

  // Reusable recipe card.
  function RecipeCard({ recipe, children }) {
    return (
      <article className="crystal-card">
        <Link to={`/recipes/${recipe.id}`}>
          <img
            src={recipe.image}
            alt={recipe.imageAlt}
            className="crystal-image"
          />

          <h3>{recipe.name}</h3>
        </Link>

        <p>
          {recipe.difficulty} · {recipe.time}
        </p>

        {children}
      </article>
    );
  }

  return (
    <main className={`page-content profile-page ${styles.profilePage}`}>

      {/* Profile banner and avatar */}
      <section className={styles.profileHero}>
        <div
          className={styles.profileBanner}
          style={{ backgroundColor: bannerColor }}
        />

        <div className={styles.profileAvatarWrapper}>
          <div className={styles.profileAvatar}>
            {avatarPhoto ? (
              <img
                src={avatarPhoto}
                alt="Your profile"
                className={styles.avatarPhoto}
              />
            ) : (
              <span className={styles.avatarEmoji}>
                {avatarEmoji || "🧪"}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Profile details */}
      <section className={styles.profileDetails}>
        <div className={styles.profileNameRow}>
          <div>
            <h1>
              {profile?.display_name || "Crystal Explorer"}
            </h1>

            <p className={styles.profileDescription}>
              Growing crystals, one experiment at a time
            </p>
          </div>

          {user && (
            <button
              className={styles.signOut}
              type="button"
              disabled={busy}
              onClick={handleSignOut}
            >
              {busy ? "Signing out…" : "Sign out"}
            </button>
          )}
        </div>

        {/* Color picker */}
        <div className={styles.profileCustomization}>
          <h2>Profile color</h2>

          <div className={styles.colorOptions}>
            {PROFILE_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                className={`${styles.colorOption} ${
                  bannerColor === color.value
                    ? styles.selectedColor
                    : ""
                }`}
                style={{ backgroundColor: color.value }}
                aria-label={`Choose ${color.name} profile color`}
                aria-pressed={bannerColor === color.value}
                title={color.name}
                onClick={() => handleColorChange(color.value)}
              />
            ))}
          </div>
        </div>

        {/* Photo and emoji options */}
        <div className={styles.avatarActions}>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className={styles.photoInput}
            onChange={handlePhotoUpload}
          />

          <button
            type="button"
            className={styles.customizeButton}
            onClick={() => photoInputRef.current?.click()}
          >
            Upload photo
          </button>

          <button
            type="button"
            className={styles.customizeButton}
            onClick={() =>
              setShowEmojiPicker((visible) => !visible)
            }
          >
            Choose science emoji
          </button>
        </div>

        {/* Science emoji picker */}
        {showEmojiPicker && (
          <div className={styles.emojiPicker}>
            <p>Choose your profile emoji</p>

            <div className={styles.emojiOptions}>
              {SCIENCE_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`${styles.emojiOption} ${
                    avatarEmoji === emoji && !avatarPhoto
                      ? styles.selectedEmoji
                      : ""
                  }`}
                  onClick={() => handleEmojiChange(emoji)}
                  aria-label={`Choose ${emoji} as your profile emoji`}
                  aria-pressed={avatarEmoji === emoji && !avatarPhoto}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {error && (
        <p className={styles.profileError} role="alert">
          {error}
        </p>
      )}

      {/* Profile tabs */}
      <section className="profile-tabs">
        <button
          className={activeTab === "collection" ? "active" : ""}
          onClick={() => setActiveTab("collection")}
        >
          My collection
        </button>

        <button
          className={activeTab === "saved" ? "active" : ""}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
      </section>

      {/* Collection */}
      {activeTab === "collection" && (
        <>
          <section className="profile-section">
            <h2>In progress</h2>

            {currentRecipe ? (
              <article className="progress-card">
                <Link to={`/recipes/${currentRecipe.id}`}>
                  <img
                    src={currentRecipe.image}
                    alt={currentRecipe.imageAlt}
                    className="crystal-image"
                  />
                </Link>

                <h3>{currentRecipe.name}</h3>
                <p>{currentRecipe.time}</p>
                <p>Currently growing</p>

                <Link to={`/recipes/${currentRecipe.id}`}>
                  Continue recipe
                </Link>

                <button
                  onClick={() => finishGrowing(currentRecipe.id)}
                >
                  Mark as finished
                </button>
              </article>
            ) : (
              <p>
                No crystal growing right now. Choose a recipe
                from Saved to get started!
              </p>
            )}
          </section>

          <section className="profile-section">
            <h2>Finished</h2>

            {finishedRecipes.length > 0 ? (
              <div className="crystal-grid">
                {finishedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                  />
                ))}
              </div>
            ) : (
              <p>Your finished crystals will appear here.</p>
            )}
          </section>
        </>
      )}

      {/* Saved recipes */}
      {activeTab === "saved" && (
        <section className="profile-section">
          <h2>Saved recipes</h2>

          {savedRecipes.length > 0 ? (
            <div className={styles.savedCards}>
              {savedRecipes.map((recipe) => (
                <CrystalProjectCard
                  key={recipe.id}
                  title={recipe.name}
                  image={recipe.image}
                  imageAlt={recipe.imageAlt}
                  description={
                    recipe.isPlaceholder
                      ? "Coming soon"
                      : `${recipe.time} · ${recipe.price}`
                  }
                  to={`/recipes/${recipe.id}`}
                  saved
                  onToggleSave={() => removeSaved(recipe.id)}
                />
              ))}
            </div>
          ) : (
            <p>
              You haven't saved any recipes yet.
              Visit the Recipes page to find one!
            </p>
          )}
        </section>
      )}
    </main>
  );
}
