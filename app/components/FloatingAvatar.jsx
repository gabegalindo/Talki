import { useEffect, useState } from "react";
import styles from "./FloatingAvatar.module.css";

export default function FloatingAvatar({
  character,
  lastSender,
  isBotTyping,
  botMessageMeta,
}) {
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    let timeout;

    if (isBotTyping) {
      setAnimationClass(styles.bounce);
    } else if (lastSender === "bot" && botMessageMeta) {
      // Stop bouncing BEFORE starting shake
      setAnimationClass(""); // <- this is the key line
      // wait one frame before applying shake (allows repaint)
      requestAnimationFrame(() => {
        const duration = Math.max(1000, botMessageMeta.text.length * 25);
        setAnimationClass(styles.shake);
        timeout = setTimeout(() => {
          setAnimationClass("");
        }, duration);
      });
    } else {
      setAnimationClass("");
    }

    return () => clearTimeout(timeout);
  }, [isBotTyping, botMessageMeta?.id]);

  return (
    <img
      src={character}
      alt="Character"
      className={`${styles.floatingAvatar} ${animationClass}`}
    />
  );
}
