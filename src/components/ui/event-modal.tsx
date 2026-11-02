"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Event } from "@/types/event";

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !event || !mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className="fixed inset-0 z-9998 flex bg-black/80 items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md bg-black h-auto max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-transparent backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/10">
            <div className="bg-transparent backdrop-blur-sm p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-foreground hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                ×
              </button>
              {event.image && (
                <div className="h-32 flex items-center justify-center">
                  <img
                    src={event.image}
                    alt="Event"
                    className="w-full h-full object-cover rounded-lg opacity-90"
                  />
                </div>
              )}
            </div>

            <div className="bg-transparent backdrop-blur-sm p-6">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {event.title}
              </h2>

              <div className="text-foreground mb-4">
                <p className="text-lg">
                  {event.startsAt && event.endsAt ? (
                    <>
                      {event.startsAt} - {event.endsAt}
                    </>
                  ) : event.startsAt ? (
                    <>{event.startsAt}</>
                  ) : event.endsAt ? (
                    <>{event.endsAt}</>
                  ) : null}
                </p>
                <p className="text-lg">{event.date}</p>
                <p className="text-lg">{event.location}</p>
              </div>

              <p className="text-foreground text-base leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default EventModal;
