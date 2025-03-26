/* eslint-disable react/prop-types */

import React from 'react';
import { motion } from 'motion';

export default function MotionReveal({ 
  children, 
  direction = "up", 
  duration = 0.5, 
  delay = 0,
  className = "",
  once = true,
  ...props 
}) {
  // Define animations for different directions
  const getAnimation = () => {
    switch (direction) {
      case "up":
        return { y: 50 };
      case "down":
        return { y: -50 };
      case "left":
        return { x: 50 };
      case "right":
        return { x: -50 };
      case "scale":
        return { scale: 0.9 };
      case "opacity":
        return { opacity: 0 };
      default:
        return { y: 50 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...getAnimation(),
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1.0], // Nice easing curve
        },
      }}
      viewport={{ once }}
      {...props}
    >
      {children}
    </motion.div>
  );
}