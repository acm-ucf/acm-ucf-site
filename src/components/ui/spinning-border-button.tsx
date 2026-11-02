"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SpinningBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const SpinningBorderButton: React.FC<SpinningBorderButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "duration-200 relative inline h-10 overflow-hidden rounded-full p-px",
        className,
      )}
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffc478_0%,#cc8314_50%,#fff5cb_100%)]"></span>
      <span
        className="inline-flex h-full w-full cursor-pointer items-center
         justify-center rounded-full bg-slate-950 px-2 py-1
       font-medium font-bmono text-sm text-yellow-500 backdrop-blur-3xl"
      >
        {children}
      </span>
    </button>
  );
};
