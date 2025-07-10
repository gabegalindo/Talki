"use client"; // This page uses hooks

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatInterface from "../components/ChatInterface";
import useBackgroundModal from "../hooks/useBackgroundModal";

function ChatPageContent() {
  const { background, openModal, modal } = useBackgroundModal();
  const searchParams = useSearchParams();

  const typeMap = {
    Talki: "animal",
    Moby: "robot",
    Klaro: "dinosaur",
  };

  const characterType = typeMap[searchParams.get("type")] || "";

  const character = {
    color: searchParams.get("color") || "#cccccc",
    type: characterType || "Friend",
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
