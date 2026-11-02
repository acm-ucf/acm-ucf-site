"use client";

import { useState, useEffect } from "react";
import EventModal from "./event-modal";
import { Event } from "@/types/event";
import { useEventModal } from "@/hooks/use-event-modal";

export interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  htmlLink?: string;
  status?: string;
  organizer?: {
    email: string;
    displayName?: string;
  };
  attendees?: Array<{
    email: string;
    responseStatus?: string;
  }>;
  colorId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  link?: string;
  allDay?: boolean;
  color?: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export interface CalendarProps {
  events?: CalendarEvent[];
  calendarId?: string;
  apiKey?: string;
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

export default function GoogleCalendar({ className = "" }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const {
    selectedEvent,
    isModalOpen,
    openModal: handleEventClick,
    closeModal,
  } = useEventModal<CalendarEvent>();

  const transformGoogleEvent = (
    googleEvent: GoogleCalendarEvent,
  ): CalendarEvent => {
    const isAllDay = !googleEvent.start.dateTime && !!googleEvent.start.date;

    // For all-day events, parse date string to avoid timezone issues
    // Google Calendar sends dates as "YYYY-MM-DD" for all-day events
    let startDate: Date;
    let endDate: Date;

    if (isAllDay) {
      // Parse all-day dates in local timezone to avoid UTC conversion issues
      const startDateStr = googleEvent.start.date || "";
      const [startYear, startMonth, startDay] = startDateStr
        .split("-")
        .map(Number);
      startDate = new Date(startYear, startMonth - 1, startDay);

      const endDateStr = googleEvent.end.date || "";
      const [endYear, endMonth, endDay] = endDateStr.split("-").map(Number);
      endDate = new Date(endYear, endMonth - 1, endDay);
    } else {
      // For timed events, use the dateTime string which includes timezone info
      startDate = new Date(googleEvent.start.dateTime!);
      endDate = new Date(googleEvent.end.dateTime!);
    }

    return {
      id: googleEvent.id,
      title: googleEvent.summary || "Untitled Event",
      description: googleEvent.description,
      start: startDate,
      end: endDate,
      location: googleEvent.location,
      link: googleEvent.htmlLink,
      allDay: isAllDay,
      color: googleEvent.colorId,
    };
  };

  const formatEventForModal = (event: CalendarEvent): Event => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      date: formatDate(event.start),
      startsAt: event.allDay ? undefined : formatTime(event.start),
      endsAt: event.allDay ? undefined : formatTime(event.end),
      location: event.location,
      link: event.link,
    };
  };

  // Fetch and transform events
  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data) => {
        const items: GoogleCalendarEvent[] = data.items || [];
        const transformed = items.map(transformGoogleEvent);
        setCalendarEvents(transformed);
      })
      .catch((error) => {
        console.error("Error fetching calendar events:", error);
      });
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Google Calendar's all-day event end dates are exclusive, so shift back a day
  const getInclusiveEventEnd = (event: CalendarEvent): Date => {
    const eventEnd = new Date(event.end);
    if (event.allDay) {
      eventEnd.setDate(eventEnd.getDate() - 1);
    }
    return eventEnd;
  };

  const getEventSpan = (
    event: CalendarEvent,
    year: number,
    month: number,
  ): { startDay: number; endDay: number; days: number[] } => {
    const eventStart = new Date(event.start);
    const eventEnd = getInclusiveEventEnd(event);

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    // Clamp event dates to current month
    const clampedStart = eventStart < monthStart ? monthStart : eventStart;
    const clampedEnd = eventEnd > monthEnd ? monthEnd : eventEnd;

    // Check if event overlaps with this month
    if (clampedStart > monthEnd || clampedEnd < monthStart) {
      return { startDay: 0, endDay: 0, days: [] };
    }

    const startDay = Math.max(1, clampedStart.getDate());
    const endDay = Math.min(daysInMonth, clampedEnd.getDate());

    const days: number[] = [];
    for (let day = startDay; day <= endDay; day++) {
      const dayDate = new Date(year, month, day);
      if (dayDate >= clampedStart && dayDate <= clampedEnd) {
        days.push(day);
      }
    }

    return { startDay, endDay, days };
  };

  // Get multi-day events map
  const getMultiDayEvents = (
    events: CalendarEvent[],
    year: number,
    month: number,
  ): Map<string, CalendarEvent> => {
    const multiDayMap = new Map<string, CalendarEvent>();
    events.forEach((event) => {
      const span = getEventSpan(event, year, month);
      if (span.days.length > 1) {
        multiDayMap.set(event.id, event);
      }
    });
    return multiDayMap;
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get events for a specific day
  const getEventsForDay = (day: number, includeMultiDay = true) => {
    const targetDate = new Date(year, month, day);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    const dayEvents: CalendarEvent[] = [];
    const multiDayEvents = getMultiDayEvents(calendarEvents, year, month);

    calendarEvents.forEach((event) => {
      const eventStart = new Date(event.start);
      const adjustedEventEnd = getInclusiveEventEnd(event);

      const eventStartYear = eventStart.getFullYear();
      const eventStartMonth = eventStart.getMonth();
      const eventStartDay = eventStart.getDate();

      const eventEndYear = adjustedEventEnd.getFullYear();
      const eventEndMonth = adjustedEventEnd.getMonth();
      const eventEndDay = adjustedEventEnd.getDate();

      // Create date objects for comparison (normalized to midnight)
      const eventStartDate = new Date(
        eventStartYear,
        eventStartMonth,
        eventStartDay,
      );
      const eventEndDate = new Date(eventEndYear, eventEndMonth, eventEndDay);
      const targetDateNormalized = new Date(targetYear, targetMonth, targetDay);

      if (
        targetDateNormalized >= eventStartDate &&
        targetDateNormalized <= eventEndDate
      ) {
        const isStartDay =
          targetYear === eventStartYear &&
          targetMonth === eventStartMonth &&
          targetDay === eventStartDay;

        if (includeMultiDay || !multiDayEvents.has(event.id) || isStartDay) {
          dayEvents.push(event);
        }
      }
    });

    // Sort: all-day first, then by start time
    return dayEvents.sort((a, b) => {
      if (a.allDay && !b.allDay) return -1;
      if (!a.allDay && b.allDay) return 1;
      if (!a.allDay && !b.allDay) {
        return a.start.getTime() - b.start.getTime();
      }
      return 0;
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const formatEventTime = (event: CalendarEvent) => {
    if (!event.start || event.allDay) return "All day";

    return event.start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const multiDayEventsMap = getMultiDayEvents(calendarEvents, year, month);

  const renderMonthView = () => {
    return (
      <>
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] sm:text-sm font-bmono font-semibold text-foreground/70 py-1 sm:py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((day, index) => {
            const allDayEvents = day ? getEventsForDay(day, true) : [];
            const today = day ? isToday(day) : false;

            const multiDayEventsForDay: Array<{
              event: CalendarEvent;
              span: { startDay: number; endDay: number; days: number[] };
            }> = [];
            const singleDayEvents: CalendarEvent[] = [];

            if (day) {
              allDayEvents.forEach((event) => {
                if (multiDayEventsMap.has(event.id)) {
                  const span = getEventSpan(event, year, month);
                  if (span.days.includes(day)) {
                    multiDayEventsForDay.push({ event, span });
                  }
                } else {
                  singleDayEvents.push(event);
                }
              });
            }

            return (
              <div
                key={index}
                className={`min-h-[60px] sm:min-h-[120px] min-w-0 rounded border sm:rounded-lg p-1.5 sm:p-2 relative overflow-hidden ${
                  day
                    ? today
                      ? "bg-yellow-400/20 border-yellow-400/50 backdrop-blur-sm"
                      : "bg-white/5 border-white/10 hover:border-white/20 backdrop-blur-sm"
                    : "bg-transparent border-transparent"
                } transition-colors`}
              >
                {day && (
                  <>
                    <div
                      className={`text-xs sm:text-sm font-bmono font-semibold mb-0.5 sm:mb-1 ${
                        today ? "text-yellow-400" : "text-foreground"
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {multiDayEventsForDay.map(({ event, span }) => {
                        const isStart = span.startDay === day;
                        const isEnd = span.endDay === day;
                        const isMiddle = !isStart && !isEnd;

                        return (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className={`text-xs p-1.5 rounded cursor-pointer hover:opacity-80 transition-all ${
                              event.allDay
                                ? "bg-yellow-400/30 text-foreground border-l-2 border-yellow-400"
                                : "bg-white/20 text-foreground backdrop-blur-sm"
                            }`}
                            title={`${event.title} ${event.location ? `- ${event.location}` : ""}`}
                          >
                            {isStart && (
                              <>
                                <div className="font-bmono font-medium truncate">
                                  {event.title}
                                </div>
                                {!event.allDay && (
                                  <div className="text-foreground/70 text-[10px] font-bmono">
                                    {formatEventTime(event)}
                                  </div>
                                )}
                              </>
                            )}
                            {(isMiddle || isEnd) && (
                              <div className="h-2 bg-current opacity-50 rounded"></div>
                            )}
                          </div>
                        );
                      })}

                      {singleDayEvents
                        .slice(0, Math.max(0, 3 - multiDayEventsForDay.length))
                        .map((event) => (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className={`text-xs p-1.5 rounded cursor-pointer hover:opacity-80 transition-colors truncate ${
                              event.allDay
                                ? "bg-yellow-400/30 text-foreground border-l-2 border-yellow-400"
                                : "bg-white/20 text-foreground backdrop-blur-sm"
                            }`}
                            title={`${event.title} ${event.location ? `- ${event.location}` : ""}`}
                          >
                            <div className="font-bmono font-medium truncate">
                              {event.title}
                            </div>
                            {!event.allDay && (
                              <div className="text-foreground/70 text-[10px] font-bmono">
                                {formatEventTime(event)}
                              </div>
                            )}
                          </div>
                        ))}

                      {allDayEvents.length > 3 && (
                        <div className="text-xs text-foreground/60 pl-1.5 font-bmono">
                          +{allDayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <div
        className={`w-full max-w-6xl mx-auto bg-black/40 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-white/10 ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-catamaran font-black text-foreground">
            {monthNames[month]} <span className="text-yellow-400">{year}</span>
          </h2>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm hover:cursor-pointer font-bmono font-medium text-foreground bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 border border-white/20 transition-colors"
            >
              Today
            </button>
            <button
              onClick={goToPreviousMonth}
              className="px-3 py-2 text-foreground hover:cursor-pointer bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 border border-white/20 transition-colors"
              aria-label="Previous month"
            >
              ←
            </button>
            <button
              onClick={goToNextMonth}
              className="px-3 py-2 text-foreground hover:cursor-pointer bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 border border-white/20 transition-colors"
              aria-label="Next month"
            >
              →
            </button>
          </div>
        </div>

        {renderMonthView()}
      </div>

      {selectedEvent && (
        <EventModal
          event={formatEventForModal(selectedEvent)}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
}
