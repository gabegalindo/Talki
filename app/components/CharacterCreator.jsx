"use client"; // This component uses client-side state and events

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CharacterCreator.module.css";

const COLORS = [
  { name: "Blue", value: "#3498db" },
  { name: "Green", value: "#2ecc71" },
  { name: "Yellow", value: "#f1c40f" },
  { name: "Purple", value: "#9b59b6" },
];
const TYPES = ["Talki 🐰", "Moby 🤖", "Klaro 🦖"];
const TRAITS = ["Kind 😊", "Silly 🤪", "Brave 💪"];

export default function CharacterCreator() {
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [trait, setTrait] = useState("");
  const router = useRouter();

  const handleStartChat = () => {
    if (color && type && trait) {
      const query = new URLSearchParams({
        color,
        type: type.split(" ")[0], // Send only the word
        trait: trait.split(" ")[0],
      }).toString();
      router.push(`/chat?${query}`);
    }
  };

  return (
    <div className={styles.creator}>
      <section className={styles.section}>
        <h2 className={styles.title}>1. Pick a color</h2>
        <div className={styles.optionsGrid}>
          {COLORS.map((c) => (
            <button
              key={c.name}
              className={`${styles.optionCard} ${
                color === c.value ? styles.selected : ""
              }`}
              style={{ backgroundColor: c.value }}
              onClick={() => setColor(c.value)}
              aria-pressed={color === c.value}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>2. Choose a type</h2>
        <div className={styles.optionsGrid}>
          {TYPES.map((t) => (
            <button
              key={t}
              className={`${styles.optionCard} ${
                type === t ? styles.selected : ""
              }`}
              onClick={() => setType(t)}
              aria-pressed={type === t}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>3. Add a personality</h2>
        <div className={styles.optionsGrid}>
          {TRAITS.map((t) => (
            <button
              key={t}
              className={`${styles.optionCard} ${
                trait === t ? styles.selected : ""
              }`}
              onClick={() => setTrait(t)}
              aria-pressed={trait === t}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <button
        className={styles.startButton}
        onClick={handleStartChat}
        disabled={!color || !type || !trait}
      >
        Let's Chat!
      </button>
    </div>
  );
}
