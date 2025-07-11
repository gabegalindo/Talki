import styles from "./Avatar.module.css";

const getEmoji = (type) => {
  switch (type?.toLowerCase().split(" ")[0]) {
    case "talki":
      return "🐰";
    case "moby":
      return "🤖";
    case "klaro":
      return "🦖";
    case "puffy":
      return "🐶";
    case "mewi":
      return "🐱";
    case "waddles":
      return "🐧";
    case "bambo":
      return "🐼";
    case "sparkli":
      return "🦄";
    case "bubbli":
      return "🐠";
    case "zuzu":
      return "🐉";
    default:
      return "😊";
  }
};
export default function Avatar({ color, type }) {
  const emoji = getEmoji(type);

  return (
    <div className={styles.avatar} style={{ backgroundColor: color }}>
      <span className={styles.emoji}>{emoji}</span>
      {/* shows "Talki", "Zuzu", etc. */}
    </div>
  );
}
