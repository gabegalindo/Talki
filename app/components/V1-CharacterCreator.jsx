"use client"; // This component uses client-side state and events

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CharacterCreator.module.css";

const COLORS = [
  { name: "Blue", value: "#3498db" },
  { name: "Green", value: "#2ecc71" },
  { name: "Yellow", value: "#f1c40f" },
  { name: "Purple", value: "#9b59b6" },
  { name: "Sky Blue", value: "#87CEEB" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Orange", value: "#FFA500" },
  { name: "Teal", value: "#9EFCFF" },
  { name: "Red", value: "#FF0000" },
  { name: "White", value: "#FFFFFF" },
];
const TYPES = [
  "Talki 🐰",
  "Moby 🤖",
  "Klaro 🦖",
  "Puffy 🐶",
  "Mewi 🐱",
  "Waddles 🐧",
  "Bambo 🐼",
  "Sparkli 🦄",
  "Bubbli 🐠",
  "Zuzu 🐉",
];
const TRAITS = ["Kind 😊", "Silly 🤪", "Brave 💪"];
const BACKGROUNDS = [
  { name: "Forest", value: "/backgrounds/forest.jpg" },
  { name: "Beach", value: "/backgrounds/beach.jpg" },
  { name: "Space", value: "/backgrounds/space.jpg" },
  { name: "Pastel", value: "/backgrounds/pastel.jpg" },
];

export default function CharacterCreator() {
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [trait, setTrait] = useState("");
  const [background, setBackground] = useState("");
  const router = useRouter();

  const getAnimal = (type) => {
    switch (type?.toLowerCase().split(" ")[0]) {
      case "talki": return "bunny";
      case "moby": return "robot";
      case "klaro": return "dinosaur";
      case "puffy": return "dog";
      case "mewi": return "cat";
      case "waddles": return "penguin";
      case "bambo": return "panda";
      case "sparkli": return "unicorn";
      case "bubbli": return "fish";
      case "zuzu": return "dragon";
      default: return "friend";
    }
  };

  const handleStartChat = async () => {
    if (color && type && trait && background) {
      try {
        console.log("Generating image with:", { color, type, trait, background });
        const response = await fetch("http://10.30.174.24:8000/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            color: color,
            animal: getAnimal(type),
            background: background, // use selected background
            emotion: trait.split(" ")[0].toLowerCase(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Image generation failed with status: ${response.status}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        localStorage.setItem("generatedImage", imageUrl);

        const query = new URLSearchParams({
          color,
          type: type.split(" ")[0],
          trait: trait.split(" ")[0],
          background,
        }).toString();

        router.push(`/chat?${query}`);
      } catch (err) {
        console.error("Image generation failed:", err);
        alert("Failed to generate image. Please try again.");
      }
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
              style={{ backgroundColor: c.value, color: c.value === '#FFFFFF' ? '#000' : '#FFF' }}
              onClick={() => setColor(c.value)}
              aria-pressed={color === c.value}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>2. Choose your character</h2>
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

      <section className={styles.section}>
        <h2 className={styles.title}>4. Choose a background</h2>
        <div className={styles.optionsGrid}>
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.name}
              className={`${styles.optionCard} ${background === bg.value ? styles.selected : ""}`}
              onClick={() => setBackground(bg.value)}
              aria-pressed={background === bg.value}
            >
              {bg.name}
            </button>
          ))}
        </div>
      </section>

      <button
        className={styles.startButton}
        onClick={handleStartChat}
        disabled={!color || !type || !trait || !background}
      >
        Let's Chat!
      </button>
    </div>
  );
}