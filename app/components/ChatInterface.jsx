"use client";

import { useState, useEffect, useRef } from "react";
import MP3MediaRecorder from "mp3-mediarecorder";
import styles from "./ChatInterface.module.css";
import Avatar from "./Avatar";

export default function ChatInterface({ character }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [listening, setListening] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingChunks, setRecordingChunks] = useState([]);
  const chatEndRef = useRef(null);
  const [audioStream, setAudioStream] = useState(null);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: `Hi! I'm your new ${character.trait} ${character.type} buddy! What should we talk about? 😄`,
        sender: "bot",
      },
    ]);
  }, [character]);

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

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `That's so cool! Tell me more. 🤔`,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1500);
  };
  const handleMicClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream); // ✅ Save this for stopping later

      const chunks = [];

      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });

        const formData = new FormData();
        formData.append("file", blob, "recording.webm");

        await fetch("/api/upload-audio", {
          method: "POST",
          body: formData,
        });

        setMediaRecorder(null);
        setListening(false);

        // ✅ Stop all tracks on the stream (frees the mic)
        stream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setListening(true);
    } catch (err) {
      console.error("Mic error:", err);
      alert(`Microphone error: ${err.message}`);
    }
  };

  const handleStop = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop(); // triggers onstop where cleanup happens
    }

    // Optional fallback: stop stream directly
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }
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

      <form onSubmit={handleSendMessage} className={styles.inputArea}>
        {showKeyboard ? (
          <>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className={styles.textInput}
            />
            <button type="submit" className={styles.sendButton}>
              Send
            </button>
            <button
              type="button"
              className={styles.micSmallButton}
              onClick={() => setShowKeyboard(false)}
              aria-label="Switch back to mic"
            >
              🎤
            </button>
          </>
        ) : (
          <div className={styles.micContainer}>
            <div className={styles.micGroup}>
              <button
                type="button"
                className={styles.micMainButton}
                onClick={handleMicClick}
                aria-label="Start talking"
              >
                🎤
              </button>

              {listening && (
                <button
                  type="button"
                  className={styles.stopButton}
                  onClick={handleStop}
                  aria-label="Stop recording"
                >
                  ⏹ Stop
                </button>
              )}
            </div>

            <button
              type="button"
              className={styles.keyboardButton}
              onClick={() => setShowKeyboard(true)}
              aria-label="Use keyboard"
            >
              ⌨️
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
