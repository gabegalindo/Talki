"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./ChatInterface.module.css";
import Avatar from "./Avatar";
import { useSearchParams } from "next/navigation";

export default function ChatInterface({ character }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isProcessingSTT, setIsProcessingSTT] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null);
  const searchParams = useSearchParams();
  const characterName = searchParams.get("name") || "Friend";

  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: `Hi! I'm your new ${character.trait} buddy ${character.name}! What should we talk about? 😄`,
        sender: "bot",
      },
    ]);
  }, [character]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
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
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `That's so cool! Tell me more. 🤔`,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);
      // In a real app, you would call TTS here
    }, 1500);
  };

  const handleMicClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        setIsProcessingSTT(true);
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const formData = new FormData();
        formData.append("audio_file", audioBlob, "recording.webm");

        try {
          // Next.js API 라우트를 통해 요청
          const res = await fetch("http://10.30.174.24:8000/api/stt", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
              errorData.error || "음성 인식에 실패했습니다. 다시 시도해주세요."
            );
          }

          const data = await res.json();
          if (data.text && data.text.trim() !== "") {
            const newUserMessage = {
              id: Date.now(),
              text: data.text,
              sender: "user",
              isFromSTT: true,
            };
            setMessages((prev) => [...prev, newUserMessage]);
          } else {
            const errorMessage = {
              id: Date.now(),
              text: "음성을 인식하지 못했습니다. 다시 말씀해주세요.",
              sender: "system",
              isError: true,
            };
            setMessages((prev) => [...prev, errorMessage]);
          }
        } catch (err) {
          console.error("STT error:", err);
          const errorMessage = {
            id: Date.now(),
            text: `오류가 발생했습니다: ${err.message}`,
            sender: "system",
            isError: true,
          };
          setMessages((prev) => [...prev, errorMessage]);
        } finally {
          setIsProcessingSTT(false);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      const errorMessage = {
        id: Date.now(),
        text: `마이크 접근 오류: ${err.message}`,
        sender: "system",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsProcessingSTT(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <header className={styles.chatHeader}>
        <Avatar color={character.color} />
        <div className={styles.characterInfo}>
          <span className={styles.characterName}>{characterName} </span>
          <span className={styles.characterStatus}>Online</span>
        </div>
      </header>

      <div className={styles.messageList}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageBubble} ${
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            } ${msg.isError ? styles.errorMessage : ""}`}
          >
            {msg.text}
            {msg.isFromSTT && <span className={styles.sttBadge}>음성인식</span>}
          </div>
        ))}
        {isProcessingSTT && (
          <div className={`${styles.messageBubble} ${styles.typingIndicator}`}>
            음성 인식 중...
          </div>
        )}
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
                className={`${styles.micMainButton} ${
                  isRecording ? styles.recording : ""
                }`}
                onClick={handleMicClick}
                aria-label={isRecording ? "Stop recording" : "Start talking"}
              >
                {isRecording ? "⏹" : "🎤"}
              </button>

              {isRecording && (
                <span className={styles.recordingIndicator}>Recording...</span>
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
