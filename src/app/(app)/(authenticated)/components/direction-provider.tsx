"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Direction = "ltr" | "rtl"

interface DirectionContextProps {
  direction: Direction
  setDirection: (direction: Direction) => void
}

const DirectionContext = createContext<DirectionContextProps | undefined>(undefined)

export function DirectionProvider({ children }: { children: React.ReactNode }) {
  const [direction, setDirection] = useState<Direction>("ltr")

  useEffect(() => {
    document.documentElement.dir = direction
  }, [direction])

  return <DirectionContext.Provider value={{ direction, setDirection }}>{children}</DirectionContext.Provider>
}

export function useDirection() {
  const context = useContext(DirectionContext)
  if (context === undefined) {
    throw new Error("useDirection must be used within a DirectionProvider")
  }
  return context
}

