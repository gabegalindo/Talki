"use client"; // This page uses hooks

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ChatInterface from "../components/ChatInterface";
import useBackgroundModal from "../hooks/useBackgroundModal";

function ChatPageContent() {
  const { background, openModal, modal } = useBackgroundModal();
  const searchParams = useSearchParams();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const storedImage = localStorage.getItem("generatedImage");
    if (storedImage) {
      setImageUrl(storedImage);
    }
  }, []);

  const character = {
    color: searchParams.get("color") || "#cccccc",
    name: searchParams.get("name") || "Friend",
    trait: searchParams.get("trait") || "Nice",
    background: searchParams.get("background") || "",
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: character.background
          ? `url(${character.background}) center/cover no-repeat`
          : "#f0f8ff",
      }}
    >
      <div style={{ flex: 2 }}>
        <ChatInterface character={character} />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Generated Character"
            style={{
              width: "20rem",
              borderRadius: "50%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              background: "#fff",
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    // Suspense is required by Next.js when using useSearchParams
    <Suspense fallback={<div>Loading your buddy...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
