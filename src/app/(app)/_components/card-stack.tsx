/* eslint-disable react/react-in-jsx-scope */
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QuoteIcon } from "lucide-react";

type Card = {
  id: number;
  name: string;
  designation: string;
  content: string;
  avatar?: string;
  rating?: number;
};

export const CardStack = ({
  items,
  offset = 10,
  scaleFactor = 0.06,
  autoFlipDelay = 5000,
  pauseOnHover = true,
  rightShift = 20, // New prop for controlling right shift
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
  autoFlipDelay?: number;
  pauseOnHover?: boolean;
  rightShift?: number; // New prop
}) => {
  const [cards, setCards] = useState<Card[]>(items);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isPaused) {
      interval = setInterval(() => {
        setCards((prevCards) => {
          const newArray = [...prevCards];
          newArray.unshift(newArray.pop()!);
          return newArray;
        });
      }, autoFlipDelay);
    }

    return () => clearInterval(interval);
  }, [isPaused, autoFlipDelay]);

  const handleDotClick = (index: number) => {
    const currentIndex = items.findIndex((item) => item.id === cards[0].id);
    const rotations = (index - currentIndex + items.length) % items.length;
    setCards((prev) => {
      const newArray = [...prev];
      for (let j = 0; j < rotations; j++) {
        newArray.unshift(newArray.pop()!);
      }
      return newArray;
    });
  };

  return (
    <div
      className="relative h-60 w-full max-w-md"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute bg-white dark:bg-gray-900 h-full w-full rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col justify-between overflow-hidden"
          style={{ transformOrigin: "top center" }}
          animate={{
            top: index * -offset,
            left: index > 0 ? index * rightShift : 0, // Shift cards to the right
            scale: 1 - index * scaleFactor,
            zIndex: cards.length - index,
            opacity: index < 3 ? 1 - index * 0.2 : 0, // Reduced opacity fade
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            left: { duration: 0.2 } // Smoother left shift transition
          }}
          initial={false}
        >
          <div className="flex flex-col h-full">
            {/* Quote Icon */}
            <QuoteIcon className="text-gray-300 dark:text-gray-700 w-8 h-8 mb-4" />

            {/* Card Content */}
            <div className="flex-grow">
              <p className="font-normal text-gray-600 dark:text-gray-300 text-lg leading-relaxed line-clamp-5">
                {card.content}
              </p>
            </div>

            {/* Footer with User Info */}
            <div className="mt-auto pt-4">
              <div className="flex items-center gap-4">
                {card.avatar ? (
                  <img
                    src={card.avatar}
                    alt={card.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {card.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 dark:text-white font-medium truncate">
                    {card.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                    {card.designation}
                  </p>
                  {card.rating && (
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < card.rating! 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);