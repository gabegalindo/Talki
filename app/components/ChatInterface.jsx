"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./ChatInterface.module.css";
import Avatar from "./Avatar";

// Placeholder for mic icon
const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z" />
  </svg>
);

export default function ChatInterface({ character }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const chatEndRef = useRef(null);

  // Initial greeting from the bot
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: `Hi! I'm your new ${character.trait} ${character.type} buddy! What should we talk about? 😄`,
        sender: "bot",
      },
    ]);
  }, [character]);

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      text: userInput,
      sender: "user",
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");

    // --- AI Response Simulation ---
    // In a real app, you'd call your AI API here.
    // The text-to-speech would be triggered after receiving the API response.
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `That's so cool! Tell me more. 🤔`,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
      // **TTS HOOK**: Call text-to-speech here with \`botResponse.text\`
      // For example: \`speak(botResponse.text)\`
    }, 1500);
  };

  const handleMicClick = () => {
    // **VOICE-TO-TEXT HOOK**:
    // 1. Start listening for voice input.
    // 2. When speech is recognized, update the input field:
    //    \`setUserInput(recognizedText);\`
    alert("Microphone clicked! Voice-to-text logic would go here.");
  };

  return (
    <div className={styles.chatContainer}>
      <header className={styles.chatHeader}>
        <Avatar color={character.color} type={character.type} />
        <div className={styles.characterInfo}>
          <span className={styles.characterName}>{character.type} Buddy</span>
          <span className={styles.characterStatus}>Online</span>
        </div>
      </header>

      <div className={styles.messageList}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageBubble} ${
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form className={styles.inputArea} onSubmit={handleSendMessage}>
        <button
          type="button"
          className={styles.micButton}
          onClick={handleMicClick}
          aria-label="Use microphone"
        >
          <MicIcon />
        </button>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
          className={styles.textInput}
        />
        <button type="submit" className={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
}
