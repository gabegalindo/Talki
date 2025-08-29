import { useState } from "react";
import BackgroundSelectorModal from "../components/BackgroundSelectorModal";

export default function useBackgroundModal(defaultBackground = "") {
  const [isOpen, setIsOpen] = useState(false);
  const [background, setBackground] = useState(defaultBackground);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const modal = (
    <BackgroundSelectorModal
      isOpen={isOpen}
      onClose={closeModal}
      onSelect={(img) => {
        setBackground(img);
        closeModal();
      }}
    />
  );

  return { background, openModal, modal };
}
