"use client"; // This page uses hooks

import CharacterCreator from "./components/CharacterCreator";
import styles from "./page.module.css";
import useBackgroundModal from "./hooks/useBackgroundModal";

export default function HomePage() {
  const { background, openModal, modal } = useBackgroundModal();

  return (
    <div className={styles.homepage}>
      <img src="/TALKI.png" alt="Talki" className={styles.logo} />

      <p>Talki sounds like "talk" in English and "bunny" in Korean</p>
      <p>Just like a friendly bunny</p>
      <p>Talki listens to you and helps you speak with joy.</p>
      <p>
        And Talki has many friends too - dinosaurs, puppies, and many others!
      </p>

      <h1
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "2.5rem",
        }}
      >
        Create Your Buddy!
      </h1>
      <CharacterCreator />
    </div>
  );
}