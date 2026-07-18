"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";

export function RotatingBackground({
  images,
  intervalMs = 5000,
}: {
  images: StaticImageData[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <>
      {images.map((img, i) => (
        <Image
          key={i}
          src={img}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          placeholder="blur"
          className={`object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}
