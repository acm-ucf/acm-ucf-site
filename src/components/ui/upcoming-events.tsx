"use client";
import React from "react";
import EventModal from "./event-modal";
import { Event } from "@/types/event";
import { useEventModal } from "@/hooks/use-event-modal";

interface UpcomingEventsProps {
  className?: string;
  events: Event[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  className = "",
  events,
}) => {
  const {
    selectedEvent,
    isModalOpen,
    openModal: handleLearnMore,
    closeModal: handleCloseModal,
  } = useEventModal<Event>();

  return (
    <div className={`w-full py-16 bg-grey ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={event.id}>
              <div className="flex items-center space-x-6 p-6">
                <div className="shrink-0">
                  <div className="w-24 h-24 bg-gray-400 rounded-2xl overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="grow">
                  <h3 className="text-2xl font-bold text-gray-200 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-lg text-gray-200 mb-1">{event.date}</p>
                  <p className="text-lg text-gray-200">{event.location}</p>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => handleLearnMore(event)}
                    className="inline-block bg-white text-black font-bold px-6 py-3 rounded-2xl hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
                  >
                    Learn More
                  </button>
                </div>
              </div>

              {index < events.length - 1 && (
                <div className="border-t border-gray-600 mx-6"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default UpcomingEvents;
