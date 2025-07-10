// src/components/ui/card.tsx
import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string  
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`p-6 rounded-xl bg-transparent border-0 outline-none shadow-none ${className}`}>
      {children}
    </div>
  )
}