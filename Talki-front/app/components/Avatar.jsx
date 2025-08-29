"use client";

import { useEffect, useRef } from 'react';
import styles from './Avatar.module.css';

const getEmoji = (type) => {
  switch (type?.toLowerCase().split(" ")[0]) {
    case "talki":
      return "🐰";
    case "moby":
      return "🤖";
    case "klaro":
      return "🦖";
    case "puffy":
      return "🐶";
    case "mewi":
      return "🐱";
    case "waddles":
      return "🐧";
    case "bambo":
      return "🐼";
    case "sparkli":
      return "🦄";
    case "bubbli":
      return "🐠";
    case "zuzu":
      return "🐉";
    default:
      return "😊";
  }
};

export default function Avatar({ color, type, isSpeaking = false }) {
  const avatarRef = useRef(null);
  const emoji = getEmoji(type);
  const imageUrl = localStorage.getItem("generatedImage");

  useEffect(() => {
    const avatar = avatarRef.current;
    if (!avatar) return;

    if (isSpeaking) {
      avatar.style.animation = 'bounce 0.5s infinite alternate';
    } else {
      avatar.style.animation = 'none';
    }

    return () => {
      if (avatar) {
        avatar.style.animation = 'none';
      }
    };
  }, [isSpeaking]);

  return (
    <div 
      ref={avatarRef}
      className={styles.avatar}
      style={{ 
        backgroundColor: color || '#cccccc',
        '--bounce-height': '5px' // CSS 변수로 바운스 높이 조절

      }}
    >
      <img src={imageUrl} alt="Generated Character" style={{ width: '2.8rem', borderRadius: "50%", boxShadow: "0 4px 20px" }} />

    </div>
  );
}
