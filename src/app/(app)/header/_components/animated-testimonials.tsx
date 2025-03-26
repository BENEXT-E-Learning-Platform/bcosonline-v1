/* eslint-disable react/react-in-jsx-scope */
"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type CarouselImage = {
  src: string;
  alt: string;
};

export const AnimatedImageCarousel = ({
  images,
  interval = 5000,
}: {
  images: CarouselImage[];
  interval?: number;
}) => {
  const [active, setActive] = useState(0);

  // Auto-rotate images
  useEffect(() => {
    const autoplayInterval = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, interval);
    
    return () => clearInterval(autoplayInterval);
  }, [images.length, interval]);

  const isActive = (index: number) => {
    return index === active;
  };

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative">
        <div className="relative h-80 w-full">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.src}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: randomRotateY(),
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.7,
                  scale: isActive(index) ? 1 : 0.95,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) ? 0 : randomRotateY(),
                  zIndex: isActive(index)
                    ? 40
                    : images.length + 2 - index,
                  y: isActive(index) ? [0, -80, 0] : 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: randomRotateY(),
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 origin-bottom"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={1000}
                  height={500}
                  draggable={false}
                  className="h-full w-full rounded-3xl object-cover object-center"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};