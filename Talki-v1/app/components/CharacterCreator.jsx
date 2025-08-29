"use client"; // This component uses client-side state and events

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CharacterCreator.module.css";
import Spinner from "./Spinner"; // Import the Spinner component

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

const ANIMALS = [
  { label: "Bunny 🐰", value: "bunny" },
  { label: "Robot 🤖", value: "robot" },
  { label: "Dinosaur 🦖", value: "dinosaur" },
  { label: "Dog 🐶", value: "dog" },
  { label: "Cat 🐱", value: "cat" },
  { label: "Penguin 🐧", value: "penguin" },
  { label: "Panda 🐼", value: "panda" },
  { label: "Unicorn 🦄", value: "unicorn" },
  { label: "Fish 🐠", value: "fish" },
  { label: "Dragon 🐉", value: "dragon" },
];

export default function CharacterCreator() {
  const [color, setColor] = useState("");
  const [animal, setAnimal] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [trait, setTrait] = useState("");
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStartChat = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (color && animal && trait && background && characterName) {
      try {
        const response = await fetch(
          "http://10.30.174.24:8000/api/generate-image",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              color: color,
              animal: animal,
              name: characterName,
              background: background,
              emotion: trait.split(" ")[0].toLowerCase(),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Image generation failed with status: ${response.status}`
          );
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        localStorage.setItem("generatedImage", imageUrl);

        const query = new URLSearchParams({
          color,
          animal,
          name: characterName, // pass the user-inputted name
          trait: trait.split(" ")[0],
          background,
        }).toString();

        router.push(`/chat?${query}`);
      } catch (err) {
        console.error("Image generation failed:", err);
        alert("Failed to generate image. Please try again.");
      } finally {
        setLoading(false);
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
              style={{
                backgroundColor: c.value,
                color: c.value === "#FFFFFF" ? "#000" : "#FFF",
              }}
              onClick={() => setColor(c.value)}
              aria-pressed={color === c.value}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>2. Choose your own character</h2>
        <div className={styles.optionsGrid}>
          {ANIMALS.map((a) => (
            <button
              key={a.value}
              className={`${styles.optionCard} ${
                animal === a.value ? styles.selected : ""
              }`}
              onClick={() => setAnimal(a.value)}
              aria-pressed={animal === a.value}
            >
              {a.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          className={styles.textInput}
          placeholder="Enter your character's name; Ex. Talki"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          style={{
            marginTop: "1rem",
            width: "100%",
            fontSize: "1.2rem",
            padding: "0.75rem",
            border: "2px solid var(--border-color)",
            borderRadius: "50px",
            fontFamily: "var(--font-family-main)",
            boxSizing: "border-box",
          }}
        />
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
              className={`${styles.optionCard} ${
                background === bg.value ? styles.selected : ""
              }`}
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
        disabled={!color || !animal || !trait || !background || !characterName}
      >
        Let's Chat!
      </button>
      {loading && (
        <div className={styles.loadingOverlay}>
          <Spinner />
          <p>Generating your character...</p>
        </div>
      )}
      <style jsx>{`
        .${styles.loadingOverlay} {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
      `}</style>
    </div>
  );
}
