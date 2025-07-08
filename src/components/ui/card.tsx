// src/components/ui/card.tsx
import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string  
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`p-6 border border-gray-200 rounded-lg shadow-md bg-white ${className}`}>
      {children}
    </div>
  )
}
