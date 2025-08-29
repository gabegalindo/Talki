"use client"; // This component uses client-side state and events

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CharacterCreator.module.css";
import Spinner from "./Spinner";

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
  "Bunny 🐰",
  "Robot 🤖",
  "Dinosaur 🦖",
  "Dog 🐶",
  "Cat 🐱",
  "Penguin 🐧",
  "Panda 🐼",
  "Unicorn 🦄",
  "Fish 🐠",
  "Dragon 🐉",
];

const TRAITS = ["Happy 😊", "Sad 😢", "Angry 😠", 'Surprised 😲', 'Curious 😊'];

export default function CharacterCreator() {
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [trait, setTrait] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const getAnimal = (type) => {
    switch (type?.toLowerCase().split(" ")[0]) {
      case "bunny": return "bunny";
      case "robot": return "robot";
      case "dinosaur": return "dinosaur";
      case "dog": return "dog";
      case "cat": return "cat";
      case "penguin": return "penguin";
      case "panda": return "panda";
      case "unicorn": return "unicorn";
      case "fish": return "fish";
      case "dragon": return "dragon";
      default: return "friend";
    }
  };

  const handleStartChat = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (color && type && trait && name.trim()) {
      try {
        console.log("Generating image with:", { color, type, trait, name });
        const response = await fetch("http://localhost:8000/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            color: color,
            animal: getAnimal(type),
            background: "colorful-room",
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
          name: encodeURIComponent(name.trim()) // Add name to URL params
        }).toString();
  
        router.push(`/chat?${query}`);
      } catch (err) {
        console.error("Image generation failed:", err);
        alert("Failed to generate image. Please try again.");
      } 
    }
    setLoading(false);
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
        <h2 className={styles.title}>3. Add a Emotion</h2>
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
        <h2 className={styles.title}>4. Add a Name</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
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

      <button
        className={styles.startButton}
        onClick={handleStartChat}
        disabled={!color || !type || !trait}
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