import React from "react";

const sampleImages = [
  "/backgrounds/forest.jpg",
  "/backgrounds/beach.jpg",
  "/backgrounds/space.jpg",
  "/backgrounds/pastel.jpg",
];

export default function BackgroundSelectorModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Choose a Background</h2>
        <div className="grid grid-cols-2 gap-4">
          {sampleImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelect(img);
                onClose();
              }}
              className="rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500"
            >
              <img
                src={img}
                alt={`Background ${idx}`}
                className="w-full h-24 object-cover"
              />
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full text-blue-600 hover:underline text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
