"use client";
import Image from "next/image";
import React, { useRef, useEffect } from "react";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export interface TeamItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  location?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
  linkedin?: string;
  email?: string;
}

export interface TeamGridProps {
  items?: TeamItem[];
  className?: string;
}

const TeamGrid: React.FC<TeamGridProps> = ({ items, className = "" }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const data = items?.length ? items : [];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect();
      const isOverElement =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isOverElement) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleCardClick = (url?: string) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={rootRef}
      className={`relative w-full h-full flex flex-nowrap items-start gap-3 overflow-x-auto overflow-y-hidden px-4 pb-4 scrollbar-visible ${className}`}
    >
      {data.map((c, i) => (
        <article
          key={i}
          onClick={() => handleCardClick(c.url)}
          className="group relative flex flex-col w-[240px] shrink-0 rounded-[20px] overflow-hidden border-2 border-gray-600 cursor-pointer transition-colors duration-300"
          style={
            {
              "--card-border": c.borderColor || "transparent",
              background: c.gradient,
            } as React.CSSProperties
          }
        >
          <div className="relative z-10 flex-1 p-[10px] box-border">
            <Image
              src={c.image}
              alt={c.title}
              loading="lazy"
              width={800}
              height={800}
              className="w-60 h-60 object-cover rounded-[10px]"
            />
          </div>
          <footer className="relative z-10 p-3 text-foreground font-sans">
            <div className="flex flex-col gap-2">
              <h3 className="m-0 text-[1.05rem] font-semibold">{c.title}</h3>
              {c.location && (
                <span className="text-[0.85rem] opacity-85">{c.location}</span>
              )}
              <p className="m-0 text-[0.85rem] opacity-85">{c.subtitle}</p>
              <div className="flex items-center justify-center gap-3">
                {c.linkedin && (
                  <a
                    href={c.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-foreground/80 transition-colors duration-300"
                    aria-label={`${c.title} LinkedIn`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaLinkedin size={18} />
                  </a>
                )}
                {c.email && (
                  <a
                    href={`mailto:${c.email}`}
                    className="text-foreground hover:text-foreground/80 transition-colors duration-300"
                    aria-label={`${c.title} Email`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MdEmail size={18} />
                  </a>
                )}
              </div>
            </div>
          </footer>
        </article>
      ))}
    </div>
  );
};

export default TeamGrid;
