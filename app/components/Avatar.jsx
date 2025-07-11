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
export default function Avatar({ color }) {
  // const emoji = getEmoji(type);
  const imageUrl = localStorage.getItem("generatedImage");

  return (
    <div className={styles.avatar} style={{ backgroundColor: color }}>
      {/* <span className={styles.emoji}>{emoji}</span> */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated Character"
          style={{
            width: "3rem",
            borderRadius: "50%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            background: "#fff",
          }}
        />
      )}
      {/* shows "Talki", "Zuzu", etc. */}
    </div>
  );
}
