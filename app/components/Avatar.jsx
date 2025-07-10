import styles from "./Avatar.module.css";

const getEmoji = (type) => {
  switch (type?.toLowerCase()) {
    case "animal":
      return "🐼";
    case "robot":
      return "🤖";
    case "dinosaur":
      return "🦖";
    default:
      return "😊";
  }
};

export default function Avatar({ color, type }) {
  const emoji = getEmoji(type);

  return (
    <div className={styles.avatar} style={{ backgroundColor: color }}>
      <span className={styles.emoji}>{emoji}</span>
    </div>
  );
}
