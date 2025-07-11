"use client"; // This page uses hooks

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatInterface from "../components/ChatInterface";
import useBackgroundModal from "../hooks/useBackgroundModal";

function ChatPageContent() {
  const { background, openModal, modal } = useBackgroundModal();
  const searchParams = useSearchParams();

  const imageUrl = localStorage.getItem("generatedImage");

  // const typeMap = {
  //   Talki: "Talki",
  //   Moby: "Moby",
  //   Klaro: "Klaro",
  //   Sparkli: "Sparkli",
  // };

  const character = {
    color: searchParams.get("color") || "#cccccc",
    type: searchParams.get("type") || "Friend",
    trait: searchParams.get("trait") || "Nice",
  };

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: background ? `url(${background})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <button
        onClick={openModal}
        className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-lg shadow text-sm"
      >
        Change Background
      </button>

      <ChatInterface character={character} />

      {modal}
    </div>
  );

  // <ChatInterface character={character} />;
}

export default function ChatPage() {
  return (
    // Suspense is required by Next.js when using useSearchParams
    <Suspense fallback={<div>Loading your buddy...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
