// Sample community content for the home page; these posts are not loaded from Supabase.
import FriendPost from "./FriendPost";
import styles from "./friendsFeed.module.css";

const posts = [
  {
    id: 1,
    name: "Mika",
    time: "2 hours ago",
    image: "images/friend-mika-crystals.png",
    imageAlt: "Sharp-edged blue crystals with a tiny new crystal in the foreground",
    text: "Day 7: look at those edges! I spotted a tiny new crystal today.",
    likes: 24,
  },
  {
    id: 2,
    name: "Jordan",
    time: "5 hours ago",
    image: "images/friend-jordan-crystals.png",
    imageAlt: "Large teal green crystals beside a wooden ruler for scale",
    text: "The crystals are getting bigger! Can't wait to compare them after the weekend.",
    likes: 18,
  },
  {
    id: 3,
    name: "Priya",
    time: "Yesterday",
    image: "images/friend-priya-crystals.png",
    imageAlt: "Violet crystals growing in a glass jar of pale lavender solution",
    text: "Added a little more solution to my jar today. Science club experiment update coming soon!",
    likes: 31,
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
