import FriendPost from "./FriendPost";
import styles from "./friendsFeed.module.css";

const posts = [
  {
    id: 1,
    name: "Mika",
    time: "2 hours ago",
    image: "/images/alum-crystals.svg",
    imageAlt: "A cluster of clear crystals",
    text: "Day 7: look at those edges! I spotted a tiny new crystal today.",
    likes: 24,
  },
];

export default function FriendsFeed() {
  return (
    <section className={styles.feed} aria-labelledby="friends-feed-title">
      <h2 id="friends-feed-title" className={styles.title}>From the science club</h2>
      <div className={styles.posts}>
        {posts.map((post) => <FriendPost key={post.id} post={post} />)}
      </div>
    </section>
  );
}
