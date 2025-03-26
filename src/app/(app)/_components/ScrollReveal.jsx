/* eslint-disable react/prop-types */
'use client'

import React, { useEffect, useRef } from 'react';

export default function ScrollReveal({ 
  children,
  threshold = 0.1,
  rootMargin = "0px",
  delay = 0,
  distance = "20px",
  duration = 800,
  direction = "up",
  once = true,
  className = "",
}) {
  const ref = useRef(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    // Set initial styles for animation
    element.style.opacity = "0";
    element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
    element.style.transitionDelay = `${delay}ms`;
    
    // Set the starting position based on direction
    switch (direction) {
      case "up":
        element.style.transform = `translateY(${distance})`;
        break;
      case "down":
        element.style.transform = `translateY(-${distance})`;
        break;
      case "left":
        element.style.transform = `translateX(${distance})`;
        break;
      case "right":
        element.style.transform = `translateX(-${distance})`;
        break;
      default:
        element.style.transform = `translateY(${distance})`;
    }
    
    // Create observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // When element is visible
          element.style.opacity = "1";
          element.style.transform = "translate3d(0, 0, 0)";
          
          // If once is true, unobserve after animation
          if (once) observer.unobserve(element);
        } else if (!once) {
          // Reset the animation when element is not visible
          element.style.opacity = "0";
          
          switch (direction) {
            case "up":
              element.style.transform = `translateY(${distance})`;
              break;
            case "down":
              element.style.transform = `translateY(-${distance})`;
              break;
            case "left":
              element.style.transform = `translateX(${distance})`;
              break;
            case "right":
              element.style.transform = `translateX(-${distance})`;
              break;
            default:
              element.style.transform = `translateY(${distance})`;
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    );
    
    observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, rootMargin, once, delay, duration, direction, distance]);
  
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}