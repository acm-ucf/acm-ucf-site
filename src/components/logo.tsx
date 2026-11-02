"use client";
import Image from "next/image";
import { ComponentProps } from "react";

type LogoProps = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  alt?: string;
};

export const Logo = ({
  alt = "ACM@UCF Logo",
  width = 48,
  height = 62,
  ...props
}: LogoProps) => (
  <Image
    className="hover:cursor-pointer"
    src="/logo.svg"
    alt={alt}
    width={width}
    height={height}
    onClick={() => {
      window.location.href = "/";
    }}
    priority
    {...props}
  />
);
