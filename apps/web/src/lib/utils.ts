import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createHash } from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  const now = new Date()
  const messageDate = new Date(date)
  
  // Today
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase()
  }
  
  // This year
  if (messageDate.getFullYear() === now.getFullYear()) {
    return messageDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  // Previous years
  return messageDate.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function generateCode(length: number): string {
  return Array.from(
    { length }, 
    () => Math.floor(Math.random() * 10)
  ).join('')
}

export async function hashCode(code: string): Promise<string> {
  return createHash('sha256')
    .update(code)
    .digest('hex')
}
