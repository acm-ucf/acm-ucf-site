import { useState } from "react";

export function useEventModal<T>() {
  const [selectedEvent, setSelectedEvent] = useState<T | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (event: T) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return { selectedEvent, isModalOpen, openModal, closeModal };
}
