
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
  const [isEditing, setIsEditing] = useState(false);
  const [draftBannerColor, setDraftBannerColor] = useState("#B377E4");
  const [draftAvatarEmoji, setDraftAvatarEmoji] = useState("🧪");
  const [draftAvatarPhoto, setDraftAvatarPhoto] = useState("");

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

      setDraftBannerColor(
        localStorage.getItem("cryst-profile-color") || "#B377E4"
      );
      setDraftAvatarEmoji(
        localStorage.getItem("cryst-profile-emoji") || "🧪"
      );
      setDraftAvatarPhoto(
        localStorage.getItem("cryst-profile-photo") || ""
      );
    } catch {
      setError("Could not load your saved profile.");
    }
  }, []);

  // Save the selected banner color.
  function handleColorChange(color) {
    setDraftBannerColor(color);
  }

  function beginEditing() {
    setDraftBannerColor(bannerColor);
    setDraftAvatarEmoji(avatarEmoji || "🧪");
    setDraftAvatarPhoto(avatarPhoto);
    setShowEmojiPicker(false);
    setError("");
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraftBannerColor(bannerColor);
    setDraftAvatarEmoji(avatarEmoji || "🧪");
    setDraftAvatarPhoto(avatarPhoto);
    setShowEmojiPicker(false);
    setError("");
    setIsEditing(false);
  }

  function saveProfileEdits() {
    try {
      localStorage.setItem("cryst-profile-color", draftBannerColor);

      if (draftAvatarPhoto) {
        localStorage.setItem("cryst-profile-photo", draftAvatarPhoto);
        localStorage.removeItem("cryst-profile-emoji");
      } else {
        localStorage.setItem("cryst-profile-emoji", draftAvatarEmoji || "🧪");
        localStorage.removeItem("cryst-profile-photo");
      }

      setBannerColor(draftBannerColor);
      setAvatarEmoji(draftAvatarPhoto ? "" : (draftAvatarEmoji || "🧪"));
      setAvatarPhoto(draftAvatarPhoto);
      setShowEmojiPicker(false);
      setIsEditing(false);
      setError("");
    } catch {
      setError("Could not save your profile changes. Try a smaller photo.");
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
        setDraftAvatarPhoto(imageData);
        setDraftAvatarEmoji("");
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
      setDraftAvatarEmoji(emoji);
      setDraftAvatarPhoto("");
      setShowEmojiPicker(false);
      setError("");
    } catch {
      setError("Could not save your selected emoji.");
    }
  }

  // Toggle whether a recipe is saved.
  function toggleSaved(id) {
    const updated = savedIds.includes(id)
      ? savedIds.filter((savedId) => savedId !== id)
      : [...savedIds, id];

    try {
      localStorage.setItem(
        "cryst-saved",
        JSON.stringify(updated)
      );

      setSavedIds(updated);
    } catch {
      setError(
        "Could not update saved recipes. Please allow browser storage and try again."
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

  return (
    <main className={`page-content profile-page ${styles.profilePage}`}>

      {/* Profile banner and avatar */}
      <section className={styles.profileHero}>
        <div
          className={styles.profileBanner}
          style={{ backgroundColor: isEditing ? draftBannerColor : bannerColor }}
        />

        <div className={styles.profileAvatarWrapper}>
          <div className={styles.profileAvatar}>
            {(isEditing ? draftAvatarPhoto : avatarPhoto) ? (
              <img
                src={isEditing ? draftAvatarPhoto : avatarPhoto}
                alt="Your profile"
                className={styles.avatarPhoto}
              />
            ) : (
              <span className={styles.avatarEmoji}>
                {(isEditing ? draftAvatarEmoji : avatarEmoji) || "🧪"}
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

          <div className={styles.profileHeaderActions}>
            {isEditing ? (
              <>
                <button type="button" className={styles.customizeButton} onClick={saveProfileEdits}>
                  Save
                </button>
                <button type="button" className={styles.customizeButton} onClick={cancelEditing}>
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" className={styles.customizeButton} onClick={beginEditing}>
                Edit
              </button>
            )}

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
        </div>

        {/* Color picker */}
        {isEditing && <div className={styles.profileCustomization}>
          <h2>Profile color</h2>

          <div className={styles.colorOptions}>
            {PROFILE_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                className={`${styles.colorOption} ${
                  draftBannerColor === color.value
                    ? styles.selectedColor
                    : ""
                }`}
                style={{ backgroundColor: color.value }}
                aria-label={`Choose ${color.name} profile color`}
                aria-pressed={draftBannerColor === color.value}
                title={color.name}
                onClick={() => handleColorChange(color.value)}
              />
            ))}
          </div>
        </div>}

        {/* Photo and emoji options */}
        {isEditing && <div className={styles.avatarActions}>
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
        </div>}

        {/* Science emoji picker */}
        {isEditing && showEmojiPicker && (
          <div className={styles.emojiPicker}>
            <p>Choose your profile emoji</p>

            <div className={styles.emojiOptions}>
              {SCIENCE_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`${styles.emojiOption} ${
                    draftAvatarEmoji === emoji && !draftAvatarPhoto
                      ? styles.selectedEmoji
                      : ""
                  }`}
                  onClick={() => handleEmojiChange(emoji)}
                  aria-label={`Choose ${emoji} as your profile emoji`}
                  aria-pressed={draftAvatarEmoji === emoji && !draftAvatarPhoto}
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
              <div className={styles.projectCards}>
                {finishedRecipes.map((recipe) => (
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
                    saved={savedIds.includes(recipe.id)}
                    onToggleSave={() => toggleSaved(recipe.id)}
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
            <div className={styles.projectCards}>
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
                  onToggleSave={() => toggleSaved(recipe.id)}
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
