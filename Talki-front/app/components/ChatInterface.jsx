// ChatInterface.jsx

"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./ChatInterface.module.css";
import Avatar from "./Avatar";

export default function ChatInterface({ character, onSpeakingChange }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // STT -> TTS 전체 과정을 처리하는 상태
  const [typingText, setTypingText] = useState(''); // 타이핑 중인 텍스트
  const [typingMessageId, setTypingMessageId] = useState(null); // 타이핑 중인 메시지 ID
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null);
  const audioRef = useRef(null);

  // 초기 메시지 설정
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: `Hi! I'm your new ${character.trait} buddy ${character.type}! What should we talk about? 😄`,
        sender: "bot",
      },
    ]);
  }, [character]);

  // 메시지 목록이 업데이트될 때마다 맨 아래로 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest"});
  }, [messages]);

  // 음성 재생 상태를 관리하는 ref
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => onSpeakingChange?.(true);
    const handlePause = () => onSpeakingChange?.(false);
    const handleEnded = () => onSpeakingChange?.(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onSpeakingChange]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 키보드 입력 처리
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
    // TODO: 키보드 입력도 대화형 API와 연동하는 로직 추가 필요
  };

  // 음성 재생 함수
  const playAudio = (audioUrl) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    audioRef.current.src = audioUrl;
    audioRef.current.play().catch(e => console.error("Audio play error:", e));
  };

  // 음성 입력 및 AI 대화 처리
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

      // 녹음이 중지되면 실행될 로직
      recorder.onstop = async () => {
        setIsProcessing(true); // 전체 처리 시작을 알림
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio_file", audioBlob, "recording.webm");

        try {
          const res = await fetch("http://localhost:8000/api/conversation", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "대화 처리 중 오류가 발생했습니다.");
          }

          const data = await res.json();
          // data = { user_text, response_text, response_audio_url }

          // 사용자 메시지를 채팅창에 추가
          const newUserMessage = {
            id: Date.now(),
            text: data.user_text,
            sender: "user",
            isFromSTT: true
          };

          // AI 응답 메시지 준비 (텍스트는 비워두고 나중에 채움)
          const botResponse = {
            id: Date.now() + 1,
            text: '',
            sender: "bot",
            isTyping: true
          };
          
          // AI 응답 메시지를 먼저 추가 (텍스트는 비어있음)
          setMessages((prev) => [...prev, newUserMessage]);
          setMessages((prev) => [...prev, botResponse]);
          setTypingMessageId(botResponse.id);
          
          // 타이핑 효과 시작
          let i = 0;
          const typingInterval = setInterval(() => {
            if (i < data.response_text.length) {
              setTypingText(data.response_text.substring(0, i + 1));
              i++;
            } else {
              clearInterval(typingInterval);
              setTypingMessageId(null);
              setTypingText('');
              
              // 타이핑이 끝나면 실제 메시지로 교체
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === botResponse.id 
                    ? { ...msg, text: data.response_text, isTyping: false }
                    : msg
                )
              );
              
              // TTS 재생 (응답이 완성된 후에 재생)
              if (data.response_audio_url) {
                playAudio(data.response_audio_url);
              }
            }
          }, 30); // 타이핑 속도 조절 (ms)

        } catch (err) {
          console.error("Conversation API error:", err);
          const errorMessage = {
            id: Date.now(),
            text: `오류가 발생했습니다: ${err.message}`,
            sender: "system",
            isError: true
          };
          setMessages((prev) => [...prev, errorMessage]);
        } finally {
          setIsProcessing(false); // 전체 처리 완료
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
        isError: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <header className={styles.chatHeader}>
        <Avatar color={character.color} type={character.type} isSpeaking={isProcessing} />
        <div className={styles.characterInfo}>
          <span className={styles.characterName}>{character.name} </span>
          <span className={styles.characterStatus}>Online</span>
        </div>
      </header>

      <div className={styles.messageList}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageBubble} ${
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            } ${msg.isError ? styles.errorMessage : ''} ${msg.isTyping ? styles.typing : ''}`}
          >
            {msg.id === typingMessageId ? typingText : msg.text}
            {msg.isTyping && <span className={styles.cursor}>|</span>}
          </div>
        ))}
        {isProcessing && (
          <div className={`${styles.messageBubble} ${styles.typingIndicator}`}>
            AI is creating response...
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
                className={`${styles.micMainButton} ${isRecording ? styles.recording : ''}`}
                onClick={handleMicClick}
                aria-label={isRecording ? "Stop recording" : "Start talking"}
              >
                {isRecording ? '⏹' : '🎤'}
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