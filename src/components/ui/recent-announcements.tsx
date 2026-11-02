"use client";
import React from "react";

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  link?: string;
}

interface RecentAnnouncementsProps {
  className?: string;
  announcements?: NewsItem[];
}

const RecentAnnouncements: React.FC<RecentAnnouncementsProps> = ({
  className = "",
  announcements = [],
}) => {
  // Use announcements if provided, otherwise show placeholder
  const newsItems: NewsItem[] =
    announcements.length > 0
      ? announcements
      : [
          {
            id: "placeholder-1",
            title: "No announcements yet — check back soon",
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          },
        ];

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {/* Horizontal line above */}
      <div className="w-full border-t-2 border-white mb-4"></div>

      {/* Section Title */}
      <h3 className="text-foreground font-bold text-sm uppercase tracking-wide mb-4">
        RECENT CHAPTER ANNOUNCEMENTS
      </h3>

      {/* News List */}
      <ul className="w-full space-y-4 list-disc pl-5">
        {newsItems.map((item) => (
          <li key={item.id} className="flex flex-col marker:text-foreground">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-bmono text-sm leading-tight mb-1 no-underline"
              >
                {item.title}
              </a>
            ) : (
              <span className="text-blue-400 font-bmono text-sm leading-tight mb-1">
                {item.title}
              </span>
            )}
            <span className="text-gray-400 font-bmono text-sm">
              {item.date}
            </span>
          </li>
        ))}
      </ul>

      {/* Horizontal line below */}
      <div className="w-full border-t-2 border-white mt-4"></div>
    </div>
  );
};

export default RecentAnnouncements;
