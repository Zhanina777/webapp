// Display one sample post. Likes are local UI state and reset when this component unmounts.
import { useState } from "react";
import styles from "./friendsFeed.module.css";

export default function FriendPost({ post }) {
  const [liked, setLiked] = useState(false);

  return (
    <article className={styles.post} aria-label={`Post by ${post.name}`}>
      <header className={styles.author}>
        <span className={styles.avatar} aria-hidden="true">{post.name[0]}</span>
        <p>{post.name} <span aria-hidden="true">·</span> <span className={styles.time}>{post.time}</span></p>
      </header>
      <img className={styles.image} src={post.image} alt={post.imageAlt} loading="lazy" />
      <p className={styles.caption}>{post.text}</p>
      <button
        className={styles.like}
        type="button"
        aria-pressed={liked}
        aria-label={`${liked ? "Unlike" : "Like"} ${post.name}'s post`}
        onClick={() => setLiked(!liked)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <span>{post.likes + (liked ? 1 : 0)} curious minds</span>
      </button>
    </article>
  );
}
